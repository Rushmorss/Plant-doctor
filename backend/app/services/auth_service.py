"""Nghiệp vụ xác thực: đăng ký, đăng nhập, quên mật khẩu (OTP) và đặt lại mật khẩu."""
import logging
from datetime import timedelta

from argon2 import PasswordHasher
from argon2.exceptions import InvalidHashError, VerificationError
from flask import current_app
from flask_jwt_extended import create_access_token, create_refresh_token
from sqlalchemy.exc import IntegrityError, SQLAlchemyError

from app.models.user import User, utcnow
from app.repositories.user_repository import (
    PasswordResetOTPRepository as OTPRepo,
    PasswordResetTokenRepository as TokenRepo,
    UserRepository,
)
from app.services.email_service import EmailService
from app.utils.exceptions import AppError
from app.utils.otp_generator import (
    generate_otp,
    generate_reset_token,
    hash_otp,
    hash_token,
    verify_otp_hash,
)

logger = logging.getLogger(__name__)

_hasher = PasswordHasher()  # Argon2id với tham số mặc định an toàn
# Hash giả để việc kiểm tra email không tồn tại tốn thời gian tương đương (chống timing attack)
_DUMMY_HASH = _hasher.hash("dummy-password-for-timing-equalization")

INVALID_CREDENTIALS = "Email hoặc mật khẩu không chính xác"
INVALID_OTP = "Mã OTP không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu mã mới."
INVALID_RESET_SESSION = (
    "Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng thực hiện lại từ đầu."
)


def _verify_password(password_hash: str, password: str) -> bool:
    try:
        return _hasher.verify(password_hash, password)
    except (VerificationError, InvalidHashError):
        return False


class AuthService:
    # ------------------------------------------------------------------ REGISTER
    @staticmethod
    def register(data: dict) -> User:
        """Tạo tài khoản mới. Role luôn là 'user' — không đọc từ dữ liệu client."""
        if UserRepository.get_by_email(data["email"]):
            raise AppError(
                "Email đã được đăng ký",
                409,
                {"email": ["Email này đã được sử dụng bởi một tài khoản khác"]},
            )

        user = User(
            full_name=data["full_name"],
            email=data["email"],
            user_type=data["user_type"],
            role=User.ROLE_USER,
            password_hash=_hasher.hash(data["password"]),
        )
        try:
            UserRepository.add(user)
            UserRepository.commit()
        except IntegrityError:  # hai request đăng ký cùng email chạy song song
            UserRepository.rollback()
            raise AppError(
                "Email đã được đăng ký",
                409,
                {"email": ["Email này đã được sử dụng bởi một tài khoản khác"]},
            )
        except SQLAlchemyError:
            UserRepository.rollback()
            raise
        logger.info("Đăng ký tài khoản mới user_id=%s", user.id)
        return user

    # --------------------------------------------------------------------- LOGIN
    @staticmethod
    def login(email: str, password: str) -> dict:
        cfg = current_app.config
        user = UserRepository.get_by_email(email)

        if user is None:
            _verify_password(_DUMMY_HASH, password)  # cân bằng thời gian xử lý
            raise AppError(INVALID_CREDENTIALS, 401)

        now = utcnow()
        if user.locked_until and user.locked_until > now:
            raise AppError(
                "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau ít phút.", 429
            )

        if not _verify_password(user.password_hash, password):
            user.failed_login_attempts += 1
            if user.failed_login_attempts >= cfg["LOGIN_MAX_ATTEMPTS"]:
                user.locked_until = now + timedelta(minutes=cfg["LOGIN_LOCK_MINUTES"])
                user.failed_login_attempts = 0
                logger.warning("Khoá tạm thời đăng nhập user_id=%s", user.id)
            UserRepository.commit()
            raise AppError(INVALID_CREDENTIALS, 401)

        if not user.is_active:
            raise AppError("Tài khoản đã bị vô hiệu hoá", 403)

        # Thành công: reset bộ đếm, nâng cấp hash nếu tham số Argon2 đã thay đổi
        user.failed_login_attempts = 0
        user.locked_until = None
        if _hasher.check_needs_rehash(user.password_hash):
            user.password_hash = _hasher.hash(password)
        UserRepository.commit()

        return {"user": user, **AuthService._issue_tokens(user)}

    @staticmethod
    def _issue_tokens(user: User) -> dict:
        # "tv" (token version) cho phép thu hồi toàn bộ phiên cũ khi đổi mật khẩu
        claims = {"tv": user.token_version, "role": user.role}
        return {
            "access_token": create_access_token(identity=str(user.id), additional_claims=claims),
            "refresh_token": create_refresh_token(identity=str(user.id), additional_claims=claims),
            "token_type": "Bearer",
            "expires_in": int(current_app.config["JWT_ACCESS_TOKEN_EXPIRES"].total_seconds()),
        }

    @staticmethod
    def refresh_access_token(user_id: int) -> dict:
        user = UserRepository.get_by_id(user_id)
        if user is None or not user.is_active:
            raise AppError("Phiên đăng nhập không hợp lệ", 401)
        claims = {"tv": user.token_version, "role": user.role}
        return {
            "access_token": create_access_token(identity=str(user.id), additional_claims=claims),
            "token_type": "Bearer",
            "expires_in": int(current_app.config["JWT_ACCESS_TOKEN_EXPIRES"].total_seconds()),
        }

    # ------------------------------------------------------------ FORGOT PASSWORD
    @staticmethod
    def forgot_password(email: str) -> None:
        """Bước 1: tạo & gửi OTP. Không báo lỗi dù email có tồn tại hay không.

        Các giới hạn (cooldown, tối đa N OTP/giờ) được áp lặng lẽ để không lộ sự tồn tại
        của tài khoản; chống spam theo IP do Flask-Limiter đảm nhiệm ở tầng route.
        """
        cfg = current_app.config
        user = UserRepository.get_by_email(email)
        if user is None or not user.is_active:
            return

        now = utcnow()
        latest = OTPRepo.get_latest(user.id)
        if latest and (now - latest.created_at).total_seconds() < cfg["OTP_RESEND_COOLDOWN_SECONDS"]:
            logger.info("Bỏ qua yêu cầu OTP (cooldown) user_id=%s", user.id)
            return
        if OTPRepo.count_since(user.id, now - timedelta(hours=1)) >= cfg["OTP_MAX_REQUESTS_PER_HOUR"]:
            logger.warning("Vượt giới hạn OTP/giờ user_id=%s", user.id)
            return

        otp = generate_otp()
        try:
            OTPRepo.invalidate_all(user.id)  # chỉ OTP mới nhất có hiệu lực
            OTPRepo.create(
                user_id=user.id,
                otp_hash=hash_otp(otp, user.id),
                expires_at=now + timedelta(minutes=cfg["OTP_EXPIRES_MINUTES"]),
            )
            UserRepository.commit()
        except SQLAlchemyError:
            UserRepository.rollback()
            raise

        EmailService.dispatch_password_reset_otp(user.email, user.full_name, otp)

    @staticmethod
    def verify_otp(email: str, otp: str) -> dict:
        """Bước 2: kiểm tra OTP, nếu đúng cấp reset token ngắn hạn.

        Mọi lỗi đều trả cùng một thông báo để không lộ thông tin tài khoản.
        """
        cfg = current_app.config
        user = UserRepository.get_by_email(email)
        if user is None or not user.is_active:
            raise AppError(INVALID_OTP, 400)

        record = OTPRepo.get_latest_active(user.id)
        if record is None:
            raise AppError(INVALID_OTP, 400)

        now = utcnow()
        if record.expires_at <= now or record.attempts >= cfg["OTP_MAX_ATTEMPTS"]:
            record.is_used = True
            UserRepository.commit()
            raise AppError(INVALID_OTP, 400)

        if not verify_otp_hash(otp, user.id, record.otp_hash):
            record.attempts += 1
            if record.attempts >= cfg["OTP_MAX_ATTEMPTS"]:
                record.is_used = True  # hết lượt thử -> buộc yêu cầu OTP mới
            UserRepository.commit()
            raise AppError(INVALID_OTP, 400)

        raw_token, token_hash = generate_reset_token()
        ttl = cfg["RESET_TOKEN_EXPIRES_MINUTES"]
        try:
            record.is_used = True  # OTP chỉ dùng một lần
            TokenRepo.invalidate_all(user.id)
            TokenRepo.create(user.id, token_hash, now + timedelta(minutes=ttl))
            UserRepository.commit()
        except SQLAlchemyError:
            UserRepository.rollback()
            raise

        return {"reset_token": raw_token, "expires_in": ttl * 60}

    @staticmethod
    def reset_password(email: str, reset_token: str, new_password: str) -> None:
        """Bước 3: đặt mật khẩu mới trong MỘT transaction duy nhất."""
        user = UserRepository.get_by_email(email)
        if user is None or not user.is_active:
            raise AppError(INVALID_RESET_SESSION, 401)

        token = TokenRepo.get_valid(user.id, hash_token(reset_token), utcnow())
        if token is None:
            raise AppError(INVALID_RESET_SESSION, 401)

        try:
            user.password_hash = _hasher.hash(new_password)
            user.token_version += 1  # thu hồi toàn bộ access/refresh token cũ
            user.failed_login_attempts = 0
            user.locked_until = None
            token.is_used = True
            OTPRepo.invalidate_all(user.id)
            TokenRepo.invalidate_all(user.id)
            UserRepository.commit()
        except SQLAlchemyError:
            UserRepository.rollback()
            raise
        logger.info("Đặt lại mật khẩu thành công user_id=%s", user.id)

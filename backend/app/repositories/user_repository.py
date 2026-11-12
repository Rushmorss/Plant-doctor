"""Tầng truy cập dữ liệu (Repository). Chỉ làm việc với DB, không chứa nghiệp vụ.

Các hàm ghi dữ liệu KHÔNG commit; Service quyết định commit/rollback để gom nhiều
thao tác vào một transaction.
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import func, select, update

from app.extensions import db
from app.models.user import PasswordResetOTP, PasswordResetToken, User


class UserRepository:
    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        return db.session.get(User, user_id)

    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        return db.session.execute(select(User).where(User.email == email)).scalar_one_or_none()

    @staticmethod
    def add(user: User) -> User:
        db.session.add(user)
        db.session.flush()
        return user

    @staticmethod
    def commit() -> None:
        db.session.commit()

    @staticmethod
    def rollback() -> None:
        db.session.rollback()


class PasswordResetOTPRepository:
    @staticmethod
    def create(user_id: int, otp_hash: str, expires_at: datetime) -> PasswordResetOTP:
        record = PasswordResetOTP(user_id=user_id, otp_hash=otp_hash, expires_at=expires_at)
        db.session.add(record)
        db.session.flush()
        return record

    @staticmethod
    def get_latest(user_id: int) -> Optional[PasswordResetOTP]:
        stmt = (
            select(PasswordResetOTP)
            .where(PasswordResetOTP.user_id == user_id)
            .order_by(PasswordResetOTP.created_at.desc(), PasswordResetOTP.id.desc())
            .limit(1)
        )
        return db.session.execute(stmt).scalar_one_or_none()

    @staticmethod
    def get_latest_active(user_id: int) -> Optional[PasswordResetOTP]:
        """OTP mới nhất chưa dùng. Khoá hàng (FOR UPDATE) để tránh race khi đếm số lần sai."""
        stmt = (
            select(PasswordResetOTP)
            .where(PasswordResetOTP.user_id == user_id, PasswordResetOTP.is_used.is_(False))
            .order_by(PasswordResetOTP.created_at.desc(), PasswordResetOTP.id.desc())
            .limit(1)
            .with_for_update()
        )
        return db.session.execute(stmt).scalar_one_or_none()

    @staticmethod
    def count_since(user_id: int, since: datetime) -> int:
        stmt = select(func.count(PasswordResetOTP.id)).where(
            PasswordResetOTP.user_id == user_id, PasswordResetOTP.created_at >= since
        )
        return db.session.execute(stmt).scalar_one()

    @staticmethod
    def invalidate_all(user_id: int) -> None:
        db.session.execute(
            update(PasswordResetOTP)
            .where(PasswordResetOTP.user_id == user_id, PasswordResetOTP.is_used.is_(False))
            .values(is_used=True)
        )


class PasswordResetTokenRepository:
    @staticmethod
    def create(user_id: int, token_hash: str, expires_at: datetime) -> PasswordResetToken:
        record = PasswordResetToken(user_id=user_id, token_hash=token_hash, expires_at=expires_at)
        db.session.add(record)
        db.session.flush()
        return record

    @staticmethod
    def get_valid(user_id: int, token_hash: str, now: datetime) -> Optional[PasswordResetToken]:
        """Token còn hiệu lực (chưa dùng, chưa hết hạn), khoá hàng để chống dùng song song."""
        stmt = (
            select(PasswordResetToken)
            .where(
                PasswordResetToken.user_id == user_id,
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.is_used.is_(False),
                PasswordResetToken.expires_at > now,
            )
            .with_for_update()
        )
        return db.session.execute(stmt).scalar_one_or_none()

    @staticmethod
    def invalidate_all(user_id: int) -> None:
        db.session.execute(
            update(PasswordResetToken)
            .where(PasswordResetToken.user_id == user_id, PasswordResetToken.is_used.is_(False))
            .values(is_used=True)
        )

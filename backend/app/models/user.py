"""Các model: User, PasswordResetOTP, PasswordResetToken.

Thời gian lưu dạng UTC "naive" (DATETIME của MySQL không có timezone).
"""
from datetime import datetime, timezone

from app.extensions import db


def utcnow() -> datetime:
    """Thời điểm hiện tại theo UTC (naive) để lưu/so sánh với cột DATETIME."""
    return datetime.now(timezone.utc).replace(tzinfo=None)


class User(db.Model):
    __tablename__ = "users"

    ROLE_USER = "user"
    ROLE_ADMIN = "admin"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(254), nullable=False, unique=True, index=True)
    user_type = db.Column(db.String(30), nullable=False)
    # Quyền hệ thống: chỉ được gán phía server, KHÔNG nhận từ dữ liệu đăng ký công khai
    role = db.Column(db.String(20), nullable=False, default=ROLE_USER)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    # Chống dò mật khẩu
    failed_login_attempts = db.Column(db.Integer, nullable=False, default=0)
    locked_until = db.Column(db.DateTime, nullable=True)

    # Tăng lên mỗi lần đặt lại mật khẩu => toàn bộ JWT cũ bị thu hồi
    token_version = db.Column(db.Integer, nullable=False, default=0)

    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=utcnow, onupdate=utcnow)

    def __repr__(self) -> str:  # không in thông tin nhạy cảm
        return f"<User id={self.id}>"


class PasswordResetOTP(db.Model):
    __tablename__ = "password_reset_otps"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    otp_hash = db.Column(db.String(64), nullable=False)  # HMAC-SHA256 hex
    expires_at = db.Column(db.DateTime, nullable=False)
    attempts = db.Column(db.Integer, nullable=False, default=0)
    is_used = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)


class PasswordResetToken(db.Model):
    """Quyền đặt lại mật khẩu ngắn hạn, cấp sau khi xác thực OTP thành công."""

    __tablename__ = "password_reset_tokens"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    token_hash = db.Column(db.String(64), nullable=False, unique=True)  # SHA-256 hex
    expires_at = db.Column(db.DateTime, nullable=False)
    is_used = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=utcnow)

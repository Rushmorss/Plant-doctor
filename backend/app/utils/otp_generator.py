"""Sinh & băm OTP / reset token.

- OTP 6 chữ số chỉ có 10^6 khả năng, nên dùng HMAC-SHA256 với khoá bí mật của server
  (SECRET_KEY) + user_id: nếu lộ DB mà không lộ SECRET_KEY thì không thể brute-force offline.
- Reset token có entropy cao (256 bit) nên SHA-256 thường là đủ.
"""
import hashlib
import hmac
import secrets

from flask import current_app


def generate_otp() -> str:
    """OTP ngẫu nhiên an toàn mật mã gồm đúng 6 chữ số (giữ số 0 đầu)."""
    return f"{secrets.randbelow(10 ** 6):06d}"


def hash_otp(otp: str, user_id: int) -> str:
    key = current_app.config["SECRET_KEY"].encode("utf-8")
    message = f"{user_id}:{otp}".encode("utf-8")
    return hmac.new(key, message, hashlib.sha256).hexdigest()


def verify_otp_hash(otp: str, user_id: int, expected_hash: str) -> bool:
    return hmac.compare_digest(hash_otp(otp, user_id), expected_hash)


def generate_reset_token():
    """Trả về (token_gốc_gửi_cho_client, token_hash_lưu_DB)."""
    raw = secrets.token_urlsafe(32)
    return raw, hash_token(raw)


def hash_token(raw_token: str) -> str:
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

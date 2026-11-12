"""Hàm kiểm tra dữ liệu dùng chung cho các Schema."""
import re
import unicodedata

from flask import request

from app.utils.exceptions import AppError

PASSWORD_MIN_LENGTH = 8
PASSWORD_MAX_LENGTH = 128  # tránh DoS bằng mật khẩu cực dài khi hash

_NAME_REGEX = re.compile(r"[^\W\d_]+(?:[ '.\-]+[^\W\d_]+)*\.?")  # chỉ chữ cái + khoảng trắng/'.-
_OTP_REGEX = re.compile(r"[0-9]{6}")


def normalize_email(value: str) -> str:
    return value.strip().lower()


def normalize_text(value: str) -> str:
    """Chuẩn hoá Unicode NFC và gộp khoảng trắng thừa (giúp tên tiếng Việt nhất quán)."""
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", value)).strip()


def password_strength_errors(password: str) -> list:
    """Trả về danh sách lỗi độ mạnh mật khẩu (rỗng nếu hợp lệ)."""
    errors = []
    if len(password) < PASSWORD_MIN_LENGTH:
        errors.append(f"Mật khẩu phải có ít nhất {PASSWORD_MIN_LENGTH} ký tự")
    if len(password) > PASSWORD_MAX_LENGTH:
        errors.append(f"Mật khẩu không được vượt quá {PASSWORD_MAX_LENGTH} ký tự")
    if not any(c.isupper() for c in password):
        errors.append("Mật khẩu phải có ít nhất một chữ cái viết hoa")
    if not any(c.islower() for c in password):
        errors.append("Mật khẩu phải có ít nhất một chữ cái viết thường")
    if not any(c in "0123456789" for c in password):
        errors.append("Mật khẩu phải có ít nhất một chữ số")
    if not any(not c.isalnum() and not c.isspace() for c in password):
        errors.append("Mật khẩu phải có ít nhất một ký tự đặc biệt")
    return errors


def full_name_error(name: str):
    """Trả về thông báo lỗi nếu họ tên không hợp lệ, ngược lại None."""
    if not 2 <= len(name) <= 100:
        return "Họ và tên phải từ 2 đến 100 ký tự"
    if not _NAME_REGEX.fullmatch(name):
        return "Họ và tên chỉ được chứa chữ cái, khoảng trắng và các ký tự ' . -"
    return None


def is_valid_otp_format(otp: str) -> bool:
    return bool(_OTP_REGEX.fullmatch(otp))


def load_json(schema):
    """Đọc JSON body và validate bằng Marshmallow schema.

    Raises:
        AppError: body không phải JSON object.
        marshmallow.ValidationError: dữ liệu không hợp lệ (error handler trả 400).
    """
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        raise AppError("Dữ liệu gửi lên phải là một JSON object hợp lệ", 400)
    return schema.load(payload)

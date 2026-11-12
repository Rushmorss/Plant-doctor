"""Marshmallow schema: validate request và serialize response.

Mọi schema dùng unknown=EXCLUDE: field lạ (vd. "role": "admin") bị bỏ qua hoàn toàn,
nên không thể leo thang quyền qua dữ liệu đăng ký công khai.
"""
from flask import current_app
from marshmallow import EXCLUDE, ValidationError, fields, pre_load, validates_schema

from app.extensions import ma
from app.utils import validators as v


def _msg(label: str) -> dict:
    return {
        "required": f"{label} là bắt buộc",
        "null": f"{label} không được để trống",
        "invalid": f"{label} không hợp lệ",
    }


def _text(label: str, **kwargs):
    return fields.String(required=True, error_messages=_msg(label), **kwargs)


def _normalize(data, *, text=(), email=(), lower=()):
    """Chuẩn hoá chuỗi đầu vào (bỏ khoảng trắng thừa, email/user_type về chữ thường)."""
    if not isinstance(data, dict):
        return data
    data = dict(data)
    for key in text:
        if isinstance(data.get(key), str):
            data[key] = v.normalize_text(data[key])
    for key in email:
        if isinstance(data.get(key), str):
            data[key] = v.normalize_email(data[key])
    for key in lower:
        if isinstance(data.get(key), str):
            data[key] = data[key].strip().lower()
    return data


def _validate_email_length(value: str):
    if len(value) > 254:
        raise ValidationError("Email không được vượt quá 254 ký tự")


def _validate_new_password(value: str):
    errors = v.password_strength_errors(value)
    if errors:
        raise ValidationError(errors)


def _validate_login_password(value: str):
    if not value:
        raise ValidationError("Mật khẩu không được để trống")
    if len(value) > v.PASSWORD_MAX_LENGTH:
        raise ValidationError("Mật khẩu quá dài")


def _validate_full_name(value: str):
    error = v.full_name_error(value)
    if error:
        raise ValidationError(error)


def _validate_user_type(value: str):
    allowed = current_app.config["ALLOWED_USER_TYPES"]
    if value not in allowed:
        raise ValidationError(f"Giá trị hợp lệ: {', '.join(allowed)}")


def _check_confirm(data, password_key: str):
    if (
        password_key in data
        and "confirm_password" in data
        and data[password_key] != data["confirm_password"]
    ):
        raise ValidationError("Mật khẩu xác nhận không khớp", "confirm_password")


class RegisterSchema(ma.Schema):
    class Meta:
        unknown = EXCLUDE

    full_name = _text("Họ và tên", validate=_validate_full_name)
    email = fields.Email(
        required=True,
        validate=_validate_email_length,
        error_messages={**_msg("Email"), "invalid": "Email không đúng định dạng"},
    )
    user_type = _text("Loại người dùng", validate=_validate_user_type)
    password = _text("Mật khẩu", validate=_validate_new_password)
    confirm_password = _text("Xác nhận mật khẩu")

    @pre_load
    def normalize(self, data, **kwargs):
        return _normalize(data, text=("full_name",), email=("email",), lower=("user_type",))

    @validates_schema(skip_on_field_errors=False)
    def passwords_match(self, data, **kwargs):
        _check_confirm(data, "password")


class LoginSchema(ma.Schema):
    """Đăng nhập chỉ kiểm tra định dạng, KHÔNG áp luật độ mạnh mật khẩu."""

    class Meta:
        unknown = EXCLUDE

    email = fields.Email(
        required=True,
        validate=_validate_email_length,
        error_messages={**_msg("Email"), "invalid": "Email không đúng định dạng"},
    )
    password = _text("Mật khẩu", validate=_validate_login_password)

    @pre_load
    def normalize(self, data, **kwargs):
        return _normalize(data, email=("email",))


class ForgotPasswordSchema(ma.Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email(
        required=True,
        validate=_validate_email_length,
        error_messages={**_msg("Email"), "invalid": "Email không đúng định dạng"},
    )

    @pre_load
    def normalize(self, data, **kwargs):
        return _normalize(data, email=("email",))


def _validate_otp(value: str):
    if not v.is_valid_otp_format(value):
        raise ValidationError("OTP phải gồm đúng 6 chữ số")


class VerifyOTPSchema(ma.Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email(
        required=True,
        validate=_validate_email_length,
        error_messages={**_msg("Email"), "invalid": "Email không đúng định dạng"},
    )
    otp = _text("Mã OTP", validate=_validate_otp)

    @pre_load
    def normalize(self, data, **kwargs):
        data = _normalize(data, email=("email",))
        if isinstance(data, dict) and isinstance(data.get("otp"), str):
            data["otp"] = data["otp"].strip()
        return data


def _validate_reset_token(value: str):
    if not value or len(value) > 512:
        raise ValidationError("Reset token không hợp lệ")


class ResetPasswordSchema(ma.Schema):
    class Meta:
        unknown = EXCLUDE

    email = fields.Email(
        required=True,
        validate=_validate_email_length,
        error_messages={**_msg("Email"), "invalid": "Email không đúng định dạng"},
    )
    reset_token = _text("Reset token", validate=_validate_reset_token)
    new_password = _text("Mật khẩu mới", validate=_validate_new_password)
    confirm_password = _text("Xác nhận mật khẩu")

    @pre_load
    def normalize(self, data, **kwargs):
        data = _normalize(data, email=("email",))
        if isinstance(data, dict) and isinstance(data.get("reset_token"), str):
            data["reset_token"] = data["reset_token"].strip()
        return data

    @validates_schema(skip_on_field_errors=False)
    def passwords_match(self, data, **kwargs):
        _check_confirm(data, "new_password")


class UserSchema(ma.Schema):
    """Serialize thông tin người dùng — tuyệt đối không có password/password_hash."""

    id = fields.Int()
    full_name = fields.Str()
    email = fields.Str()
    user_type = fields.Str()
    role = fields.Str()
    is_active = fields.Bool()
    created_at = fields.DateTime(format="iso")

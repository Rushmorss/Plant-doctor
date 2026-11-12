"""Controller: nhận request, validate, gọi Service, định dạng response."""
from flask import g
from flask_jwt_extended import get_jwt_identity

from app.schemas.auth_schema import (
    ForgotPasswordSchema,
    LoginSchema,
    RegisterSchema,
    ResetPasswordSchema,
    UserSchema,
    VerifyOTPSchema,
)
from app.services.auth_service import AuthService
from app.utils.response import success_response
from app.utils.validators import load_json

_user_schema = UserSchema()


class AuthController:
    @staticmethod
    def register():
        data = load_json(RegisterSchema())
        user = AuthService.register(data)
        return success_response(
            {"user": _user_schema.dump(user)}, "Đăng ký tài khoản thành công", 201
        )

    @staticmethod
    def login():
        data = load_json(LoginSchema())
        result = AuthService.login(data["email"], data["password"])
        payload = {**result, "user": _user_schema.dump(result["user"])}
        return success_response(payload, "Đăng nhập thành công")

    @staticmethod
    def refresh():
        result = AuthService.refresh_access_token(int(get_jwt_identity()))
        return success_response(result, "Làm mới token thành công")

    @staticmethod
    def me():
        return success_response({"user": _user_schema.dump(g.current_user)}, "Thành công")

    @staticmethod
    def forgot_password():
        data = load_json(ForgotPasswordSchema())
        AuthService.forgot_password(data["email"])
        # Luôn trả cùng một thông báo để không lộ email có tồn tại hay không
        return success_response(
            message="Nếu email tồn tại trong hệ thống, mã OTP đã được gửi. "
            "Mã có hiệu lực trong 5 phút."
        )

    @staticmethod
    def verify_otp():
        data = load_json(VerifyOTPSchema())
        result = AuthService.verify_otp(data["email"], data["otp"])
        return success_response(result, "Xác thực OTP thành công")

    @staticmethod
    def reset_password():
        data = load_json(ResetPasswordSchema())
        AuthService.reset_password(data["email"], data["reset_token"], data["new_password"])
        return success_response(message="Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.")

"""Khai báo endpoint /api/auth/* và rate limit theo IP."""
from flask import Blueprint, current_app
from flask_jwt_extended import jwt_required

from app.controllers.auth_controller import AuthController
from app.extensions import limiter
from app.middleware.auth_middleware import login_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def _limit(config_key: str):
    """Đọc mức giới hạn từ config tại thời điểm request."""
    return limiter.limit(lambda: current_app.config[config_key])


@auth_bp.post("/register")
@_limit("RATELIMIT_REGISTER")
def register():
    return AuthController.register()


@auth_bp.post("/login")
@_limit("RATELIMIT_LOGIN")
def login():
    return AuthController.login()


@auth_bp.post("/refresh")
@jwt_required(refresh=True)
def refresh():
    return AuthController.refresh()


@auth_bp.get("/me")
@login_required
def me():
    return AuthController.me()


@auth_bp.post("/forgot-password")
@_limit("RATELIMIT_FORGOT")
def forgot_password():
    return AuthController.forgot_password()


@auth_bp.post("/verify-otp")
@_limit("RATELIMIT_VERIFY_OTP")
def verify_otp():
    return AuthController.verify_otp()


@auth_bp.post("/reset-password")
@_limit("RATELIMIT_RESET")
def reset_password():
    return AuthController.reset_password()

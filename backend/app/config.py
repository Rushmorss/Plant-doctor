"""Cấu hình ứng dụng theo môi trường (development / production / testing).

Toàn bộ secret được đọc từ biến môi trường (file .env), không hardcode.
"""
import os
from datetime import timedelta
from urllib.parse import quote_plus

from dotenv import load_dotenv

load_dotenv()


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, default))
    except (TypeError, ValueError):
        return default


def _env_list(name: str, default: str) -> list:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


def _build_database_uri() -> str:
    """Ưu tiên DATABASE_URL, nếu không thì ghép từ DB_* (mật khẩu được URL-encode)."""
    url = os.getenv("DATABASE_URL")
    if url:
        return url
    user = quote_plus(os.getenv("DB_USER", "root"))
    password = quote_plus(os.getenv("DB_PASSWORD", ""))
    host = os.getenv("DB_HOST", "localhost")
    port = os.getenv("DB_PORT", "3306")
    name = os.getenv("DB_NAME", "auth_db")
    return f"mysql+pymysql://{user}:{password}@{host}:{port}/{name}?charset=utf8mb4"


class BaseConfig:
    APP_NAME = os.getenv("APP_NAME", "Hệ thống")
    DEBUG = False
    TESTING = False

    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-secret-key-change-me-0123456789")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-jwt-secret-change-me-0123456789")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=_env_int("JWT_ACCESS_MINUTES", 30))
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=_env_int("JWT_REFRESH_DAYS", 7))

    SQLALCHEMY_DATABASE_URI = _build_database_uri()
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True, "pool_recycle": 280}

    # CORS: chỉ cho phép đúng Frontend origin (có thể nhiều origin, ngăn cách bằng dấu phẩy)
    CORS_ORIGINS = _env_list("FRONTEND_URL", "http://localhost:5173")

    # SMTP
    SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = _env_int("SMTP_PORT", 587)
    SMTP_EMAIL = os.getenv("SMTP_EMAIL", "")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
    SMTP_TIMEOUT = 15
    MAIL_SEND_ASYNC = True  # gửi mail ở thread nền để không chặn request

    # Loại người dùng được phép đăng ký công khai (KHÔNG có admin)
    ALLOWED_USER_TYPES = _env_list("ALLOWED_USER_TYPES", "student,teacher,parent,other")

    # Đăng nhập
    LOGIN_MAX_ATTEMPTS = _env_int("LOGIN_MAX_ATTEMPTS", 5)
    LOGIN_LOCK_MINUTES = _env_int("LOGIN_LOCK_MINUTES", 15)

    # OTP / Reset token
    OTP_EXPIRES_MINUTES = 5
    OTP_MAX_ATTEMPTS = _env_int("OTP_MAX_ATTEMPTS", 5)
    OTP_MAX_REQUESTS_PER_HOUR = _env_int("OTP_MAX_REQUESTS_PER_HOUR", 5)
    OTP_RESEND_COOLDOWN_SECONDS = _env_int("OTP_RESEND_COOLDOWN_SECONDS", 60)
    RESET_TOKEN_EXPIRES_MINUTES = _env_int("RESET_TOKEN_EXPIRES_MINUTES", 10)

    # Rate limit theo IP (Flask-Limiter). Production nên dùng Redis: redis://host:6379/0
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URI = os.getenv("RATELIMIT_STORAGE_URI", "memory://")
    RATELIMIT_HEADERS_ENABLED = True
    RATELIMIT_REGISTER = "10 per hour"
    RATELIMIT_LOGIN = "10 per minute"
    RATELIMIT_FORGOT = "5 per hour"
    RATELIMIT_VERIFY_OTP = "10 per 10 minutes"
    RATELIMIT_RESET = "10 per hour"

    @classmethod
    def validate(cls) -> None:
        """Hook kiểm tra cấu hình khi khởi động."""


class DevelopmentConfig(BaseConfig):
    DEBUG = True


class ProductionConfig(BaseConfig):
    @classmethod
    def validate(cls) -> None:
        weak = [
            name
            for name in ("SECRET_KEY", "JWT_SECRET_KEY")
            if not os.getenv(name) or len(os.getenv(name, "")) < 32
        ]
        if weak:
            raise RuntimeError(
                f"Production yêu cầu {', '.join(weak)} (>= 32 ký tự) trong biến môi trường."
            )
        if not (cls.SMTP_EMAIL and cls.SMTP_PASSWORD):
            raise RuntimeError("Production yêu cầu SMTP_EMAIL và SMTP_PASSWORD.")


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SQLALCHEMY_ENGINE_OPTIONS = {}
    SECRET_KEY = "test-secret-key-0123456789-0123456789"
    JWT_SECRET_KEY = "test-jwt-secret-key-0123456789-0123456789"
    RATELIMIT_ENABLED = False
    MAIL_SEND_ASYNC = False
    CORS_ORIGINS = ["http://localhost:5173"]
    ALLOWED_USER_TYPES = ["student", "teacher", "parent", "other"]
    LOGIN_MAX_ATTEMPTS = 3
    LOGIN_LOCK_MINUTES = 15
    OTP_MAX_ATTEMPTS = 3
    OTP_MAX_REQUESTS_PER_HOUR = 5
    OTP_RESEND_COOLDOWN_SECONDS = 60
    RESET_TOKEN_EXPIRES_MINUTES = 10


config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}


def get_config(name: str = None):
    name = (name or os.getenv("FLASK_ENV", "development")).lower()
    return config_by_name.get(name, DevelopmentConfig)

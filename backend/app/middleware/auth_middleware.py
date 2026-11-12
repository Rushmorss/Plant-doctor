"""JWT callbacks và decorator bảo vệ route."""
from functools import wraps

from flask import g
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from app.extensions import db
from app.models.user import User
from app.utils.exceptions import AppError


def register_jwt_callbacks(jwt) -> None:
    @jwt.token_in_blocklist_loader
    def is_token_revoked(jwt_header, jwt_payload) -> bool:
        """Token bị thu hồi nếu user không còn/không active hoặc token_version đã đổi
        (xảy ra khi đặt lại mật khẩu)."""
        try:
            user = db.session.get(User, int(jwt_payload["sub"]))
        except (KeyError, TypeError, ValueError):
            return True
        if user is None or not user.is_active:
            return True
        return jwt_payload.get("tv") != user.token_version


def login_required(fn):
    """Yêu cầu access token hợp lệ; gán người dùng hiện tại vào g.current_user."""

    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user = db.session.get(User, int(get_jwt_identity()))
        if user is None or not user.is_active:
            raise AppError("Phiên đăng nhập không hợp lệ", 401)
        g.current_user = user
        return fn(*args, **kwargs)

    return wrapper


def roles_required(*roles):
    """Giới hạn theo role (vd. @roles_required("admin")). Dùng cho các module sau."""

    def decorator(fn):
        @wraps(fn)
        @login_required
        def wrapper(*args, **kwargs):
            if g.current_user.role not in roles:
                raise AppError("Bạn không có quyền truy cập tài nguyên này", 403)
            return fn(*args, **kwargs)

        return wrapper

    return decorator

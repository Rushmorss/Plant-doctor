"""Chuyển mọi lỗi thành JSON theo chuẩn {success, message, errors}."""
import logging

from flask import current_app
from marshmallow import ValidationError
from werkzeug.exceptions import HTTPException

from app.extensions import db
from app.utils.exceptions import AppError
from app.utils.response import error_response

logger = logging.getLogger(__name__)

_HTTP_MESSAGES = {
    400: "Yêu cầu không hợp lệ",
    401: "Bạn chưa được xác thực",
    403: "Bạn không có quyền truy cập",
    404: "Không tìm thấy tài nguyên",
    405: "Phương thức không được hỗ trợ",
    413: "Dữ liệu gửi lên quá lớn",
    415: "Định dạng dữ liệu không được hỗ trợ",
    429: "Quá nhiều yêu cầu, vui lòng thử lại sau",
}


def register_error_handlers(app, jwt) -> None:
    @app.errorhandler(AppError)
    def handle_app_error(err: AppError):
        return error_response(err.message, err.status_code, err.errors)

    @app.errorhandler(ValidationError)
    def handle_validation_error(err: ValidationError):
        errors = err.messages if isinstance(err.messages, dict) else {"_schema": err.messages}
        return error_response("Dữ liệu không hợp lệ", 400, errors)

    @app.errorhandler(HTTPException)
    def handle_http_exception(err: HTTPException):
        code = err.code or 500
        return error_response(_HTTP_MESSAGES.get(code, err.name), code)

    @app.errorhandler(Exception)
    def handle_unexpected(err: Exception):
        db.session.rollback()
        logger.exception("Lỗi không mong đợi: %s", type(err).__name__)
        return error_response("Lỗi máy chủ, vui lòng thử lại sau", 500)

    # ---- Lỗi JWT ----
    @jwt.unauthorized_loader
    def missing_token(reason):
        return error_response("Thiếu access token. Vui lòng đăng nhập.", 401)

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return error_response("Token không hợp lệ", 401)

    @jwt.expired_token_loader
    def expired_token(jwt_header, jwt_payload):
        return error_response("Token đã hết hạn", 401)

    @jwt.revoked_token_loader
    def revoked_token(jwt_header, jwt_payload):
        return error_response("Phiên đăng nhập đã bị thu hồi. Vui lòng đăng nhập lại.", 401)

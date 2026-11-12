"""Định dạng response JSON thống nhất."""
from flask import jsonify


def success_response(data=None, message: str = "Thao tác thành công", status_code: int = 200):
    return (
        jsonify({"success": True, "message": message, "data": data if data is not None else {}}),
        status_code,
    )


def error_response(message: str = "Thông tin không hợp lệ", status_code: int = 400, errors=None):
    return (
        jsonify({"success": False, "message": message, "errors": errors or {}}),
        status_code,
    )

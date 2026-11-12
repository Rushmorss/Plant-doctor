"""Exception nghiệp vụ; error handler sẽ chuyển thành response JSON chuẩn."""


class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400, errors=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code
        self.errors = errors or {}


class EmailDeliveryError(Exception):
    """Gửi email thất bại (thiếu cấu hình SMTP, lỗi kết nối...)."""

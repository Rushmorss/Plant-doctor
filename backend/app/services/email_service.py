"""Gửi email qua SMTP (Gmail App Password hoặc dịch vụ SMTP bất kỳ).

Thông tin đăng nhập SMTP lấy hoàn toàn từ biến môi trường (xem config.py).
"""
import logging
import smtplib
import ssl
import threading
from email.message import EmailMessage
from email.utils import formataddr
from html import escape

from flask import current_app

from app.utils.exceptions import EmailDeliveryError

logger = logging.getLogger(__name__)


class EmailService:
    @staticmethod
    def _build_password_reset_message(to_email: str, full_name: str, otp: str) -> EmailMessage:
        cfg = current_app.config
        app_name = cfg["APP_NAME"]
        minutes = cfg["OTP_EXPIRES_MINUTES"]
        safe_name = escape(full_name)
        safe_app = escape(app_name)

        msg = EmailMessage()
        msg["Subject"] = f"[{app_name}] - Mã xác thực đặt lại mật khẩu"
        msg["From"] = formataddr((app_name, cfg["SMTP_EMAIL"]))
        msg["To"] = to_email

        msg.set_content(
            f"Xin chào {full_name},\n\n"
            f"Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn tại {app_name}.\n\n"
            f"Mã xác thực (OTP) của bạn là: {otp}\n\n"
            f"Mã có hiệu lực trong {minutes} phút và chỉ dùng được một lần.\n"
            "TUYỆT ĐỐI không chia sẻ mã này cho bất kỳ ai, kể cả nhân viên hỗ trợ.\n\n"
            "Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email — tài khoản của bạn vẫn an toàn.\n\n"
            f"Trân trọng,\nĐội ngũ {app_name}"
        )
        msg.add_alternative(
            f"""\
<!DOCTYPE html>
<html lang="vi">
<body style="margin:0;padding:24px;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2933;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr><td align="center">
      <table role="presentation" width="480" cellspacing="0" cellpadding="0"
             style="max-width:480px;background:#ffffff;border-radius:8px;padding:32px;">
        <tr><td>
          <h2 style="margin:0 0 16px;color:#0b5fff;">{safe_app}</h2>
          <p>Xin chào <strong>{safe_name}</strong>,</p>
          <p>Chúng tôi nhận được yêu cầu <strong>đặt lại mật khẩu</strong> cho tài khoản của bạn.
             Vui lòng sử dụng mã xác thực dưới đây:</p>
          <p style="text-align:center;margin:24px 0;">
            <span style="display:inline-block;padding:12px 24px;font-size:32px;letter-spacing:8px;
                         font-weight:bold;background:#eef3ff;border-radius:8px;color:#0b5fff;">{otp}</span>
          </p>
          <p>Mã có hiệu lực trong <strong>{minutes} phút</strong> và chỉ dùng được một lần.</p>
          <p style="color:#b42318;"><strong>Cảnh báo:</strong> Không chia sẻ mã này cho bất kỳ ai,
             kể cả người tự xưng là nhân viên hỗ trợ.</p>
          <p style="font-size:13px;color:#52606d;">Nếu bạn không yêu cầu, hãy bỏ qua email này —
             tài khoản của bạn vẫn an toàn.</p>
          <hr style="border:none;border-top:1px solid #e4e7eb;margin:24px 0;">
          <p style="font-size:12px;color:#7b8794;">Đây là email tự động, vui lòng không trả lời.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>""",
            subtype="html",
        )
        return msg

    @staticmethod
    def send_password_reset_otp(to_email: str, full_name: str, otp: str) -> None:
        """Gửi OTP đặt lại mật khẩu (đồng bộ). Cần application context.

        Raises:
            EmailDeliveryError: thiếu cấu hình hoặc SMTP lỗi.
        """
        cfg = current_app.config
        if not (cfg["SMTP_EMAIL"] and cfg["SMTP_PASSWORD"]):
            raise EmailDeliveryError("Chưa cấu hình SMTP_EMAIL / SMTP_PASSWORD")

        message = EmailService._build_password_reset_message(to_email, full_name, otp)
        host, port, timeout = cfg["SMTP_HOST"], cfg["SMTP_PORT"], cfg["SMTP_TIMEOUT"]
        context = ssl.create_default_context()
        try:
            if port == 465:  # SSL ngầm định
                with smtplib.SMTP_SSL(host, port, timeout=timeout, context=context) as server:
                    server.login(cfg["SMTP_EMAIL"], cfg["SMTP_PASSWORD"])
                    server.send_message(message)
            else:  # 587: STARTTLS
                with smtplib.SMTP(host, port, timeout=timeout) as server:
                    server.starttls(context=context)
                    server.login(cfg["SMTP_EMAIL"], cfg["SMTP_PASSWORD"])
                    server.send_message(message)
        except (smtplib.SMTPException, OSError) as exc:
            raise EmailDeliveryError(f"Gửi email thất bại: {type(exc).__name__}") from exc

    @classmethod
    def dispatch_password_reset_otp(cls, to_email: str, full_name: str, otp: str) -> None:
        """Gửi OTP mà không bao giờ ném lỗi ra ngoài (tránh lộ email có tồn tại hay không).

        Mặc định gửi ở thread nền; khi MAIL_SEND_ASYNC=False (test) thì gửi đồng bộ.
        Production quy mô lớn nên chuyển sang hàng đợi (Celery/RQ).
        """
        app = current_app._get_current_object()

        def _run():
            with app.app_context():
                try:
                    cls.send_password_reset_otp(to_email, full_name, otp)
                except Exception as exc:  # noqa: BLE001 - chỉ log loại lỗi, không log OTP
                    logger.error("Không gửi được email OTP: %s", exc)

        if app.config.get("MAIL_SEND_ASYNC", True):
            threading.Thread(target=_run, daemon=True).start()
        else:
            _run()

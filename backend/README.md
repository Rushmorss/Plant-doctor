# Backend Authentication (Flask + MySQL + JWT)

Kiến trúc: **Routes → Controllers → Services → Repositories → Models** (+ Schemas, Middleware, Utils).

## 1. Cài đặt

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # rồi sửa giá trị thật (DB, SMTP, secret)
```

Sinh secret ngẫu nhiên cho `SECRET_KEY` và `JWT_SECRET_KEY`:

```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

## 2. Tạo Database & chạy Migration

```sql
CREATE DATABASE your_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Thư mục `migrations/` đã có sẵn migration đầu tiên, chỉ cần:

```bash
flask --app run db upgrade
```

Khi sửa model sau này: `flask --app run db migrate -m "mô tả"` rồi `flask --app run db upgrade`.

## 3. Chạy server

```bash
python run.py                                   # dev: http://127.0.0.1:5000
gunicorn -w 4 -b 0.0.0.0:8000 "run:app"         # production (FLASK_ENV=production, đặt sau HTTPS reverse proxy)
```

## 4. Chạy test (không cần MySQL — dùng SQLite in-memory, email được mock)

```bash
pytest
```

## 5. Cấu hình SMTP Gmail

Bật xác minh 2 bước cho tài khoản Google → tạo **App Password** (16 ký tự) →
đặt `SMTP_EMAIL` = địa chỉ Gmail, `SMTP_PASSWORD` = App Password. `SMTP_PORT=587` (STARTTLS) hoặc `465` (SSL).

## 6. API

Mọi response đều có dạng `{"success": bool, "message": str, "data" | "errors": {...}}`.
Header cho API cần đăng nhập: `Authorization: Bearer <token>`.

| Method | Endpoint | Mô tả | Mã trả về |
|---|---|---|---|
| POST | `/api/auth/register` | Đăng ký | 201, 400, 409 |
| POST | `/api/auth/login` | Đăng nhập → access + refresh token | 200, 400, 401, 403, 429 |
| POST | `/api/auth/refresh` | Cấp access token mới (gửi **refresh token**) | 200, 401 |
| GET | `/api/auth/me` | Thông tin người dùng hiện tại | 200, 401 |
| POST | `/api/auth/forgot-password` | Gửi OTP 6 số qua email (hiệu lực 5 phút) | 200, 400, 429 |
| POST | `/api/auth/verify-otp` | Xác thực OTP → `reset_token` (10 phút) | 200, 400, 429 |
| POST | `/api/auth/reset-password` | Đặt mật khẩu mới bằng `reset_token` | 200, 400, 401, 429 |
| GET | `/api/health` | Kiểm tra dịch vụ | 200 |

`user_type` hợp lệ: `student`, `teacher`, `parent`, `other` (chỉnh qua biến `ALLOWED_USER_TYPES`).
`admin` **không** được phép đăng ký công khai; cột `role` luôn mặc định `user`.

Luồng quên mật khẩu: `forgot-password` → nhận OTP qua email → `verify-otp` (nhận `reset_token`) → `reset-password`.
Import file `Auth_API.postman_collection.json` vào Postman để thử (token được tự lưu vào biến collection).

## 7. Cơ chế bảo mật

- Mật khẩu băm **Argon2id**; không lưu/không trả plaintext hay hash.
- OTP lưu dạng **HMAC-SHA256** (khoá = `SECRET_KEY`), dùng một lần, hết hạn 5 phút, tối đa `OTP_MAX_ATTEMPTS` lần sai.
- Reset token ngẫu nhiên 256 bit, chỉ lưu SHA-256, dùng một lần, hết hạn sau 10 phút, gắn với đúng user.
- Đặt lại mật khẩu chạy trong **một transaction**; đồng thời tăng `token_version` → mọi access/refresh token cũ bị thu hồi.
- Đăng nhập: khoá tạm `LOGIN_LOCK_MINUTES` phút sau `LOGIN_MAX_ATTEMPTS` lần sai; thông báo lỗi chung cho "sai email" và "sai mật khẩu"; cân bằng thời gian xử lý.
- Forgot-password/verify-otp không lộ email có tồn tại; có cooldown giữa các lần gửi, tối đa N OTP/giờ, và rate limit theo IP (Flask-Limiter).
- ORM (SQLAlchemy) tham số hoá truy vấn → chống SQL Injection; field lạ trong request bị loại bỏ.
- CORS chỉ cho phép `FRONTEND_URL`; secret nằm trong `.env`; log không chứa OTP/mật khẩu/token.

### Lưu ý khi lên production
- Dùng HTTPS; đặt `FLASK_ENV=production` (app sẽ từ chối khởi động nếu thiếu secret ≥ 32 ký tự hoặc SMTP).
- Đổi `RATELIMIT_STORAGE_URI` sang Redis (`redis://host:6379/0`) khi chạy nhiều worker; nếu đứng sau reverse proxy cần cấu hình `ProxyFix` để lấy đúng IP client.
- Gửi email hiện chạy ở thread nền; hệ thống lớn nên chuyển sang hàng đợi (Celery/RQ).

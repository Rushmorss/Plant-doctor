"""Unit test + Integration test cho module Authentication.

Chạy bằng SQLite in-memory (TestingConfig) nên không cần MySQL; email được mock.
"""
from datetime import timedelta
from unittest.mock import patch

import pytest

from app import create_app
from app.extensions import db
from app.models.user import PasswordResetOTP, PasswordResetToken, User, utcnow
from app.services.email_service import EmailService
from app.utils import validators
from app.utils.otp_generator import generate_otp, generate_reset_token, hash_token

VALID_PASSWORD = "Example@123"
REGISTER_PAYLOAD = {
    "full_name": "Nguyễn Văn A",
    "email": "example@gmail.com",
    "user_type": "student",
    "password": VALID_PASSWORD,
    "confirm_password": VALID_PASSWORD,
}


# ----------------------------------------------------------------- fixtures
@pytest.fixture()
def app():
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


@pytest.fixture()
def mailer():
    """Mock việc gửi email; mailer.call_args.args = (to_email, full_name, otp)."""
    with patch.object(EmailService, "send_password_reset_otp") as mock:
        yield mock


@pytest.fixture()
def user(client):
    res = client.post("/api/auth/register", json=REGISTER_PAYLOAD)
    assert res.status_code == 201
    return res.get_json()["data"]["user"]


def login(client, email="example@gmail.com", password=VALID_PASSWORD):
    return client.post("/api/auth/login", json={"email": email, "password": password})


def request_otp(client, mailer, email="example@gmail.com") -> str:
    res = client.post("/api/auth/forgot-password", json={"email": email})
    assert res.status_code == 200
    return mailer.call_args.args[2]


def get_reset_token(client, mailer, email="example@gmail.com") -> str:
    otp = request_otp(client, mailer, email)
    res = client.post("/api/auth/verify-otp", json={"email": email, "otp": otp})
    assert res.status_code == 200
    return res.get_json()["data"]["reset_token"]


# ------------------------------------------------------------ Unit tests
class TestUnitHelpers:
    @pytest.mark.parametrize(
        "password",
        ["Short1!", "alllowercase1!", "ALLUPPERCASE1!", "NoDigitsHere!", "NoSpecial123"],
    )
    def test_weak_passwords_rejected(self, password):
        assert validators.password_strength_errors(password)

    def test_strong_password_accepted(self):
        assert validators.password_strength_errors("Str0ng!Pass") == []

    def test_otp_is_six_digits(self, app):
        for _ in range(200):
            otp = generate_otp()
            assert len(otp) == 6 and otp.isdigit()

    def test_reset_token_hash_matches(self):
        raw, hashed = generate_reset_token()
        assert hash_token(raw) == hashed and raw != hashed

    def test_otp_format(self):
        assert validators.is_valid_otp_format("123456")
        assert not validators.is_valid_otp_format("12345")
        assert not validators.is_valid_otp_format("12345a")
        assert not validators.is_valid_otp_format("123456\n")


# --------------------------------------------------------------- Register
class TestRegister:
    def test_register_success(self, client):
        res = client.post("/api/auth/register", json=REGISTER_PAYLOAD)
        body = res.get_json()
        assert res.status_code == 201
        assert body["success"] is True
        assert body["data"]["user"]["email"] == "example@gmail.com"
        assert body["data"]["user"]["role"] == "user"
        assert "password" not in body["data"]["user"]
        assert "password_hash" not in body["data"]["user"]

    def test_password_is_hashed_in_db(self, client, app):
        client.post("/api/auth/register", json=REGISTER_PAYLOAD)
        stored = User.query.filter_by(email="example@gmail.com").one()
        assert stored.password_hash != VALID_PASSWORD
        assert stored.password_hash.startswith("$argon2")

    def test_register_duplicate_email(self, client, user):
        payload = {**REGISTER_PAYLOAD, "email": "EXAMPLE@gmail.com"}  # khác hoa/thường
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 409
        assert res.get_json()["success"] is False

    @pytest.mark.parametrize(
        "password",
        ["Ab1!", "example@123", "EXAMPLE@123", "Example@abc", "Example1234"],
    )
    def test_register_weak_password(self, client, password):
        payload = {**REGISTER_PAYLOAD, "password": password, "confirm_password": password}
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 400
        assert "password" in res.get_json()["errors"]

    def test_register_password_mismatch(self, client):
        payload = {**REGISTER_PAYLOAD, "confirm_password": "Different@123"}
        res = client.post("/api/auth/register", json=payload)
        assert res.status_code == 400
        assert "confirm_password" in res.get_json()["errors"]

    def test_register_invalid_email(self, client):
        res = client.post("/api/auth/register", json={**REGISTER_PAYLOAD, "email": "not-an-email"})
        assert res.status_code == 400
        assert "email" in res.get_json()["errors"]

    def test_register_missing_fields(self, client):
        res = client.post("/api/auth/register", json={})
        assert res.status_code == 400
        assert {"full_name", "email", "user_type", "password", "confirm_password"} <= set(
            res.get_json()["errors"]
        )

    def test_register_cannot_choose_admin(self, client):
        res = client.post("/api/auth/register", json={**REGISTER_PAYLOAD, "user_type": "admin"})
        assert res.status_code == 400
        assert "user_type" in res.get_json()["errors"]

    def test_register_ignores_role_field(self, client):
        res = client.post(
            "/api/auth/register", json={**REGISTER_PAYLOAD, "role": "admin", "is_active": False}
        )
        assert res.status_code == 201
        assert res.get_json()["data"]["user"]["role"] == "user"
        assert res.get_json()["data"]["user"]["is_active"] is True

    def test_register_non_json_body(self, client):
        res = client.post("/api/auth/register", data="abc", content_type="text/plain")
        assert res.status_code == 400


# ------------------------------------------------------------------ Login
class TestLogin:
    def test_login_success(self, client, user):
        res = login(client)
        body = res.get_json()
        assert res.status_code == 200
        assert body["data"]["access_token"] and body["data"]["refresh_token"]
        assert body["data"]["user"]["email"] == "example@gmail.com"
        assert "password_hash" not in body["data"]["user"]

    def test_login_wrong_password(self, client, user):
        res = login(client, password="Wrong@12345")
        assert res.status_code == 401

    def test_login_unknown_email_same_message(self, client, user):
        wrong_pw = login(client, password="Wrong@12345").get_json()
        unknown = login(client, email="nobody@gmail.com").get_json()
        assert wrong_pw["message"] == unknown["message"]  # không lộ tài khoản tồn tại

    def test_login_locks_after_too_many_failures(self, client, user):
        for _ in range(3):  # LOGIN_MAX_ATTEMPTS của TestingConfig = 3
            assert login(client, password="Wrong@12345").status_code == 401
        assert login(client).status_code == 429  # đúng mật khẩu cũng bị khoá tạm

    def test_successful_login_resets_failure_counter(self, client, user):
        login(client, password="Wrong@12345")
        assert login(client).status_code == 200
        assert User.query.one().failed_login_attempts == 0

    def test_inactive_account_cannot_login(self, client, user, app):
        User.query.one().is_active = False
        db.session.commit()
        assert login(client).status_code == 403

    def test_me_requires_token(self, client, user):
        assert client.get("/api/auth/me").status_code == 401

    def test_me_and_refresh(self, client, user):
        tokens = login(client).get_json()["data"]
        me = client.get(
            "/api/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        assert me.status_code == 200
        assert me.get_json()["data"]["user"]["email"] == "example@gmail.com"

        refreshed = client.post(
            "/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['refresh_token']}"}
        )
        assert refreshed.status_code == 200
        assert refreshed.get_json()["data"]["access_token"]

        # access token không được dùng thay refresh token
        wrong = client.post(
            "/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['access_token']}"}
        )
        assert wrong.status_code == 401


# --------------------------------------------------------- Forgot password
class TestForgotPassword:
    def test_send_otp_success(self, client, user, mailer, app):
        res = client.post("/api/auth/forgot-password", json={"email": "example@gmail.com"})
        assert res.status_code == 200
        mailer.assert_called_once()
        to_email, _, otp = mailer.call_args.args
        assert to_email == "example@gmail.com"
        assert len(otp) == 6 and otp.isdigit()

        record = PasswordResetOTP.query.one()
        assert record.otp_hash != otp  # chỉ lưu hash
        assert 295 <= (record.expires_at - record.created_at).total_seconds() <= 305

    def test_unknown_email_gets_identical_response(self, client, user, mailer):
        known = client.post("/api/auth/forgot-password", json={"email": "example@gmail.com"})
        unknown = client.post("/api/auth/forgot-password", json={"email": "nobody@gmail.com"})
        assert known.status_code == unknown.status_code == 200
        assert known.get_json() == unknown.get_json()
        assert mailer.call_count == 1  # email không tồn tại thì không gửi

    def test_invalid_email_format(self, client):
        res = client.post("/api/auth/forgot-password", json={"email": "bad"})
        assert res.status_code == 400

    def test_resend_cooldown_blocks_spam(self, client, user, mailer):
        client.post("/api/auth/forgot-password", json={"email": "example@gmail.com"})
        client.post("/api/auth/forgot-password", json={"email": "example@gmail.com"})
        assert mailer.call_count == 1

    def test_hourly_limit(self, client, user, mailer, app):
        app.config["OTP_RESEND_COOLDOWN_SECONDS"] = 0
        for _ in range(8):
            client.post("/api/auth/forgot-password", json={"email": "example@gmail.com"})
        assert mailer.call_count == app.config["OTP_MAX_REQUESTS_PER_HOUR"]

    def test_new_otp_invalidates_old_one(self, client, user, mailer, app):
        app.config["OTP_RESEND_COOLDOWN_SECONDS"] = 0
        old = request_otp(client, mailer)
        new = request_otp(client, mailer)
        assert PasswordResetOTP.query.count() == 2
        if old != new:  # (hiếm khi hai OTP ngẫu nhiên trùng nhau)
            res = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": old})
            assert res.status_code == 400
        # chỉ còn đúng một OTP chưa dùng
        assert PasswordResetOTP.query.filter_by(is_used=False).count() == 1


# -------------------------------------------------------------- Verify OTP
class TestVerifyOTP:
    def test_verify_success_returns_reset_token(self, client, user, mailer):
        otp = request_otp(client, mailer)
        res = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": otp})
        assert res.status_code == 200
        assert res.get_json()["data"]["reset_token"]
        stored = PasswordResetToken.query.one()
        assert stored.token_hash != res.get_json()["data"]["reset_token"]

    def test_wrong_otp(self, client, user, mailer):
        otp = request_otp(client, mailer)
        wrong = "000000" if otp != "000000" else "111111"
        res = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": wrong})
        assert res.status_code == 400
        assert PasswordResetOTP.query.one().attempts == 1

    def test_otp_must_be_six_digits(self, client, user):
        for bad in ["12345", "1234567", "abcdef", "12 456"]:
            res = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": bad})
            assert res.status_code == 400 and "otp" in res.get_json()["errors"]

    def test_expired_otp(self, client, user, mailer, app):
        otp = request_otp(client, mailer)
        PasswordResetOTP.query.one().expires_at = utcnow() - timedelta(seconds=1)
        db.session.commit()
        res = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": otp})
        assert res.status_code == 400

    def test_used_otp_cannot_be_reused(self, client, user, mailer):
        otp = request_otp(client, mailer)
        payload = {"email": "example@gmail.com", "otp": otp}
        assert client.post("/api/auth/verify-otp", json=payload).status_code == 200
        assert client.post("/api/auth/verify-otp", json=payload).status_code == 400

    def test_otp_locked_after_too_many_wrong_attempts(self, client, user, mailer):
        otp = request_otp(client, mailer)
        wrong = "000000" if otp != "000000" else "111111"
        for _ in range(3):  # OTP_MAX_ATTEMPTS của TestingConfig = 3
            client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": wrong})
        # Đến đây OTP đúng cũng không còn dùng được
        res = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": otp})
        assert res.status_code == 400

    def test_unknown_email_same_error(self, client, user, mailer):
        otp = request_otp(client, mailer)
        wrong = "000000" if otp != "000000" else "111111"
        a = client.post("/api/auth/verify-otp", json={"email": "example@gmail.com", "otp": wrong})
        b = client.post("/api/auth/verify-otp", json={"email": "nobody@gmail.com", "otp": wrong})
        assert a.status_code == b.status_code == 400
        assert a.get_json() == b.get_json()


# ---------------------------------------------------------- Reset password
class TestResetPassword:
    NEW_PASSWORD = "NewPassword@123"

    def _reset(self, client, token, **overrides):
        payload = {
            "email": "example@gmail.com",
            "reset_token": token,
            "new_password": self.NEW_PASSWORD,
            "confirm_password": self.NEW_PASSWORD,
            **overrides,
        }
        return client.post("/api/auth/reset-password", json=payload)

    def test_reset_success(self, client, user, mailer):
        token = get_reset_token(client, mailer)
        res = self._reset(client, token)
        assert res.status_code == 200
        assert login(client, password=VALID_PASSWORD).status_code == 401
        assert login(client, password=self.NEW_PASSWORD).status_code == 200

    def test_reset_token_is_single_use(self, client, user, mailer):
        token = get_reset_token(client, mailer)
        assert self._reset(client, token).status_code == 200
        assert self._reset(client, token).status_code == 401

    def test_reset_with_invalid_token(self, client, user, mailer):
        get_reset_token(client, mailer)
        assert self._reset(client, "fake-token").status_code == 401

    def test_reset_without_verifying_otp(self, client, user, mailer):
        request_otp(client, mailer)  # có OTP nhưng chưa xác thực
        assert self._reset(client, "anything").status_code == 401

    def test_reset_token_bound_to_email(self, client, user, mailer):
        token = get_reset_token(client, mailer)
        client.post("/api/auth/register", json={**REGISTER_PAYLOAD, "email": "other@gmail.com"})
        assert self._reset(client, token, email="other@gmail.com").status_code == 401

    def test_reset_expired_token(self, client, user, mailer):
        token = get_reset_token(client, mailer)
        PasswordResetToken.query.one().expires_at = utcnow() - timedelta(seconds=1)
        db.session.commit()
        assert self._reset(client, token).status_code == 401

    def test_reset_with_weak_password(self, client, user, mailer):
        token = get_reset_token(client, mailer)
        res = self._reset(client, token, new_password="weak", confirm_password="weak")
        assert res.status_code == 400
        assert "new_password" in res.get_json()["errors"]
        # token chưa bị tiêu thụ -> vẫn dùng lại được với mật khẩu hợp lệ
        assert self._reset(client, token).status_code == 200

    def test_reset_password_mismatch(self, client, user, mailer):
        token = get_reset_token(client, mailer)
        res = self._reset(client, token, confirm_password="Another@12345")
        assert res.status_code == 400
        assert "confirm_password" in res.get_json()["errors"]

    def test_reset_revokes_old_sessions(self, client, user, mailer):
        tokens = login(client).get_json()["data"]
        headers = {"Authorization": f"Bearer {tokens['access_token']}"}
        assert client.get("/api/auth/me", headers=headers).status_code == 200

        assert self._reset(client, get_reset_token(client, mailer)).status_code == 200

        assert client.get("/api/auth/me", headers=headers).status_code == 401
        refresh = client.post(
            "/api/auth/refresh", headers={"Authorization": f"Bearer {tokens['refresh_token']}"}
        )
        assert refresh.status_code == 401

    def test_reset_clears_login_lock(self, client, user, mailer):
        for _ in range(3):
            login(client, password="Wrong@12345")
        assert login(client).status_code == 429
        assert self._reset(client, get_reset_token(client, mailer)).status_code == 200
        assert login(client, password=self.NEW_PASSWORD).status_code == 200


# -------------------------------------------------------------- Misc / infra
class TestInfrastructure:
    def test_unknown_route_returns_json_404(self, client):
        res = client.get("/api/nope")
        assert res.status_code == 404
        assert res.get_json()["success"] is False

    def test_health(self, client):
        assert client.get("/api/health").status_code == 200

    def test_cors_allows_only_frontend_origin(self, client):
        ok = client.options(
            "/api/auth/login",
            headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
        )
        bad = client.options(
            "/api/auth/login",
            headers={"Origin": "http://evil.example", "Access-Control-Request-Method": "POST"},
        )
        assert ok.headers.get("Access-Control-Allow-Origin") == "http://localhost:5173"
        assert "Access-Control-Allow-Origin" not in bad.headers

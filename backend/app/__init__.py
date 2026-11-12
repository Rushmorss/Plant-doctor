"""Application factory."""
import logging

from flask import Flask

from app.config import get_config
from app.extensions import cors, db, jwt, limiter, ma, migrate
from app.middleware.auth_middleware import register_jwt_callbacks
from app.middleware.error_handler import register_error_handlers
from app.utils.response import success_response


def create_app(config_name: str = None) -> Flask:
    app = Flask(__name__)

    config_cls = get_config(config_name)
    config_cls.validate()
    app.config.from_object(config_cls)

    logging.basicConfig(
        level=logging.DEBUG if app.config["DEBUG"] else logging.INFO,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
    )
    app.json.ensure_ascii = False  # trả tiếng Việt có dấu nguyên vẹn

    # Extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    ma.init_app(app)
    limiter.init_app(app)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}},
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    )

    from app import models  # noqa: F401  (để Flask-Migrate nhận diện model)

    register_jwt_callbacks(jwt)
    register_error_handlers(app, jwt)

    from app.routes.auth_routes import auth_bp

    app.register_blueprint(auth_bp)

    @app.get("/api/health")
    def health():
        return success_response({"status": "ok"}, "Dịch vụ đang hoạt động")

    return app

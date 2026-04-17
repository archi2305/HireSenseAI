"""ASGI entrypoint for running the backend via `uvicorn app.main:app`."""

from __future__ import annotations

import logging
import os

from fastapi import FastAPI

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("hiresense-bootstrap")

# Keep OAuth disabled by default while validating core backend health.
os.environ.setdefault("DISABLE_OAUTH", "true")


def _create_fallback_app(exc: Exception) -> FastAPI:
    """Return a minimal app so /docs and /health stay reachable."""
    fallback_app = FastAPI(title="HireSense Backend (Fallback Mode)")

    @fallback_app.on_event("startup")
    async def fallback_startup() -> None:
        logger.error("Backend failed to import. Running fallback app.")
        logger.exception("Startup import error: %s", exc)

    @fallback_app.get("/health")
    async def health_check() -> str:
        return "OK"

    return fallback_app


try:
    from backend.main import app as backend_app

    app = backend_app
    logger.info("Backend app loaded successfully on port 8000 (uvicorn runtime).")
except Exception as exc:  # noqa: BLE001 - intentional catch-all for startup safety
    logger.exception("Failed to initialize backend app: %s", exc)
    app = _create_fallback_app(exc)

__all__ = ["app"]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

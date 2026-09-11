import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analysis_routes import router as analysis_router
from config.config import ML_SERVICE_PORT, ML_SERVICE_HOST

# Setup structured logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("ml_service.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for startup and shutdown routines."""
    logger.info("Starting FoodShareAI ML Inference Microservice...")
    logger.info("Initializing available custom models (YOLOv8, EfficientNet-B0, YOLOv8-Seg, XGBoost)...")
    yield
    logger.info("Shutting down FoodShareAI ML Microservice...")

app = FastAPI(
    title="FoodShareAI Custom ML Inference Microservice",
    description="Standalone inference engine hosting YOLOv8, EfficientNet-B0, YOLOv8-Seg quantity regression, and XGBoost expiry models. Zero fake predictions.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware to permit Node.js backend and mobile dev clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(analysis_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.py:app", host=ML_SERVICE_HOST, port=ML_SERVICE_PORT, reload=True)

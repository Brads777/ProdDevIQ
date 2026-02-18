"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from deviq_graphrag.api.routes import router
from deviq_graphrag.graph.qdrant_store import qdrant_store


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and tear down application resources."""
    await qdrant_store.init_collection()
    yield
    qdrant_store.close()


app = FastAPI(
    title="DevIQ GraphRAG",
    description="GraphRAG-powered skill discovery for DevIQ",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

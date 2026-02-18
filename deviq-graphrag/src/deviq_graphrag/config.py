"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openai_api_key: str = ""
    qdrant_host: str = "localhost"
    qdrant_port: int = 6333
    catalog_path: str = "/data/catalog"

    model_config = {"env_prefix": "", "case_sensitive": False}


settings = Settings()

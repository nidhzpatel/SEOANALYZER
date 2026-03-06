"""Application configuration."""

import os


class Settings:
    """Application settings loaded from environment variables."""

    APP_NAME: str = "SEO Analyzer"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./seo_analyzer.db")

    # Google PageSpeed API
    PAGESPEED_API_KEY: str = os.getenv("PAGESPEED_API_KEY", "")
    PAGESPEED_API_URL: str = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed"

    # Ollama LLM
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "mistral")

    # Crawler settings
    CRAWLER_TIMEOUT: int = int(os.getenv("CRAWLER_TIMEOUT", "30"))
    CRAWLER_USER_AGENT: str = (
        "Mozilla/5.0 (compatible; SEOAnalyzerBot/1.0; +https://github.com/seo-analyzer)"
    )

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"]


settings = Settings()

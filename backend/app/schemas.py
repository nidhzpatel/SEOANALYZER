"""Pydantic schemas for request/response models."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, HttpUrl


class AnalyzeRequest(BaseModel):
    """Request to analyze a URL."""
    url: HttpUrl


class SEOIssue(BaseModel):
    """A single SEO issue found during analysis."""
    category: str  # onpage, technical, performance, content
    severity: str  # critical, warning, info, pass
    title: str
    message: str
    details: Optional[str] = None


class AIRecommendation(BaseModel):
    """A single AI-generated recommendation."""
    priority: str = "medium"  # high, medium, low
    title: str = ""
    description: str = ""
    impact: str = ""


class AnalyzeResponse(BaseModel):
    """Full analysis report response."""
    id: int
    url: str
    overall_score: float
    grade: str
    onpage_seo_score: float
    technical_seo_score: float
    performance_score: float
    ai_score: float = 50.0
    issues: list[SEOIssue]
    crawl_data: dict
    seo_signals: dict
    pagespeed_data: dict
    # AI-generated data
    ai_content_analysis: dict = {}
    ai_recommendations: list[AIRecommendation] = []
    ai_suggested_title: str = ""
    ai_suggested_meta: str = ""
    ai_summary: str = ""
    created_at: datetime

    class Config:
        from_attributes = True


class ReportSummary(BaseModel):
    """Summary of a report for listing."""
    id: int
    url: str
    overall_score: float
    grade: str
    created_at: datetime

    class Config:
        from_attributes = True

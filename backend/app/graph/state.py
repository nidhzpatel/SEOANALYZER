"""LangGraph state definition for the SEO analysis workflow."""

from typing import TypedDict, Optional


class SEOState(TypedDict, total=False):
    """State that flows through the LangGraph SEO analysis workflow.

    Each node reads from and writes to this shared state.
    """

    # Input
    url: str

    # Crawler output
    html_content: str
    status_code: int
    response_time: float
    crawl_data: dict  # parsed page data (title, meta, headings, links, images, etc.)

    # SEO Analyzer output
    seo_signals: dict  # detailed SEO signal checks
    seo_issues: list  # issues found during SEO analysis

    # PageSpeed output
    pagespeed_data: dict  # performance metrics from Google PageSpeed API
    pagespeed_issues: list  # performance-related issues

    # AI Content Analyzer output
    ai_content_analysis: dict  # LLM content quality evaluation
    ai_content_score: float  # 0-100 content quality score from LLM

    # Score Generator output
    onpage_seo_score: float
    technical_seo_score: float
    performance_score: float
    ai_score: float  # AI content quality score (weighted)
    overall_score: float
    grade: str
    all_issues: list  # consolidated issues from all nodes

    # AI Recommendations output
    ai_recommendations: list  # LLM-generated actionable recommendations
    ai_suggested_title: str  # LLM-suggested improved title
    ai_suggested_meta: str  # LLM-suggested improved meta description
    ai_summary: str  # LLM-generated overall SEO summary

    # Error handling
    error: Optional[str]

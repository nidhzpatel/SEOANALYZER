"""API routes for SEO analysis."""

import logging

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Report
from app.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    ReportSummary,
    SEOIssue,
    AIRecommendation,
    AIStrategy,
    AIRecommendationsContainer,
)
from app.graph.workflow import seo_workflow

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_url(request: AnalyzeRequest, db: Session = Depends(get_db)):
    """Analyze a URL for SEO issues.

    Runs the full LangGraph workflow:
    1. Crawl the website
    2. Analyze SEO signals (rule-based)
    3. Check PageSpeed performance
    4. AI content analysis (Ollama LLM)
    5. Generate overall score (rules + AI)
    6. AI recommendations (Ollama LLM)

    Saves the report to the database and returns it.
    """
    url = str(request.url)
    logger.info(f"Starting SEO analysis for: {url}")

    # Run the LangGraph workflow
    initial_state = {"url": url}

    try:
        result = seo_workflow.invoke(initial_state)
    except Exception as e:
        logger.error(f"Workflow error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    # Check for crawl errors
    if result.get("error"):
        raise HTTPException(status_code=422, detail=result["error"])

    # Save report to database
    report = Report(
        url=url,
        overall_score=result.get("overall_score", 0),
        grade=result.get("grade", "F"),
        onpage_seo_score=result.get("onpage_seo_score", 0),
        technical_seo_score=result.get("technical_seo_score", 0),
        performance_score=result.get("performance_score", 0),
        ai_score=result.get("ai_score", 50.0),
        ai_suggested_title=result.get("ai_suggested_title", ""),
        ai_suggested_meta=result.get("ai_suggested_meta", ""),
        ai_summary=result.get("ai_summary", ""),
    )
    report.crawl_data = result.get("crawl_data", {})
    report.seo_signals = result.get("seo_signals", {})
    report.pagespeed_data = result.get("pagespeed_data", {})
    report.issues = result.get("all_issues", [])
    report.ai_content_analysis = result.get("ai_content_analysis", {})
    report.ai_recommendations = result.get("ai_recommendations", [])

    db.add(report)
    db.commit()
    db.refresh(report)

    logger.info(f"Report saved: id={report.id}, score={report.overall_score}, grade={report.grade}")

    return _report_to_response(report)


@router.get("/reports", response_model=list[ReportSummary])
def list_reports(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """List all saved reports, most recent first."""
    reports = (
        db.query(Report)
        .order_by(Report.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        ReportSummary(
            id=r.id,
            url=r.url,
            overall_score=r.overall_score,
            grade=r.grade,
            created_at=r.created_at,
        )
        for r in reports
    ]


@router.get("/reports/{report_id}", response_model=AnalyzeResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    """Get a specific report by ID."""
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return _report_to_response(report)


def _report_to_response(report: Report) -> AnalyzeResponse:
    """Convert a Report model to an AnalyzeResponse."""
    issues_data = report.issues if isinstance(report.issues, list) else []

    # ai_recommendations may be stored as the new {recommendations, strategy}
    # object or as the legacy flat list. Normalise to the container shape.
    raw_ai_recs = report.ai_recommendations
    if isinstance(raw_ai_recs, dict):
        recommendations_data = raw_ai_recs.get("recommendations", [])
        strategy_data = raw_ai_recs.get("strategy", {})
    else:
        # Legacy flat-list format: treat as recommendations with no strategy.
        recommendations_data = raw_ai_recs if isinstance(raw_ai_recs, list) else []
        strategy_data = {}

    strategy = AIStrategy(**strategy_data)
    recommendations = [AIRecommendation(**rec) for rec in recommendations_data]
    ai_recommendations = AIRecommendationsContainer(
        recommendations=recommendations,
        strategy=strategy,
    )

    return AnalyzeResponse(
        id=report.id,
        url=report.url,
        overall_score=report.overall_score,
        grade=report.grade,
        onpage_seo_score=report.onpage_seo_score,
        technical_seo_score=report.technical_seo_score,
        performance_score=report.performance_score,
        ai_score=report.ai_score,
        issues=[SEOIssue(**issue) for issue in issues_data],
        crawl_data=report.crawl_data,
        seo_signals=report.seo_signals,
        pagespeed_data=report.pagespeed_data,
        ai_content_analysis=report.ai_content_analysis,
        ai_recommendations=ai_recommendations,
        ai_suggested_title=report.ai_suggested_title or "",
        ai_suggested_meta=report.ai_suggested_meta or "",
        ai_summary=report.ai_summary or "",
        created_at=report.created_at,
    )

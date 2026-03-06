"""Score Generator node — computes the overall SEO score from all signals including AI analysis."""

import logging

from app.graph.state import SEOState

logger = logging.getLogger(__name__)


def generate_score(state: SEOState) -> dict:
    """Generate overall SEO score from all analysis results including AI content analysis.

    Scoring weights:
    - On-Page SEO:   30%  (title, meta desc, headings, images, links, content, OG)
    - Technical SEO: 25%  (canonical, robots, viewport, https, lang, charset, structured data, favicon)
    - Performance:   25%  (PageSpeed score)
    - AI Content:    20%  (LLM-evaluated content quality)

    Returns:
    - onpage_seo_score (0-100)
    - technical_seo_score (0-100)
    - performance_score (0-100)
    - ai_score (0-100)
    - overall_score (0-100)
    - grade (A-F)
    - all_issues (consolidated list sorted by severity)
    """
    seo_signals = state.get("seo_signals", {})
    pagespeed_data = state.get("pagespeed_data", {})
    seo_issues = state.get("seo_issues", [])
    pagespeed_issues = state.get("pagespeed_issues", [])
    ai_content_score = state.get("ai_content_score", 50.0)

    # ── On-Page SEO Score (30%) ─────────────────────────
    onpage_checks = {
        "title": _signal_score(seo_signals.get("title", {})),
        "meta_description": _signal_score(seo_signals.get("meta_description", {})),
        "h1": _signal_score(seo_signals.get("h1", {})),
        "heading_hierarchy": _signal_score(seo_signals.get("heading_hierarchy", {})),
        "images": _signal_score(seo_signals.get("images", {})),
        "links": _signal_score(seo_signals.get("links", {})),
        "open_graph": _signal_score(seo_signals.get("open_graph", {})),
        "content_length": _signal_score(seo_signals.get("content_length", {})),
    }
    onpage_seo_score = _average_scores(onpage_checks)

    # ── Technical SEO Score (25%) ───────────────────────
    technical_checks = {
        "canonical": _signal_score(seo_signals.get("canonical", {})),
        "meta_robots": _signal_score(seo_signals.get("meta_robots", {})),
        "viewport": _signal_score(seo_signals.get("viewport", {})),
        "url_structure": _signal_score(seo_signals.get("url_structure", {})),
        "language": _signal_score(seo_signals.get("language", {})),
        "charset": _signal_score(seo_signals.get("charset", {})),
        "structured_data": _signal_score(seo_signals.get("structured_data", {})),
        "favicon": _signal_score(seo_signals.get("favicon", {})),
    }
    technical_seo_score = _average_scores(technical_checks)

    # ── Performance Score (25%) ─────────────────────────
    pagespeed_score = pagespeed_data.get("performance_score")
    if pagespeed_score is not None:
        performance_score = float(pagespeed_score)
    else:
        performance_score = 50.0

    # ── AI Content Score (20%) ──────────────────────────
    ai_score = float(ai_content_score)

    # ── Overall Score ───────────────────────────────────
    overall_score = round(
        onpage_seo_score * 0.30 +
        technical_seo_score * 0.25 +
        performance_score * 0.25 +
        ai_score * 0.20,
        1,
    )

    # ── Grade ───────────────────────────────────────────
    grade = _score_to_grade(overall_score)

    # ── Consolidate Issues ──────────────────────────────
    all_issues = seo_issues + pagespeed_issues
    severity_order = {"critical": 0, "warning": 1, "info": 2, "pass": 3}
    all_issues.sort(key=lambda x: severity_order.get(x.get("severity", "info"), 99))

    logger.info(f"Score generated: {overall_score} ({grade}) | "
                f"OnPage={onpage_seo_score} Tech={technical_seo_score} "
                f"Perf={performance_score} AI={ai_score}")

    return {
        "onpage_seo_score": round(onpage_seo_score, 1),
        "technical_seo_score": round(technical_seo_score, 1),
        "performance_score": round(performance_score, 1),
        "ai_score": round(ai_score, 1),
        "overall_score": overall_score,
        "grade": grade,
        "all_issues": all_issues,
    }


def _signal_score(signal: dict) -> float:
    """Convert a signal status to a numeric score."""
    status = signal.get("status", "info")
    mapping = {
        "pass": 100.0,
        "info": 75.0,
        "warning": 50.0,
        "fail": 0.0,
    }
    return mapping.get(status, 50.0)


def _average_scores(checks: dict) -> float:
    """Compute the average score from a dict of check scores."""
    if not checks:
        return 0.0
    return sum(checks.values()) / len(checks)


def _score_to_grade(score: float) -> str:
    """Convert a numeric score (0-100) to a letter grade."""
    if score >= 90:
        return "A"
    elif score >= 80:
        return "B"
    elif score >= 70:
        return "C"
    elif score >= 60:
        return "D"
    else:
        return "F"

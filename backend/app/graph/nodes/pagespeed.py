"""PageSpeed Analyzer node — fetches performance data from Google PageSpeed Insights API."""

import logging

import requests

from app.config import settings
from app.graph.state import SEOState

logger = logging.getLogger(__name__)


def check_pagespeed(state: SEOState) -> dict:
    """Check page performance using Google PageSpeed Insights API.

    Extracts:
    - Performance score (0-100)
    - First Contentful Paint (FCP)
    - Largest Contentful Paint (LCP)
    - Total Blocking Time (TBT)
    - Cumulative Layout Shift (CLS)
    - Speed Index
    - Time to Interactive (TTI)
    """
    url = state.get("url", "")
    logger.info(f"Checking PageSpeed for: {url}")

    try:
        params = {
            "url": url,
            "strategy": "mobile",
            "category": "performance",
        }

        if settings.PAGESPEED_API_KEY:
            params["key"] = settings.PAGESPEED_API_KEY

        response = requests.get(
            settings.PAGESPEED_API_URL,
            params=params,
            timeout=60,
        )

        if response.status_code != 200:
            logger.warning(f"PageSpeed API returned {response.status_code}")
            return _fallback_result("PageSpeed API returned an error. Using estimated values.")

        data = response.json()

        # Extract Lighthouse results
        lighthouse = data.get("lighthouseResult", {})
        categories = lighthouse.get("categories", {})
        audits = lighthouse.get("audits", {})

        # Performance score (0-1 from API, we convert to 0-100)
        perf_category = categories.get("performance", {})
        perf_score = perf_category.get("score", 0)
        perf_score_100 = round((perf_score or 0) * 100)

        # Extract Field Data (Crux) for INP
        field_data = data.get("loadingExperience", {}).get("metrics", {})
        inp_data = field_data.get("INTERACTION_TO_NEXT_PAINT_MS", {})
        inp_value = inp_data.get("percentile", "N/A")
        inp_category = inp_data.get("category", "N/A")

        # Extract optimization suggestions
        suggestions = []
        for audit_id, audit in audits.items():
            if audit.get("score") is not None and audit.get("score") < 1.0:
                if audit.get("details", {}).get("type") == "opportunity":
                    savings = audit.get("details", {}).get("overallSavingsMs", 0)
                    suggestions.append({
                        "id": audit_id,
                        "title": audit.get("title"),
                        "description": audit.get("description"),
                        "savings_ms": savings
                    })
        suggestions = sorted(suggestions, key=lambda x: x.get("savings_ms", 0), reverse=True)

        # Core Web Vitals
        metrics = {
            "performance_score": perf_score_100,
            "fcp": _extract_metric(audits, "first-contentful-paint"),
            "lcp": _extract_metric(audits, "largest-contentful-paint"),
            "tbt": _extract_metric(audits, "total-blocking-time"),
            "cls": _extract_metric(audits, "cumulative-layout-shift"),
            "speed_index": _extract_metric(audits, "speed-index"),
            "tti": _extract_metric(audits, "interactive"),
            "inp": {"value": inp_value, "category": inp_category},
            "optimization_suggestions": suggestions[:5]
        }

        # Generate performance-related issues
        pagespeed_issues = []

        if perf_score_100 < 50:
            pagespeed_issues.append(_issue("critical", "Poor Performance Score",
                                           f"Performance score is {perf_score_100}/100. Significant optimization needed."))
        elif perf_score_100 < 90:
            pagespeed_issues.append(_issue("warning", "Moderate Performance",
                                           f"Performance score is {perf_score_100}/100. Some optimizations recommended."))

        # Check LCP
        lcp_val = metrics["lcp"].get("numericValue", 0)
        if lcp_val > 4000:
            pagespeed_issues.append(_issue("critical", "Slow Largest Contentful Paint",
                                           f"LCP is {lcp_val/1000:.1f}s. Should be under 2.5s for good user experience."))
        elif lcp_val > 2500:
            pagespeed_issues.append(_issue("warning", "LCP Needs Improvement",
                                           f"LCP is {lcp_val/1000:.1f}s. Target is under 2.5s."))

        # Check CLS
        cls_val = metrics["cls"].get("numericValue", 0)
        if cls_val > 0.25:
            pagespeed_issues.append(_issue("critical", "High Layout Shift",
                                           f"CLS is {cls_val:.3f}. Should be under 0.1 for a stable layout."))
        elif cls_val > 0.1:
            pagespeed_issues.append(_issue("warning", "Layout Shift Detected",
                                           f"CLS is {cls_val:.3f}. Target is under 0.1."))

        # Check TBT
        tbt_val = metrics["tbt"].get("numericValue", 0)
        if tbt_val > 600:
            pagespeed_issues.append(_issue("critical", "High Total Blocking Time",
                                           f"TBT is {tbt_val}ms. Should be under 200ms for good interactivity."))
        elif tbt_val > 200:
            pagespeed_issues.append(_issue("warning", "Moderate Blocking Time",
                                           f"TBT is {tbt_val}ms. Target is under 200ms."))

        logger.info(f"PageSpeed analysis complete: score={perf_score_100}")

        return {
            "pagespeed_data": metrics,
            "pagespeed_issues": pagespeed_issues,
        }

    except requests.exceptions.Timeout:
        logger.warning("PageSpeed API timed out")
        return _fallback_result("PageSpeed API timed out. Using estimated values.")
    except Exception as e:
        logger.error(f"PageSpeed API error: {e}")
        return _fallback_result(f"PageSpeed API error: {str(e)}")


def _extract_metric(audits: dict, key: str) -> dict:
    """Extract a specific metric from Lighthouse audits."""
    audit = audits.get(key, {})
    return {
        "score": audit.get("score"),
        "displayValue": audit.get("displayValue", "N/A"),
        "numericValue": audit.get("numericValue", 0),
    }


def _issue(severity: str, title: str, message: str) -> dict:
    """Create a performance issue."""
    return {
        "category": "performance",
        "severity": severity,
        "title": title,
        "message": message,
    }


def _fallback_result(reason: str) -> dict:
    """Return fallback result when PageSpeed API is unavailable."""
    return {
        "pagespeed_data": {
            "performance_score": None,
            "fcp": {"score": None, "displayValue": "N/A", "numericValue": 0},
            "lcp": {"score": None, "displayValue": "N/A", "numericValue": 0},
            "tbt": {"score": None, "displayValue": "N/A", "numericValue": 0},
            "cls": {"score": None, "displayValue": "N/A", "numericValue": 0},
            "speed_index": {"score": None, "displayValue": "N/A", "numericValue": 0},
            "tti": {"score": None, "displayValue": "N/A", "numericValue": 0},
            "inp": {"value": "N/A", "category": "N/A"},
            "optimization_suggestions": [],
            "error": reason,
        },
        "pagespeed_issues": [
            _issue("info", "PageSpeed Data Unavailable", reason)
        ],
    }

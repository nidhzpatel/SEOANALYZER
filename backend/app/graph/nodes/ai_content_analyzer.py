"""AI Content Analyzer node — uses Ollama LLM to evaluate page content quality."""

import logging

from app.graph.state import SEOState
from app.llm import invoke_llm_json

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert SEO content analyst. Evaluate the given webpage content and provide a structured analysis.

You MUST respond with valid JSON only, no other text. Use this exact format:
{
    "content_quality_score": <1-10 integer>,
    "readability_score": <1-10 integer>,
    "keyword_relevance": <1-10 integer>,
    "topic_clarity": <1-10 integer>,
    "content_depth": <1-10 integer>,
    "overall_content_score": <1-100 integer>,
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "content_summary": "Brief summary of what the page is about and its content quality"
}

Scoring guide:
- 1-3: Poor — missing, thin, or irrelevant content
- 4-6: Average — basic content that could be improved
- 7-8: Good — well-written, relevant content
- 9-10: Excellent — exceptional content quality"""


def ai_content_analyze(state: SEOState) -> dict:
    """Use LLM to analyze the content quality of the crawled page.

    The LLM evaluates:
    - Content quality and depth
    - Readability
    - Keyword relevance
    - Topic clarity
    - Overall writing quality
    """
    crawl_data = state.get("crawl_data", {})
    url = state.get("url", "")
    html_content = state.get("html_content", "")

    logger.info(f"Running AI content analysis for: {url}")

    # Build context for the LLM
    title = crawl_data.get("title", "No title")
    meta_desc = crawl_data.get("meta_description", "No meta description")
    headings = crawl_data.get("headings", {})
    word_count = crawl_data.get("word_count", 0)

    # Extract readable text (first ~2000 chars of body content)
    body_text = _extract_body_text(html_content)

    h1_list = headings.get("h1", [])
    h2_list = headings.get("h2", [])

    user_prompt = f"""Analyze this webpage for SEO content quality:

URL: {url}
Title: {title}
Meta Description: {meta_desc}
H1 Tags: {', '.join(h1_list[:5]) if h1_list else 'None'}
H2 Tags: {', '.join(h2_list[:10]) if h2_list else 'None'}
Word Count: {word_count}
Number of Images: {crawl_data.get('images_total', 0)}
Internal Links: {crawl_data.get('internal_links', 0)}
External Links: {crawl_data.get('external_links', 0)}

Page Content (excerpt):
{body_text[:2000]}
"""

    try:
        analysis = invoke_llm_json(SYSTEM_PROMPT, user_prompt)

        # Extract the overall content score (0-100)
        content_score = float(analysis.get("overall_content_score", 50))
        content_score = max(0, min(100, content_score))  # Clamp to 0-100

        # Generate content-related issues
        content_issues = _generate_content_issues(analysis)

        logger.info(f"AI content analysis complete: score={content_score}")

        return {
            "ai_content_analysis": analysis,
            "ai_content_score": content_score,
            "seo_issues": state.get("seo_issues", []) + content_issues,
        }

    except Exception as e:
        logger.error(f"AI content analysis failed: {e}")
        return {
            "ai_content_analysis": {"error": str(e), "content_summary": "AI analysis unavailable"},
            "ai_content_score": 50.0,  # Neutral fallback
        }


def _extract_body_text(html: str) -> str:
    """Extract readable text from HTML, stripping tags."""
    try:
        from bs4 import BeautifulSoup
        soup = BeautifulSoup(html, "html.parser")

        # Remove script and style elements
        for element in soup(["script", "style", "nav", "footer", "header"]):
            element.decompose()

        text = soup.get_text(separator=" ", strip=True)
        # Clean up whitespace
        lines = [line.strip() for line in text.splitlines() if line.strip()]
        return " ".join(lines)
    except Exception:
        return html[:2000] if html else ""


def _generate_content_issues(analysis: dict) -> list:
    """Generate SEO issues based on AI content analysis."""
    issues = []

    quality = analysis.get("content_quality_score", 5)
    readability = analysis.get("readability_score", 5)
    keyword_rel = analysis.get("keyword_relevance", 5)

    if quality <= 3:
        issues.append({
            "category": "content",
            "severity": "critical",
            "title": "Poor Content Quality",
            "message": "AI analysis detected low content quality. Consider rewriting for depth and value.",
        })
    elif quality <= 5:
        issues.append({
            "category": "content",
            "severity": "warning",
            "title": "Content Quality Needs Improvement",
            "message": "Content is average. Add more depth, examples, and value for readers.",
        })

    if readability <= 3:
        issues.append({
            "category": "content",
            "severity": "warning",
            "title": "Low Readability Score",
            "message": "Content is difficult to read. Use shorter sentences and simpler language.",
        })

    if keyword_rel <= 3:
        issues.append({
            "category": "content",
            "severity": "warning",
            "title": "Low Keyword Relevance",
            "message": "Content keywords don't align well with the page topic.",
        })

    # Add strengths and weaknesses from LLM
    for weakness in analysis.get("weaknesses", [])[:3]:
        issues.append({
            "category": "content",
            "severity": "info",
            "title": "AI Insight",
            "message": weakness,
        })

    return issues

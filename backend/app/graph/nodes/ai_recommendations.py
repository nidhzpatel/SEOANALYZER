"""AI Recommendations node — uses Ollama LLM to generate SEO improvement suggestions."""

import logging

from app.graph.state import SEOState
from app.llm import invoke_llm_json, invoke_llm

logger = logging.getLogger(__name__)

RECOMMENDATIONS_SYSTEM_PROMPT = """You are an expert SEO consultant. Based on the SEO analysis results, provide actionable recommendations to improve the website's SEO.

You MUST respond with valid JSON only, no other text. Use this exact format:
{
    "recommendations": [
        {
            "priority": "high|medium|low",
            "title": "Short recommendation title",
            "description": "Detailed actionable description of what to do and why",
            "impact": "Expected impact on SEO score"
        }
    ],
    "suggested_title": "An improved SEO-optimized title tag (50-60 characters)",
    "suggested_meta_description": "An improved SEO-optimized meta description (150-160 characters)",
    "overall_summary": "A 2-3 sentence summary of the website's SEO health and key areas for improvement"
}

Provide 4-6 prioritized recommendations. Be specific and actionable — don't give generic advice."""


META_SYSTEM_PROMPT = """You are an expert SEO copywriter. Generate optimized meta tags based on the page content.

Respond with valid JSON only:
{
    "suggested_title": "SEO-optimized title (50-60 chars)",
    "suggested_meta_description": "SEO-optimized meta description (150-160 chars)"
}"""


def ai_recommend(state: SEOState) -> dict:
    """Use LLM to generate personalized SEO recommendations.

    Takes the full analysis results (issues, scores, crawl data) and generates:
    - Prioritized actionable recommendations
    - Improved title tag suggestion
    - Improved meta description suggestion
    - Overall SEO health summary
    """
    url = state.get("url", "")
    crawl_data = state.get("crawl_data", {})
    seo_signals = state.get("seo_signals", {})
    all_issues = state.get("all_issues", [])
    overall_score = state.get("overall_score", 0)
    grade = state.get("grade", "F")
    ai_content = state.get("ai_content_analysis", {})

    logger.info(f"Generating AI recommendations for: {url}")

    # Build a summary of issues for the LLM
    issues_summary = []
    for issue in all_issues[:15]:  # Cap at 15 issues
        issues_summary.append(f"[{issue.get('severity', 'info')}] {issue.get('title', '')}: {issue.get('message', '')}")

    user_prompt = f"""Analyze these SEO results and provide recommendations:

URL: {url}
Overall Score: {overall_score}/100 (Grade: {grade})
On-Page SEO Score: {state.get('onpage_seo_score', 0)}
Technical SEO Score: {state.get('technical_seo_score', 0)}
Performance Score: {state.get('performance_score', 0)}
AI Content Score: {state.get('ai_content_score', 50)}

Current Title: {crawl_data.get('title', 'None')} ({crawl_data.get('title_length', 0)} chars)
Current Meta Description: {crawl_data.get('meta_description', 'None')} ({crawl_data.get('meta_description_length', 0)} chars)
Word Count: {crawl_data.get('word_count', 0)}
H1 Tags: {len(crawl_data.get('headings', {}).get('h1', []))}
Images Without Alt: {crawl_data.get('images_without_alt', 0)}/{crawl_data.get('images_total', 0)}
Internal Links: {crawl_data.get('internal_links', 0)}
External Links: {crawl_data.get('external_links', 0)}

Content Analysis: {ai_content.get('content_summary', 'Not available')}

Detected Issues:
{chr(10).join(issues_summary) if issues_summary else 'No major issues detected'}
"""

    try:
        result = invoke_llm_json(RECOMMENDATIONS_SYSTEM_PROMPT, user_prompt)

        recommendations = result.get("recommendations", [])
        suggested_title = result.get("suggested_title", "")
        suggested_meta = result.get("suggested_meta_description", "")
        summary = result.get("overall_summary", "")

        # If the LLM didn't return proper structured data, fallback
        if not recommendations and "raw_response" in result:
            logger.warning("LLM returned unstructured response, using raw text")
            summary = result.get("raw_response", "AI recommendations unavailable")[:500]
            recommendations = []

        logger.info(f"AI recommendations generated: {len(recommendations)} items")

        return {
            "ai_recommendations": recommendations,
            "ai_suggested_title": suggested_title,
            "ai_suggested_meta": suggested_meta,
            "ai_summary": summary,
        }

    except Exception as e:
        logger.error(f"AI recommendations failed: {e}")
        return {
            "ai_recommendations": [],
            "ai_suggested_title": "",
            "ai_suggested_meta": "",
            "ai_summary": f"AI recommendations unavailable: {str(e)}",
        }

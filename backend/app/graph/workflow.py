"""LangGraph workflow — orchestrates the SEO analysis pipeline with AI nodes.

Graph structure:
    START → crawl → (check error) → analyze_seo → check_pagespeed → ai_content_analyzer → generate_score → ai_recommendations → END
                          ↓ (on error)
                         END
"""

import logging

from langgraph.graph import StateGraph, END

from app.graph.state import SEOState
from app.graph.nodes.crawler import crawl_website
from app.graph.nodes.seo_analyzer import analyze_seo
from app.graph.nodes.pagespeed import check_pagespeed
from app.graph.nodes.ai_content_analyzer import ai_content_analyze
from app.graph.nodes.score_generator import generate_score
from app.graph.nodes.ai_recommendations import ai_recommend

logger = logging.getLogger(__name__)


def should_continue_after_crawl(state: SEOState) -> str:
    """Conditional edge: check if crawl succeeded before proceeding."""
    if state.get("error"):
        logger.warning(f"Crawl failed, ending workflow: {state['error']}")
        return "end"
    return "continue"


def build_seo_workflow():
    """Build and compile the LangGraph SEO analysis workflow.

    Returns a compiled graph that accepts SEOState and runs:
    1. crawl_website        — Fetch and parse HTML
    2. analyze_seo          — Check SEO signals (rule-based)
    3. check_pagespeed      — Get performance metrics
    4. ai_content_analyze   — LLM evaluates content quality
    5. generate_score       — Compute final score (rules + AI)
    6. ai_recommend         — LLM generates recommendations
    """
    workflow = StateGraph(SEOState)

    # Add nodes
    workflow.add_node("crawl", crawl_website)
    workflow.add_node("analyze_seo", analyze_seo)
    workflow.add_node("check_pagespeed", check_pagespeed)
    workflow.add_node("ai_content_analyze", ai_content_analyze)
    workflow.add_node("generate_score", generate_score)
    workflow.add_node("ai_recommend", ai_recommend)

    # Set entry point
    workflow.set_entry_point("crawl")

    # Conditional edge after crawl
    workflow.add_conditional_edges(
        "crawl",
        should_continue_after_crawl,
        {
            "continue": "analyze_seo",
            "end": END,
        },
    )

    # Sequential edges through the full pipeline
    workflow.add_edge("analyze_seo", "check_pagespeed")
    workflow.add_edge("check_pagespeed", "ai_content_analyze")
    workflow.add_edge("ai_content_analyze", "generate_score")
    workflow.add_edge("generate_score", "ai_recommend")
    workflow.add_edge("ai_recommend", END)

    # Compile the graph
    compiled = workflow.compile()
    logger.info("SEO workflow compiled successfully (with AI nodes)")
    return compiled


# Pre-built workflow instance
seo_workflow = build_seo_workflow()

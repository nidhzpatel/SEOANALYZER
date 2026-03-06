"""SEO Analyzer node — extracts and evaluates SEO signals from crawled data."""

import logging
import re
from urllib.parse import urlparse

from app.graph.state import SEOState

logger = logging.getLogger(__name__)


def analyze_seo(state: SEOState) -> dict:
    """Analyze SEO signals from the crawled page data.

    Checks:
    - Title tag (presence, length)
    - Meta description (presence, length)
    - H1 tag (presence, uniqueness)
    - Heading hierarchy
    - Image alt attributes
    - Internal/external links
    - Canonical URL
    - Meta robots
    - Open Graph / Twitter Card tags
    - URL structure
    - Content length
    - Language attribute
    - Favicon
    - Structured data
    """
    crawl_data = state.get("crawl_data", {})
    url = state.get("url", "")

    if not crawl_data:
        return {
            "seo_signals": {},
            "seo_issues": [_issue("technical", "critical", "No Crawl Data", "The page could not be crawled.")],
        }

    signals = {}
    issues = []

    # ── Title Tag ────────────────────────────────────────
    title = crawl_data.get("title")
    title_len = crawl_data.get("title_length", 0)

    if not title:
        signals["title"] = {"status": "fail", "value": None, "recommendation": "Add a title tag"}
        issues.append(_issue("onpage", "critical", "Missing Title Tag",
                             "The page has no title tag. This is critical for SEO."))
    elif title_len < 30:
        signals["title"] = {"status": "warning", "value": title, "length": title_len}
        issues.append(_issue("onpage", "warning", "Title Too Short",
                             f"Title is only {title_len} characters. Recommended: 50-60 characters.",
                             f"Current title: \"{title}\""))
    elif title_len > 60:
        signals["title"] = {"status": "warning", "value": title, "length": title_len}
        issues.append(_issue("onpage", "warning", "Title Too Long",
                             f"Title is {title_len} characters. Search engines may truncate it. Recommended: 50-60 characters.",
                             f"Current title: \"{title}\""))
    else:
        signals["title"] = {"status": "pass", "value": title, "length": title_len}

    # ── Meta Description ─────────────────────────────────
    desc = crawl_data.get("meta_description")
    desc_len = crawl_data.get("meta_description_length", 0)

    if not desc:
        signals["meta_description"] = {"status": "fail", "value": None}
        issues.append(_issue("onpage", "critical", "Missing Meta Description",
                             "No meta description found. This helps search engines understand page content."))
    elif desc_len < 120:
        signals["meta_description"] = {"status": "warning", "value": desc, "length": desc_len}
        issues.append(_issue("onpage", "warning", "Meta Description Too Short",
                             f"Meta description is {desc_len} chars. Recommended: 150-160 characters."))
    elif desc_len > 160:
        signals["meta_description"] = {"status": "warning", "value": desc, "length": desc_len}
        issues.append(_issue("onpage", "warning", "Meta Description Too Long",
                             f"Meta description is {desc_len} chars. May be truncated. Recommended: 150-160 characters."))
    else:
        signals["meta_description"] = {"status": "pass", "value": desc, "length": desc_len}

    # ── H1 Tag ───────────────────────────────────────────
    h1_count = crawl_data.get("h1_count", 0)
    h1_values = crawl_data.get("headings", {}).get("h1", [])

    if h1_count == 0:
        signals["h1"] = {"status": "fail", "count": 0}
        issues.append(_issue("onpage", "critical", "Missing H1 Tag",
                             "No H1 heading found. Every page should have exactly one H1."))
    elif h1_count > 1:
        signals["h1"] = {"status": "warning", "count": h1_count, "values": h1_values}
        issues.append(_issue("onpage", "warning", "Multiple H1 Tags",
                             f"Found {h1_count} H1 tags. Best practice is to have exactly one H1 per page.",
                             f"H1 tags: {', '.join(h1_values[:5])}"))
    else:
        signals["h1"] = {"status": "pass", "count": 1, "value": h1_values[0] if h1_values else ""}

    # ── Heading Hierarchy ────────────────────────────────
    headings = crawl_data.get("headings", {})
    has_h2 = len(headings.get("h2", [])) > 0
    has_h3 = len(headings.get("h3", [])) > 0

    if h1_count > 0 and not has_h2:
        signals["heading_hierarchy"] = {"status": "warning"}
        issues.append(_issue("onpage", "info", "No H2 Headings",
                             "Consider adding H2 subheadings to structure your content better."))
    else:
        signals["heading_hierarchy"] = {"status": "pass"}

    # ── Images Alt Attributes ────────────────────────────
    total_images = crawl_data.get("images_total", 0)
    images_no_alt = crawl_data.get("images_without_alt", 0)

    if total_images == 0:
        signals["images"] = {"status": "pass", "total": 0, "missing_alt": 0}
    elif images_no_alt > 0:
        pct = round((images_no_alt / total_images) * 100)
        signals["images"] = {"status": "warning" if pct < 50 else "fail", "total": total_images,
                             "missing_alt": images_no_alt}
        severity = "critical" if pct >= 50 else "warning"
        issues.append(_issue("onpage", severity, "Images Missing Alt Text",
                             f"{images_no_alt} of {total_images} images ({pct}%) are missing alt attributes.",
                             "Alt text helps search engines understand images and improves accessibility."))
    else:
        signals["images"] = {"status": "pass", "total": total_images, "missing_alt": 0}

    # ── Links ────────────────────────────────────────────
    internal = crawl_data.get("internal_links", 0)
    external = crawl_data.get("external_links", 0)

    signals["links"] = {"status": "pass", "internal": internal, "external": external}
    if internal == 0:
        issues.append(_issue("onpage", "warning", "No Internal Links",
                             "The page has no internal links. Internal linking helps search engines discover content."))
        signals["links"]["status"] = "warning"

    # ── Canonical URL ────────────────────────────────────
    canonical = crawl_data.get("canonical")
    if canonical:
        signals["canonical"] = {"status": "pass", "value": canonical}
    else:
        signals["canonical"] = {"status": "warning", "value": None}
        issues.append(_issue("technical", "warning", "Missing Canonical Tag",
                             "No canonical URL found. Add a canonical tag to prevent duplicate content issues."))

    # ── Meta Robots ──────────────────────────────────────
    robots = crawl_data.get("meta_robots")
    if robots:
        signals["meta_robots"] = {"status": "pass", "value": robots}
        if "noindex" in robots.lower():
            issues.append(_issue("technical", "critical", "Page Set to Noindex",
                                 "The robots meta tag includes 'noindex'. This page will NOT appear in search results.",
                                 f"Meta robots: {robots}"))
            signals["meta_robots"]["status"] = "fail"
    else:
        signals["meta_robots"] = {"status": "info", "value": None}
        issues.append(_issue("technical", "info", "No Meta Robots Tag",
                             "No explicit meta robots tag. Defaults to index,follow which is usually fine."))

    # ── Open Graph Tags ──────────────────────────────────
    og_tags = crawl_data.get("og_tags", {})
    essential_og = ["og:title", "og:description", "og:image", "og:url"]
    missing_og = [tag for tag in essential_og if tag not in og_tags]

    if not og_tags:
        signals["open_graph"] = {"status": "fail", "tags_found": 0}
        issues.append(_issue("onpage", "warning", "No Open Graph Tags",
                             "No Open Graph tags found. These improve how your page appears when shared on social media."))
    elif missing_og:
        signals["open_graph"] = {"status": "warning", "tags_found": len(og_tags), "missing": missing_og}
        issues.append(_issue("onpage", "info", "Incomplete Open Graph Tags",
                             f"Missing OG tags: {', '.join(missing_og)}"))
    else:
        signals["open_graph"] = {"status": "pass", "tags_found": len(og_tags)}

    # ── Meta Viewport ────────────────────────────────────
    viewport = crawl_data.get("meta_viewport")
    if viewport:
        signals["viewport"] = {"status": "pass", "value": viewport}
    else:
        signals["viewport"] = {"status": "fail"}
        issues.append(_issue("technical", "critical", "Missing Viewport Meta Tag",
                             "No viewport meta tag found. This is essential for mobile-friendly pages."))

    # ── Language Attribute ───────────────────────────────
    lang = crawl_data.get("lang")
    if lang:
        signals["language"] = {"status": "pass", "value": lang}
    else:
        signals["language"] = {"status": "warning"}
        issues.append(_issue("technical", "warning", "Missing Language Attribute",
                             "No lang attribute on <html> tag. This helps search engines understand the page language."))

    # ── Charset ──────────────────────────────────────────
    charset = crawl_data.get("charset")
    if charset:
        signals["charset"] = {"status": "pass", "value": charset}
    else:
        signals["charset"] = {"status": "warning"}
        issues.append(_issue("technical", "info", "No Charset Declaration",
                             "No charset meta tag found. Recommended to declare UTF-8."))

    # ── URL Structure ────────────────────────────────────
    parsed = urlparse(url)
    url_issues_list = []

    if parsed.scheme != "https":
        url_issues_list.append("Not using HTTPS")
        issues.append(_issue("technical", "critical", "Not Using HTTPS",
                             "The page is not served over HTTPS. This is a ranking signal and security issue."))

    if len(parsed.path) > 115:
        url_issues_list.append("URL path is very long")
        issues.append(_issue("technical", "warning", "Long URL Path",
                             f"URL path is {len(parsed.path)} characters. Keep URLs concise for better SEO."))

    if re.search(r"[A-Z]", parsed.path):
        url_issues_list.append("URL contains uppercase letters")
        issues.append(_issue("technical", "info", "Uppercase Letters in URL",
                             "URL contains uppercase letters. Lowercase URLs are preferred."))

    if "_" in parsed.path:
        url_issues_list.append("URL uses underscores instead of hyphens")
        issues.append(_issue("technical", "info", "Underscores in URL",
                             "URL uses underscores. Hyphens are preferred for word separation."))

    signals["url_structure"] = {
        "status": "fail" if any("HTTPS" in i for i in url_issues_list) else ("warning" if url_issues_list else "pass"),
        "issues": url_issues_list,
    }

    # ── Content Length ───────────────────────────────────
    word_count = crawl_data.get("word_count", 0)
    if word_count < 300:
        signals["content_length"] = {"status": "warning", "word_count": word_count}
        issues.append(_issue("onpage", "warning", "Thin Content",
                             f"Page has only {word_count} words. Consider adding more substantive content (300+ words recommended)."))
    else:
        signals["content_length"] = {"status": "pass", "word_count": word_count}

    # ── Structured Data ──────────────────────────────────
    has_sd = crawl_data.get("has_structured_data", False)
    signals["structured_data"] = {"status": "pass" if has_sd else "info"}
    if not has_sd:
        issues.append(_issue("technical", "info", "No Structured Data",
                             "No JSON-LD structured data found. Adding structured data can enhance search appearance."))

    # ── Favicon ──────────────────────────────────────────
    has_favicon = crawl_data.get("has_favicon", False)
    signals["favicon"] = {"status": "pass" if has_favicon else "warning"}
    if not has_favicon:
        issues.append(_issue("technical", "info", "No Favicon Found",
                             "No favicon link detected. A favicon improves brand recognition in browser tabs."))

    logger.info(f"SEO analysis complete: {len(issues)} issues found")

    return {
        "seo_signals": signals,
        "seo_issues": issues,
    }


def _issue(category: str, severity: str, title: str, message: str, details: str = None) -> dict:
    """Create a standardized issue dictionary."""
    issue = {
        "category": category,
        "severity": severity,
        "title": title,
        "message": message,
    }
    if details:
        issue["details"] = details
    return issue

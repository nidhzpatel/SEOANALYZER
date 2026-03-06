"""Website crawler node — fetches and parses HTML using requests + BeautifulSoup."""

import time
import logging
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

from app.config import settings
from app.graph.state import SEOState

logger = logging.getLogger(__name__)


def crawl_website(state: SEOState) -> dict:
    """Crawl the target URL and extract page data.

    Fetches HTML, parses with BeautifulSoup, and extracts:
    - Title tag
    - Meta tags (description, robots, viewport, charset)
    - Open Graph tags
    - Headings (H1-H6)
    - Images (src, alt)
    - Links (internal/external, with anchor text)
    - Canonical URL
    - Language attribute
    - Structured data (JSON-LD)
    """
    url = state["url"]
    logger.info(f"Crawling: {url}")

    try:
        start_time = time.time()
        response = requests.get(
            url,
            headers={
                "User-Agent": settings.CRAWLER_USER_AGENT,
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
            },
            timeout=settings.CRAWLER_TIMEOUT,
            allow_redirects=True,
        )
        response_time = time.time() - start_time

        html_content = response.text
        soup = BeautifulSoup(html_content, "html.parser")
        parsed_url = urlparse(url)
        base_domain = f"{parsed_url.scheme}://{parsed_url.netloc}"

        # --- Extract page data ---

        # Title
        title_tag = soup.find("title")
        title = title_tag.get_text(strip=True) if title_tag else None

        # Meta tags
        meta_description = _get_meta(soup, "description")
        meta_robots = _get_meta(soup, "robots")
        meta_viewport = _get_meta(soup, "viewport")
        meta_charset = soup.find("meta", attrs={"charset": True})
        charset = meta_charset["charset"] if meta_charset else None

        # Open Graph
        og_tags = {}
        for og in soup.find_all("meta", attrs={"property": lambda x: x and x.startswith("og:")}):
            og_tags[og["property"]] = og.get("content", "")

        # Twitter Card
        twitter_tags = {}
        for tw in soup.find_all("meta", attrs={"name": lambda x: x and x.startswith("twitter:")}):
            twitter_tags[tw["name"]] = tw.get("content", "")

        # Canonical URL
        canonical_tag = soup.find("link", rel="canonical")
        canonical = canonical_tag["href"] if canonical_tag and canonical_tag.get("href") else None

        # Language
        html_tag = soup.find("html")
        lang = html_tag.get("lang", None) if html_tag else None

        # Headings
        headings = {}
        for level in range(1, 7):
            tag = f"h{level}"
            found = soup.find_all(tag)
            headings[tag] = [h.get_text(strip=True) for h in found]

        # Images
        images = []
        for img in soup.find_all("img"):
            images.append({
                "src": img.get("src", ""),
                "alt": img.get("alt", ""),
                "has_alt": bool(img.get("alt", "").strip()),
            })

        # Links
        internal_links = []
        external_links = []
        for a in soup.find_all("a", href=True):
            href = a["href"]
            anchor_text = a.get_text(strip=True)
            full_url = urljoin(url, href)
            link_data = {
                "href": full_url,
                "anchor_text": anchor_text,
                "has_nofollow": "nofollow" in a.get("rel", []),
            }
            if urlparse(full_url).netloc == parsed_url.netloc:
                internal_links.append(link_data)
            else:
                external_links.append(link_data)

        # Structured data (JSON-LD)
        json_ld_scripts = soup.find_all("script", type="application/ld+json")
        has_structured_data = len(json_ld_scripts) > 0

        # Favicon
        favicon = soup.find("link", rel=lambda x: x and "icon" in (x if isinstance(x, str) else " ".join(x)))
        has_favicon = favicon is not None

        crawl_data = {
            "title": title,
            "title_length": len(title) if title else 0,
            "meta_description": meta_description,
            "meta_description_length": len(meta_description) if meta_description else 0,
            "meta_robots": meta_robots,
            "meta_viewport": meta_viewport,
            "charset": charset,
            "canonical": canonical,
            "lang": lang,
            "og_tags": og_tags,
            "twitter_tags": twitter_tags,
            "headings": headings,
            "h1_count": len(headings.get("h1", [])),
            "images": images,
            "images_total": len(images),
            "images_without_alt": sum(1 for img in images if not img["has_alt"]),
            "internal_links": len(internal_links),
            "external_links": len(external_links),
            "internal_links_data": internal_links[:50],  # Cap for storage
            "external_links_data": external_links[:50],
            "has_structured_data": has_structured_data,
            "has_favicon": has_favicon,
            "word_count": len(soup.get_text().split()),
            "html_size_kb": round(len(html_content) / 1024, 2),
        }

        return {
            "html_content": html_content,
            "status_code": response.status_code,
            "response_time": round(response_time, 3),
            "crawl_data": crawl_data,
            "error": None,
        }

    except requests.exceptions.Timeout:
        logger.error(f"Timeout crawling {url}")
        return {"error": f"Timeout: The website took longer than {settings.CRAWLER_TIMEOUT}s to respond."}
    except requests.exceptions.ConnectionError:
        logger.error(f"Connection error crawling {url}")
        return {"error": f"Connection Error: Could not connect to {url}. Please check the URL."}
    except Exception as e:
        logger.error(f"Error crawling {url}: {e}")
        return {"error": f"Crawl Error: {str(e)}"}


def _get_meta(soup: BeautifulSoup, name: str) -> str | None:
    """Get meta tag content by name."""
    tag = soup.find("meta", attrs={"name": name})
    if not tag:
        tag = soup.find("meta", attrs={"property": name})
    return tag.get("content", "").strip() if tag else None

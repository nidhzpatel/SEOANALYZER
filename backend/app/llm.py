"""Ollama LLM client — provides access to local Mistral model via Ollama."""

import json
import logging
from typing import Optional

from langchain_ollama import ChatOllama
from langchain_core.messages import HumanMessage, SystemMessage

from app.config import settings

logger = logging.getLogger(__name__)

# Lazy-initialized LLM instance
_llm: Optional[ChatOllama] = None


def get_llm() -> ChatOllama:
    """Get or create the Ollama LLM client (singleton)."""
    global _llm
    if _llm is None:
        _llm = ChatOllama(
            model=settings.OLLAMA_MODEL,
            base_url=settings.OLLAMA_BASE_URL,
            temperature=0.3,
            num_predict=2048,
        )
        logger.info(f"Initialized Ollama LLM: model={settings.OLLAMA_MODEL}, base_url={settings.OLLAMA_BASE_URL}")
    return _llm


def invoke_llm(system_prompt: str, user_prompt: str) -> str:
    """Invoke the LLM with a system and user prompt.

    Returns the text content of the LLM response.
    Falls back gracefully if Ollama is unavailable.
    """
    try:
        llm = get_llm()
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ]
        response = llm.invoke(messages)
        return response.content
    except Exception as e:
        logger.error(f"LLM invocation failed: {e}")
        raise


def invoke_llm_json(system_prompt: str, user_prompt: str) -> dict:
    """Invoke the LLM and parse the response as JSON.

    The system prompt should instruct the LLM to output valid JSON.
    Falls back to empty dict on parse failure.
    """
    raw = invoke_llm(system_prompt, user_prompt)

    # Try to extract JSON from the response
    try:
        # Look for JSON block in markdown code fences
        if "```json" in raw:
            json_str = raw.split("```json")[1].split("```")[0].strip()
        elif "```" in raw:
            json_str = raw.split("```")[1].split("```")[0].strip()
        else:
            json_str = raw.strip()

        return json.loads(json_str)
    except (json.JSONDecodeError, IndexError) as e:
        logger.warning(f"Failed to parse LLM JSON response: {e}")
        logger.debug(f"Raw LLM response: {raw[:500]}")
        return {"raw_response": raw}

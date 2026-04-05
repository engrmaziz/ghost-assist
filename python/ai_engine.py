"""ai_engine.py — AI answer generation via the Groq API.

Sends a transcribed question to Groq's LLaMA 3.3 70B model and returns a
concise, interview-ready answer. The GROQ_API_KEY must be present in the
process environment (passed by Electron when it spawns the sidecar).
"""

import os

from groq import Groq

# ---------------------------------------------------------------------------
# Groq client — instantiated once at module level.
# The SDK reads GROQ_API_KEY from the environment automatically when no key
# is supplied to the constructor; we pass it explicitly for clarity.
# ---------------------------------------------------------------------------
_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# The model used for all completions
_MODEL = "llama-3.3-70b-versatile"

# Minimum word count for a question to be worth sending to the API.
MIN_QUESTION_WORDS = 3

# System prompt that frames the assistant's persona for every conversation
_SYSTEM_PROMPT = (
    "You are a Senior Staff AI Engineer. Your answers must be deeply technical, "
    "authoritative, and use industry-standard terminology (e.g., CAP theorem, "
    "latency vs throughput, vector embeddings, horizontal scaling). "
    "Be direct and provide specific architectural or algorithmic trade-offs. "
    "Answer the exact question in the transcript strictly. "
    "Length: 3-5 concise, high-impact sentences. No bullet points."
)


def get_answer(question: str) -> str:
    """Generate a concise interview answer for the given question.

    Parameters
    ----------
    question : str
        The transcribed interview question or statement from the candidate's
        microphone.

    Returns
    -------
    str
        A 3-5 sentence answer string, an empty string when the input is too
        short to act on, or "Error generating answer." if the API call fails.
    """
    # Ignore empty or very short inputs — likely noise or incomplete phrases
    if not question or len(question.split()) < MIN_QUESTION_WORDS:
        return ""

    try:
        response = _client.chat.completions.create(
            model=_MODEL,
            messages=[
                {"role": "system", "content": _SYSTEM_PROMPT},
                {"role": "user", "content": question},
            ],
            max_tokens=1000,
            temperature=0.4,
        )
        # Extract the assistant's reply text from the first choice
        return response.choices[0].message.content.strip()
    except Exception:
        return "Error generating answer."

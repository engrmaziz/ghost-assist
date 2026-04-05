"""transcriber.py — Speech-to-text using faster-whisper.

Loads the Whisper "base" model once at import time (singleton pattern) so
every call to transcribe() reuses the same in-memory model without paying
the load cost repeatedly.
"""

import numpy as np
from faster_whisper import WhisperModel

# ---------------------------------------------------------------------------
# Singleton model — loaded once when this module is first imported.
# Using CPU + int8 quantisation keeps RAM usage low on developer machines
# while still delivering accurate English transcriptions.
# ---------------------------------------------------------------------------
_model = WhisperModel("base", device="cpu", compute_type="int8")

# Minimum word count required before a transcript is considered usable.
# Results shorter than this are treated as noise / silence artefacts.
MIN_TRANSCRIPT_WORDS = 4


def transcribe(audio_np: np.ndarray) -> str:
    """Transcribe a float32 audio array to an English text string.

    Parameters
    ----------
    audio_np : np.ndarray
        A 1-D float32 numpy array of PCM audio sampled at 16 kHz (the output
        of audio_capture.capture_chunk).

    Returns
    -------
    str
        The transcribed text, or an empty string if the result is blank or
        contains fewer than 4 words (noise / silence guard).
    """
    # faster-whisper accepts a float32 numpy array directly; no conversion
    # to WAV bytes is required.
    segments, _info = _model.transcribe(
        audio_np,
        beam_size=5,
        language="en",
    )

    # Concatenate all segment texts into a single string
    text = " ".join(segment.text.strip() for segment in segments).strip()

    # Discard very short results that are likely noise or silence artefacts
    if len(text.split()) < MIN_TRANSCRIPT_WORDS:
        return ""

    return text

"""audio_capture.py — Microphone audio capture via sounddevice.

Captures real-time audio from a specific input device (VB-CABLE) 
at 16 kHz mono float32, which is the format faster-whisper expects.
"""

import numpy as np
import sounddevice as sd


# Audio parameters
SAMPLE_RATE = 16000   # Hz
CHANNELS = 1          # mono
DTYPE = "float32"     # 32-bit float

# Based on your sounddevice list: ID 2 is CABLE Output (VB-Audio Virtual)
DEVICE_ID = 2


def list_devices():
    """Print all available audio input devices to stdout."""
    print(sd.query_devices())


def capture_chunk(duration: int = 5) -> np.ndarray:
    """Record a single chunk of audio from the Virtual Cable.

    Parameters
    ----------
    duration : int
        Length of the recording in seconds (synced with sidecar.py).

    Returns
    -------
    np.ndarray
        A 1-D float32 numpy array of PCM samples.
    """
    # We specify device=DEVICE_ID to force it to listen to the Virtual Cable
    audio = sd.rec(
        int(duration * SAMPLE_RATE),
        samplerate=SAMPLE_RATE,
        channels=CHANNELS,
        dtype=DTYPE,
        blocking=True,
        device=DEVICE_ID  # <--- CRITICAL: Listens ONLY to the Virtual Cable
    )
    return audio.squeeze()
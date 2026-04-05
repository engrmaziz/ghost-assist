"""sidecar.py — Main entry point for the Python audio + AI backend.

This process is spawned by Electron's main process via Node's child_process
module. All communication back to Electron happens exclusively through
STDOUT as newline-delimited JSON objects (JSON-lines / NDJSON protocol).

Message schema:
  {"type": "status",     "data": "Listening..."}
  {"type": "transcript", "data": "What is your experience with React?"}
  {"type": "answer",     "data": "I have 3 years of experience..."}
  {"type": "error",      "data": "Groq API failed"}

No Flask. No HTTP. Pure stdout IPC.
"""

import json
import sys
import threading

from ai_engine import get_answer
from audio_capture import capture_chunk
from transcriber import transcribe


def emit(msg_type: str, data: str) -> None:
    """Write a single JSON-lines message to stdout and flush immediately.

    Flushing after every write is critical: without it, Python's internal
    buffer may hold the output for several seconds before Electron sees it.

    Parameters
    ----------
    msg_type : str
        One of "status", "transcript", "answer", or "error".
    data : str
        The payload string associated with the message type.
    """
    print(json.dumps({"type": msg_type, "data": data}), flush=True)
    sys.stdout.flush()  # belt-and-suspenders: guarantee the line is sent


def run_loop() -> None:
    """Optimized loop for faster response times and expert-level buffering."""
    
    transcript_buffer = []
    silence_counter = 0
    # Reduced to 1: Trigger AI immediately after the first 3-second silent window
    SILENCE_THRESHOLD = 1 

    while True:
        try:
            emit("status", "Listening...")

            # Reduced duration to 3 seconds for snappier feedback
            audio_chunk = capture_chunk(duration=3)

            # Transcribe the audio
            transcript = transcribe(audio_chunk)

            if transcript and len(transcript.strip()) > 0:
                emit("transcript", transcript)
                transcript_buffer.append(transcript)
                silence_counter = 0
            else:
                if transcript_buffer:
                    silence_counter += 1

            # Trigger logic
            if silence_counter >= SILENCE_THRESHOLD and transcript_buffer:
                full_question = " ".join(transcript_buffer).strip()
                
                emit("status", "Thinking...")

                # get_answer now uses the 'Senior Staff Engineer' prompt
                answer = get_answer(full_question)
                
                if answer:
                    emit("answer", answer)
                
                # Clear for next round
                transcript_buffer = []
                silence_counter = 0

        except Exception as exc:
            emit("error", str(exc))


def main() -> None:
    """Launch the capture/transcribe/answer loop in a daemon thread.

    Running the loop in a separate thread allows the main thread to remain
    responsive to KeyboardInterrupt (Ctrl+C), enabling a clean shutdown
    without leaving zombie audio streams open.
    """
    worker = threading.Thread(target=run_loop, daemon=True)
    worker.start()

    try:
        # Block the main thread until the worker finishes (it never will
        # unless an unhandled exception escapes) or until Ctrl+C arrives.
        worker.join()
    except KeyboardInterrupt:
        # Electron sends SIGTERM / closes stdin to stop the sidecar;
        # a KeyboardInterrupt during development also lands here.
        emit("status", "Shutting down...")
        sys.exit(0)


if __name__ == "__main__":
    main()
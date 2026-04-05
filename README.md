# 👻 GhostAssist

> **The invisible AI co-pilot that answers interview questions in real time — without ever appearing on screen.**

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-41.x-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python-3.8%2B-3776AB?style=flat-square&logo=python&logoColor=white)](https://www.python.org/)
[![Groq](https://img.shields.io/badge/Groq-Llama%203.3%2070B-F55036?style=flat-square)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## 🚀 Overview

**GhostAssist** is a desktop application that sits invisibly over your screen during job interviews and provides real-time, expert-level AI answers — completely hidden from screen capture tools like Zoom, Microsoft Teams, and Google Meet.

It works by:
1. Capturing audio from a virtual cable device (the interviewer's voice)
2. Transcribing speech to text using Faster-Whisper (OpenAI's Whisper, CPU-optimized)
3. Sending the transcribed question to the Groq API (Llama 3.3 70B) for an expert answer
4. Displaying the answer in a hacker-aesthetic overlay that **never appears in screen recordings**

> ⚠️ **Disclaimer:** GhostAssist is an educational and research project. Use responsibly and in compliance with the rules of any platform or employer you interact with.

---

## 🎓 Educational Purpose

> **This software was created solely for educational and learning purposes.**
>
> I built GhostAssist to explore and learn about:
> - Electron desktop app development
> - Real-time speech-to-text with Faster-Whisper
> - AI inference via the Groq API
> - Cross-process IPC communication between Node.js and Python
> - Screen overlay techniques using Electron's content protection API
>
> **⛔ Do NOT misuse this software.** Using GhostAssist to cheat in job interviews, assessments, or any evaluations is unethical and may violate the terms of service of the platforms you use, as well as your employer's or institution's code of conduct. The author takes no responsibility for any misuse of this project.

---

## ✨ Features

- 🎭 **Invisible to screen capture** — uses Electron's `setContentProtection` to hide the overlay from Zoom, Teams, Meet, and OBS
- ⚡ **Real-time AI answers** — Groq API delivers expert-level Llama 3.3 70B responses in under a second
- 🎙️ **Live speech-to-text** — Faster-Whisper transcribes audio with accuracy comparable to OpenAI Whisper
- 🔐 **Secure API key storage** — your Groq API key is stored encrypted locally via Electron Store, never in plain text
- 📌 **Always-on-top overlay** — the floating window stays above every application and is togglable
- 🚨 **Panic button (Alt+X)** — instantly hides the window and clears all text in one keystroke
- 📜 **Session history** — scrollable conversation history within your active session
- 🎨 **Retro hacker UI** — green-on-black monospace aesthetic with typewriter reveal effect and animated cursor
- 🖱️ **Draggable frameless window** — place the overlay anywhere on your screen

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev/) | 18.3.1 | Component-based UI |
| [Vite](https://vitejs.dev/) | 6.0.5 | Fast build tool & dev server |
| [Electron](https://www.electronjs.org/) | 41.1.1 | Cross-platform desktop shell |
| [Electron Store](https://github.com/sindresorhus/electron-store) | 10.0.0 | Secure local config/key storage |

### Backend (Python Sidecar)
| Technology | Version | Purpose |
|---|---|---|
| [Faster-Whisper](https://github.com/SYSTRAN/faster-whisper) | 1.0.3 | Speech-to-text (Whisper base model, int8, CPU) |
| [Groq SDK](https://groq.com/) | 0.9.0 | Llama 3.3 70B inference API |
| [sounddevice](https://python-sounddevice.readthedocs.io/) | 0.4.6 | Microphone/virtual cable audio capture |
| [PyAudio](https://people.csail.mit.edu/hubert/pyaudio/) | 0.2.14 | Audio device management |
| [NumPy](https://numpy.org/) | 1.26.4 | Audio buffer processing |

### Build & Dev Tools
| Tool | Purpose |
|---|---|
| [Electron Builder](https://www.electron.build/) | Packages the app into a Windows NSIS installer |
| [Concurrently](https://github.com/open-cli-tools/concurrently) | Runs Vite + Electron in parallel during dev |
| [wait-on](https://github.com/jeffbski/wait-on) | Waits for Vite dev server before launching Electron |

---

## 📦 Installation

### Prerequisites

Before you begin, make sure you have the following installed:

- **[Node.js](https://nodejs.org/) 18+** (includes npm)
- **[Python 3.8+](https://www.python.org/downloads/)** (with pip)
- **[VB-CABLE Virtual Audio Device](https://vb-audio.com/Cable/)** — routes the interviewer's audio to GhostAssist without feedback loops
- **[Groq API Key](https://console.groq.com)** — free tier available; used to power Llama 3.3 70B responses

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/engrmaziz/ghost-assist.git
cd ghost-assist

# 2. Install Node.js dependencies
npm install

# 3. Set up the Python virtual environment
cd python
python -m venv venv

# Activate on macOS/Linux:
source venv/bin/activate

# Activate on Windows:
venv\Scripts\activate

# 4. Install Python dependencies
pip install -r requirements.txt

# 5. Return to the project root
cd ..
```

---

## ▶️ Usage

### Development Mode

```bash
npm run dev
```

This command:
1. Starts the Vite React dev server on `http://localhost:5173`
2. Waits for the dev server to be ready
3. Launches the Electron window pointing at the local dev server
4. On first run, prompts you to enter your Groq API key — this is saved securely and never re-asked

### Production Build

```bash
npm run build
```

Outputs:
- `dist/` — compiled React app
- `release/` — packaged Electron installer (`GhostAssist Setup.exe` for Windows)

### Starting the Packaged App

```bash
npm start
```

### Global Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Alt + X` | **Panic button** — hides the window and clears all text instantly |
| `Ctrl + Shift + Q` | Quit the application completely |

---

## 📸 Screenshots / Demo

> *Screenshots and a recorded demo will be added here. The overlay is invisible to screen-recording software by design.*

```
┌─────────────────────────────────┐
│  👻 GhostAssist          📌 ✕  │
├─────────────────────────────────┤
│  ● Listening...                 │
├─────────────────────────────────┤
│  HEARD                          │
│  "Tell me about a time you      │
│   led a difficult project..."   │
├─────────────────────────────────┤
│  ANSWER                         │
│  In my previous role I led a    │
│  cross-functional team to       │
│  migrate our monolith to a      │
│  microservices architecture...█ │
└─────────────────────────────────┘
```

---

## ⚙️ Configuration

### Groq API Key

GhostAssist stores your API key securely using Electron Store (encrypted, local only). You will be prompted to enter it on first launch. It is never written to a plain `.env` file.

To get a free API key: [https://console.groq.com](https://console.groq.com)

### Audio Device

GhostAssist defaults to **VB-CABLE Output** (device ID `2`). If your system has a different device ID, update the following in `python/audio_capture.py`:

```python
DEVICE_ID = 2  # Change to your VB-CABLE Output device index
```

To find your device index, run:

```python
import sounddevice as sd
print(sd.query_devices())
```

### Python Sidecar Settings

**`python/audio_capture.py`**
```python
SAMPLE_RATE = 16000   # Hz — required by Whisper
CHANNELS = 1          # Mono
DTYPE = "float32"     # Whisper input format
DEVICE_ID = 2         # VB-CABLE Output device index
```

**`python/transcriber.py`**
```python
# Whisper model: "tiny", "base", "small", "medium", "large"
_model = WhisperModel("base", device="cpu", compute_type="int8")
MIN_TRANSCRIPT_WORDS = 4  # Ignore transcriptions shorter than this
```

**`python/ai_engine.py`**
```python
_MODEL = "llama-3.3-70b-versatile"  # Groq model ID
MIN_QUESTION_WORDS = 3              # Ignore very short inputs
```

**`python/sidecar.py`**
```python
SILENCE_THRESHOLD = 1  # Number of silent 3-second chunks before triggering AI
```

**`electron/main.js`** (window settings)
```javascript
width: 480,              // Overlay width in pixels
height: 600,             // Overlay height in pixels
transparent: true,       // Transparent background
alwaysOnTop: true,       // Stays above other windows
skipTaskbar: true,       // Hidden from taskbar
setContentProtection: true  // Invisible in screen recordings
```

---

## 🧠 How It Works

GhostAssist uses a **three-process architecture**:

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GHOST ASSIST SYSTEM                          │
│                                                                     │
│  🎤 VB-CABLE (Virtual Audio)                                        │
│       │                                                             │
│       ▼                                                             │
│  ┌─────────────────────────────────────────────────┐               │
│  │           PYTHON SIDECAR (subprocess)           │               │
│  │                                                 │               │
│  │  audio_capture.py → transcriber.py → ai_engine │               │
│  │  (sounddevice)      (Faster-Whisper)  (Groq)   │               │
│  │                          │                      │               │
│  │         JSON-Lines emitted to stdout            │               │
│  └──────────────────────────┼──────────────────────┘               │
│                             │                                       │
│       ┌─────────────────────▼───────────────────────┐              │
│       │         ELECTRON MAIN PROCESS               │              │
│       │                                             │              │
│       │  main.js parses JSON-Lines from Python      │              │
│       │  ipc-handlers.js routes events to renderer │              │
│       └─────────────────────┬───────────────────────┘              │
│                             │  IPC (preload.cjs bridge)            │
│       ┌─────────────────────▼───────────────────────┐              │
│       │      ELECTRON RENDERER (React + Vite)       │              │
│       │                                             │              │
│       │  App.jsx manages state + typewriter FX      │              │
│       │  Overlay renders transcript + answer        │              │
│       │  Never visible in screen recordings ✓       │              │
│       └─────────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Flow

1. **Audio Capture** — `audio_capture.py` records 3-second mono audio chunks at 16 kHz from the VB-CABLE Output device
2. **Transcription** — `transcriber.py` passes each chunk through Faster-Whisper (base model, int8 quantization on CPU) to produce text
3. **Silence Detection** — `sidecar.py` buffers transcripts and waits for a silent chunk before firing the AI request (avoids sending incomplete questions)
4. **AI Answering** — `ai_engine.py` sends the buffered transcript to Groq's Llama 3.3 70B with a "Senior Staff AI Engineer" system prompt
5. **IPC Streaming** — the answer is emitted as a JSON-Line to `stdout`, parsed by `electron/main.js`, and forwarded to the React renderer via IPC
6. **Display** — React renders the answer with a typewriter animation; the overlay remains invisible to screen-recording tools via `setContentProtection`

---

## 📁 Project Structure

```
ghost-assist/
├── electron/                    # Electron main process
│   ├── main.js                  # App entry point; spawns Python sidecar, manages window & IPC
│   ├── ipc-handlers.js          # Registers IPC handlers (renderer ↔ main communication)
│   └── preload.cjs              # Security bridge; exposes safe window.electron API
│
├── python/                      # Python AI & audio backend (sidecar process)
│   ├── sidecar.py               # Main loop: audio → transcribe → AI → JSON-lines stdout
│   ├── ai_engine.py             # Groq API client (Llama 3.3 70B)
│   ├── transcriber.py           # Faster-Whisper speech-to-text wrapper
│   ├── audio_capture.py         # sounddevice microphone/virtual cable capture
│   └── requirements.txt         # Python dependencies
│
├── src/                         # React frontend source
│   ├── App.jsx                  # Root component; state, IPC listeners, typewriter logic
│   ├── App.css                  # Global styles, animations (scanline, pulse, blink)
│   ├── main.jsx                 # React DOM entry point
│   └── components/
│       ├── TitleBar.jsx         # Draggable title bar with pin & close controls
│       ├── StatusBar.jsx        # Animated status indicator (Listening / Thinking)
│       ├── Overlay.jsx          # Main overlay container + scrollable history
│       ├── TranscriptPanel.jsx  # "HEARD" section (transcribed speech)
│       └── AnswerPanel.jsx      # "ANSWER" section (AI response + typewriter cursor)
│
├── index.html                   # HTML shell for Vite/Electron
├── vite.config.js               # Vite configuration (React plugin, base: './')
├── package.json                 # Node dependencies, scripts, Electron Builder config
└── .gitignore                   # Excludes node_modules, dist, release, venv, config.json
```

---

## 🧪 Testing

There is currently no automated test suite. Manual testing is required:

| Test Area | How to Verify |
|---|---|
| Audio capture | Speak into VB-CABLE input; confirm transcript appears in the overlay |
| Transcription quality | Compare spoken words to displayed transcript |
| AI response | Ask a technical interview question; verify the answer is coherent |
| Screen recording invisibility | Record your screen with OBS or Zoom and confirm the overlay does not appear |
| Panic button | Press `Alt+X`; verify the window hides and text clears |
| Always-on-top | Toggle the pin button; verify the overlay moves above/below other windows |
| API key persistence | Restart the app; verify you are not prompted for the key again |

---

## 🚀 Deployment

### Windows (NSIS Installer)

```bash
npm run build
```

The installer will be at `release/GhostAssist Setup.exe`. Distribute this file to end users — no additional Node.js or Python installation required (when packaging the Python sidecar as a bundled executable via PyInstaller).

### Packaging the Python Sidecar (Optional)

To avoid requiring Python on the end-user's machine, you can freeze the sidecar:

```bash
cd python
pip install pyinstaller
pyinstaller --onefile sidecar.py
```

Then update `electron/main.js` to reference the compiled `sidecar.exe` from the app's resources directory.

### macOS / Linux

The project is configured for Windows (NSIS) builds. For macOS or Linux:

1. Update `electron-builder` config in `package.json` to target `dmg` or `AppImage`
2. Update `setContentProtection` call — verify it works on your platform
3. Adjust the VB-CABLE device index for your audio setup

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository and create your feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**, following the existing code style:
   - React components in `src/components/`
   - Python modules in `python/`
   - Electron process code in `electron/`

3. **Test your changes** manually (see the [Testing](#-testing) section)

4. **Commit** with a clear, descriptive message:
   ```bash
   git commit -m "feat: add support for multiple audio devices"
   ```

5. **Push** and open a Pull Request:
   ```bash
   git push origin feature/your-feature-name
   ```

### Contribution Ideas

- [ ] Add automated tests (Vitest for React, pytest for Python)
- [ ] Support multiple Groq model options (selectable in UI)
- [ ] Dynamic VB-CABLE device selection from the UI
- [ ] macOS and Linux support
- [ ] PyInstaller bundling for zero-dependency distribution
- [ ] Support for streaming AI responses (token-by-token typewriter)
- [ ] Internationalization / multiple languages

### Code Style

- **JavaScript/JSX**: Follow the existing Vite + React conventions; functional components and hooks only
- **Python**: Follow PEP 8; use docstrings for all functions and classes
- **Commits**: Use [Conventional Commits](https://www.conventionalcommits.org/) format (`feat:`, `fix:`, `docs:`, `chore:`)

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Musharraf Aziz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 📬 Contact

**Author:** Musharraf Aziz

- 🐙 **GitHub:** [@engrmaziz](https://github.com/engrmaziz)
- 📧 **Email:** *Available on GitHub profile*
- 💼 **LinkedIn:** *Add your LinkedIn URL here*

---

<div align="center">

**Built with ❤️ by [Musharraf Aziz](https://github.com/engrmaziz)**

*If GhostAssist helped you land your dream job, give it a ⭐ on GitHub!*

</div>

// Electron main process entry point
import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { registerIpcHandlers } from './ipc-handlers.js';
import Store from 'electron-store'; // NEW: Secure local storage

// __dirname is not available in ESM; reconstruct it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect whether we are running in development mode
const isDev = !app.isPackaged;

let win;              // reference kept so shortcuts can toggle visibility
let pythonProcess = null; // reference to the spawned Python sidecar child process
const store = new Store(); // Initialize the secure storage

// --- Python sidecar: spawn with executable fallback ---
/**
 * Attempt to spawn the Python sidecar using the given executable.
 * If the executable is not found (ENOENT) and we tried 'python3',
 * we automatically retry with 'python'.
 *
 * @param {string} executable  - 'python3', 'python', or path to sidecar.exe
 * @param {string|null} sidecarPath - absolute path to sidecar.py (null in production)
 */
function spawnPython(executable, sidecarPath) {
  const savedKey = store.get('GROQ_API_KEY'); // Securely load the key from storage
  
  // If we are in dev, we pass the path to the .py script as an argument.
  // If we are in production, the executable IS the app, so no arguments needed.
  const args = sidecarPath ? [sidecarPath] : [];

  pythonProcess = spawn(executable, args, {
    env: { ...process.env, GROQ_API_KEY: savedKey },
    stdio: ['pipe', 'pipe', 'pipe']
  });

  // --- Handle Python stdout ---
  // Incoming data may contain multiple newline-delimited JSON messages.
  pythonProcess.stdout.on('data', (data) => {
    const lines = data.toString().split('\n');
    for (const line of lines) {
      if (!line.trim()) continue; // skip blank lines between messages
      try {
        const parsed = JSON.parse(line);
        // Route each message type to the appropriate renderer channel
        switch (parsed.type) {
          case 'transcript':
            win.webContents.send('transcript', parsed.data);
            break;
          case 'answer':
            win.webContents.send('answer', parsed.data);
            break;
          case 'status':
            win.webContents.send('status', parsed.data);
            break;
          case 'error':
            console.error('[Python Error]', parsed.data);
            break;
        }
      } catch (_) {
        // Log malformed / non-JSON lines to aid debugging without crashing
        console.warn('[Python] malformed stdout line:', line);
      }
    }
  });

  // --- Handle Python stderr ---
  // Pipe Python's stderr to the Electron console for debugging.
  pythonProcess.stderr.on('data', (data) => {
    console.error('[Python STDERR]', data.toString());
  });

  // --- Handle Python process exit ---
  pythonProcess.on('close', (code) => {
    console.log('[Python] process exited with code', code);
    // Notify the renderer so the user knows the sidecar is no longer running.
    if (win && !win.isDestroyed()) {
      win.webContents.send('status', 'Sidecar stopped. Restart app.');
    }
  });

  // --- Handle spawn errors (e.g., executable not found) ---
  pythonProcess.on('error', (err) => {
    if (err.code === 'ENOENT' && executable === 'python3' && isDev) {
      // python3 not on PATH – fall back to plain 'python' (one retry only)
      console.log('[Python] python3 not found, falling back to python');
      spawnPython('python', sidecarPath);
    } else {
      console.error('[Python] spawn error:', err.message);
    }
  });
}

/**
 * Resolve the sidecar path for the current environment and kick off the
 * Python process.  Called once the BrowserWindow is ready.
 */
/**
 * Resolve the sidecar path for the current environment and kick off the
 * Python process.  Called once the BrowserWindow is ready.
 */
function startPythonSidecar() {
  if (isDev) {
    // In dev, the source tree is used directly
    const sidecarPath = path.join(__dirname, '../python/sidecar.py');
    spawnPython('python3', sidecarPath); // or 'python' depending on your system
  } else {
    // In production, the .exe is placed directly in the resources folder via extraResources
    const sidecarExePath = path.join(process.resourcesPath, 'sidecar.exe');
    spawnPython(sidecarExePath, null);
  }
}

function createWindow() {
  win = new BrowserWindow({
    width: 480,
    height: 600,
    transparent: true,       // allow CSS transparency to show through
    frame: false,            // remove the native OS window chrome
    alwaysOnTop: true,       // float above all other application windows
    skipTaskbar: true,       // hide from the taskbar / dock
    resizable: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,  // isolate renderer from Node context (security)
      nodeIntegration: false   // never expose Node APIs directly to renderer
    }
  });

  // Makes the window invisible to screen-capture tools (Zoom, Teams, Meet, etc.)
  win.setContentProtection(true);

   // Register IPC handlers so the renderer can communicate with main
  registerIpcHandlers(win);

  // --- NEW: API Key IPC Handlers ---
  ipcMain.handle('get-api-key', () => {
    return store.get('GROQ_API_KEY') || null;
  });

  ipcMain.handle('save-api-key', (event, key) => {
    store.set('GROQ_API_KEY', key);
    startPythonSidecar(); // Start Python ONLY after the key is saved!
    return true;
  });

  // --- Window drag support (frameless window) ---
  ipcMain.on('start-drag', () => win.setMovable(true));

  // --- Toggle always-on-top via IPC ---
  ipcMain.on('toggle-pin', () => {
    const current = win.isAlwaysOnTop();
    win.setAlwaysOnTop(!current);
    win.webContents.send('pin-status', !current);
  });

  // --- Start up logic ---
  // Check if we have an API key saved. If we do, start the Python engine.
  // If we don't, do nothing. The React app will render the setup screen.
  if (store.get('GROQ_API_KEY')) {
    startPythonSidecar();
  }

  if (isDev) {
    // In dev mode Vite is already serving on port 5173
    win.loadURL('http://localhost:5173');
  } else {
    // In production load the compiled index.html relative to this file
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Register Alt+X as the Panic Button (Hide Window & Clear Text)
  globalShortcut.register('Alt+X', () => {
    if (win.isVisible()) {
      win.hide();
      // Send a signal to the React app to wipe the transcript and answer
      win.webContents.send('clear-text'); 
    } else {
      win.show();
      win.focus();
    }
  });

  // Keep Ctrl+Shift+Q to quit the application entirely
  globalShortcut.register('CommandOrControl+Shift+Q', () => {
    app.quit();
  });
}

// Create the window once Electron has finished initialising
app.whenReady().then(() => {
  createWindow();

  // On macOS it is common to re-create a window when the dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit on all windows closed, except on macOS where apps stay active
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Unregister all shortcuts when the app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// --- Cleanup on app quit ---
// Kill the Python sidecar so it does not linger as an orphan process.
app.on('before-quit', () => {
  if (pythonProcess) pythonProcess.kill();
});
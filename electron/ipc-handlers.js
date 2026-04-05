// IPC handler registration – keeps main.js clean by centralising all
// inter-process-communication logic in one place.
import { ipcMain } from 'electron';

/**
 * Register all ipcMain listeners that the renderer may trigger.
 * @param {import('electron').BrowserWindow} mainWindow - the main app window
 */
export function registerIpcHandlers(mainWindow) {
  // Renderer signals that it has finished loading and is ready to receive data
  ipcMain.on('renderer-ready', (_event) => {
    console.log('[IPC] renderer-ready received');
  });
}

/**
 * Safely send a message to the renderer process.
 * Guards against sending to a destroyed or unresponsive window.
 *
 * @param {import('electron').BrowserWindow} mainWindow - the target window
 * @param {string} channel - IPC channel name (e.g. 'answer', 'transcript')
 * @param {*} data - payload to forward to the renderer
 */
export function sendToRenderer(mainWindow, channel, data) {
  // Only send if the window still exists and its webContents have not been destroyed
  if (mainWindow && !mainWindow.isDestroyed() && mainWindow.webContents) {
    mainWindow.webContents.send(channel, data);
  }
}

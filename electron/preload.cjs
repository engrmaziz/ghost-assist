const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  onAnswer: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('answer', handler);
    return () => ipcRenderer.removeListener('answer', handler);
  },
  onTranscript: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('transcript', handler);
    return () => ipcRenderer.removeListener('transcript', handler);
  },
  onStatus: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('status', handler);
    return () => ipcRenderer.removeListener('status', handler);
  },
  onPinStatus: (callback) => {
    const handler = (_event, data) => callback(data);
    ipcRenderer.on('pin-status', handler);
    return () => ipcRenderer.removeListener('pin-status', handler);
  },
  // Listener for the Panic Button / Clear Text signal
  onClearText: (callback) => {
    const handler = () => callback(); // No data payload needed, just a trigger
    ipcRenderer.on('clear-text', handler);
    return () => ipcRenderer.removeListener('clear-text', handler);
  },
  
  // NEW: API Key management for secure local storage
  getApiKey: () => ipcRenderer.invoke('get-api-key'),
  saveApiKey: (key) => ipcRenderer.invoke('save-api-key', key),
  
  togglePin: () => ipcRenderer.send('toggle-pin'),
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel),
  sendReady: () => {
    ipcRenderer.send('renderer-ready');
  }
});
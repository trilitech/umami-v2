// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});

contextBridge.exposeInMainWorld("electronAPI", {
  onDeeplink: callback => ipcRenderer.on("deeplinkURL", callback),

  // Notify UI if app update is available to be installed.
  onAppUpdateDownloaded: callback => ipcRenderer.on("app-update-downloaded", callback),

  // Notify Electron that app update should be installed.
  installAppUpdateAndQuit: () => ipcRenderer.send("install-app-update"),

  clipboardWriteText: text => ipcRenderer.send("clipboard-write", text),
  clipboardClear: () => ipcRenderer.send("clipboard-clear"),

  getBackupData: () => ipcRenderer.invoke("getBackupData"),
});

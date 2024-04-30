const { contextBridge, ipcRenderer } = require("electron/renderer");

contextBridge.exposeInMainWorld("electronAPI", {
	onButtonUpdate: (callback) =>
		ipcRenderer.on("button-update", (_event, value) => callback(value)),
});

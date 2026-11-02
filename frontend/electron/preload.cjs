const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
	hasCredentials: () => ipcRenderer.invoke("has-credentials"),
	saveCredentials: (credentials) =>
		ipcRenderer.invoke("save-credentials", credentials),
});

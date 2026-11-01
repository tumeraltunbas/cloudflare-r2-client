import { app, BrowserWindow } from "electron";

const webBaseUrl = "http://localhost:5173";

function createWindow() {
	const window = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	window.loadURL(webBaseUrl);
	window.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

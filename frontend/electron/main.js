import {
	BrowserWindow,
	app,
	ipcMain,
	safeStorage,
	utilityProcess,
} from "electron";
import path from "path";
import fs from "fs";
import net from "net";

const IS_DEVELOPMENT = !app.isPackaged;
const BASE_URL = "http://localhost:4173";
const BACKEND_PORT = 3000;
const BACKEND_START_TIMEOUT_MS = 15000;
const BACKEND_POLL_INTERVAL_MS = 100;
const WINDOW_SIZE = {
	width: 1200,
	height: 800,
};
const CREDENTIALS_FILE_NAME = "credentials.bin";
const CREDENTIALS_PATH = path.join(
	app.getPath("userData"),
	CREDENTIALS_FILE_NAME
);

const createWindow = () => {
	const window = new BrowserWindow({
		width: WINDOW_SIZE.width,
		height: WINDOW_SIZE.height,
		icon: path.join(app.getAppPath(), "..", "public", "cloudflare.webp"),
		webPreferences: {
			preload: path.join(app.getAppPath(), "electron", "preload.cjs"),
			nodeIntegration: false,
			contextIsolation: true,
		},
	});

	if (IS_DEVELOPMENT) {
		window.loadURL(BASE_URL);
	} else {
		const filePath = path.join(app.getAppPath(), "dist", "index.html");
		window.loadFile(filePath);
	}

	window.setMenuBarVisibility(false);
};

ipcMain.handle("save-credentials", async (event, credentials) => {
	const encryptedCredentials = await safeStorage.encryptStringAsync(
		JSON.stringify(credentials)
	);

	fs.writeFileSync(CREDENTIALS_PATH, encryptedCredentials);

	// The renderer starts fetching buckets as soon as this handler resolves, so
	// wait for the backend to accept connections before replying. Otherwise the
	// first request races the backend's startup and fails.
	await startBackend(credentials);

	return true;
});

ipcMain.handle("has-credentials", () => fs.existsSync(CREDENTIALS_PATH));

async function readCredentials() {
	if (!fs.existsSync(CREDENTIALS_PATH)) {
		return null;
	}

	try {
		const decryptedCredentials = await safeStorage.decryptStringAsync(
			fs.readFileSync(CREDENTIALS_PATH)
		);

		return JSON.parse(decryptedCredentials.result);
	} catch {
		return null;
	}
}

let backend;

function waitForBackend(port) {
	return new Promise((resolve, reject) => {
		const deadline = Date.now() + BACKEND_START_TIMEOUT_MS;

		const attempt = () => {
			const socket = net.connect({ port, host: "127.0.0.1" });

			socket.once("connect", () => {
				socket.destroy();
				resolve();
			});

			socket.once("error", () => {
				socket.destroy();

				if (Date.now() >= deadline) {
					reject(
						new Error(
							`The backend did not start within ${BACKEND_START_TIMEOUT_MS} ms.`
						)
					);
					return;
				}

				setTimeout(attempt, BACKEND_POLL_INTERVAL_MS);
			});
		};

		attempt();
	});
}

async function startBackend(credentials) {
	backend?.kill();

	const backendPath = app.isPackaged
		? path.join(process.resourcesPath, "backend", "dist", "index.js")
		: path.join(app.getAppPath(), "..", "backend", "dist", "index.js");

	backend = utilityProcess.fork(backendPath, undefined, {
		env: {
			...process.env,
			PORT: String(BACKEND_PORT),
			CLOUDFLARE_ACCOUNT_ID: credentials.accountId,
			CLOUDFLARE_API_TOKEN: credentials.apiKey,
			CLIENT_BASE_URL: BASE_URL,
		},
	});

	backend.on("exit", (code) => {
		backend = undefined;

		if (code !== 0) {
			console.error(`The backend exited with code ${code}.`);
		}
	});

	return waitForBackend(BACKEND_PORT);
}

app.whenReady().then(async () => {
	const credentials = await readCredentials();

	if (credentials) {
		await startBackend(credentials);
	}

	createWindow();

	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("before-quit", () => {
	backend?.kill();
});

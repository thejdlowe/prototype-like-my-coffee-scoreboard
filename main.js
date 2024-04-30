const shutdown = require("electron-shutdown-command");
const usb = require("usb");
const path = require("node:path");
const DEVICE_INFO = {
	vendorId: 1118,
	productId: 672,
	interfaceId: 0,
	endpointId: 0,
};
// const webusb = new usb.WebUSB({
// 	allowAllDevices: true,
// });

const newInitiateIR = async (mainWindow) => {
	const legacyDevice = usb.findByIds(
		DEVICE_INFO.vendorId,
		DEVICE_INFO.productId
	);
	let canAccept = false;
	let lastValue = "";

	if (legacyDevice) {
		legacyDevice.open();

		let legacyInterface = legacyDevice.interfaces[DEVICE_INFO.interfaceId];

		if (legacyInterface.isKernelDriverActive()) {
			legacyInterface.detachKernelDriver();
		}

		const inEndpoint = legacyInterface.endpoints[DEVICE_INFO.endpointId];

		inEndpoint.on("data", (usbEvent) => {
			var dataView = new Uint8Array(usbEvent);
			const whichController = dataView[2];
			const buttonsPressed = dataView[4];
			const altButtonsPressed = dataView[3];
			const startButton = !!(altButtonsPressed & 0x10);
			const backButton = !!(altButtonsPressed & 0x20);
			const XboxButton = !!(buttonsPressed & 0x04);
			const bigButton = !!(buttonsPressed & 0x08);
			const AButton = !!(buttonsPressed & 0x10);
			const BButton = !!(buttonsPressed & 0x20);
			const XButton = !!(buttonsPressed & 0x40);
			const YButton = !!(buttonsPressed & 0x80);
			console.log({
				whichController,
				startButton,
				backButton,
				XboxButton,
				bigButton,
				AButton,
				BButton,
				XButton,
				YButton,
			});
			var decoded =
				dataView[0] +
				":" +
				dataView[1] +
				":" +
				dataView[2] +
				":" +
				dataView[3] +
				":" +
				dataView[4];
			if (lastValue !== decoded) {
				lastValue = decoded;
				if (whichController === 2) {
					if (bigButton) {
						canAccept = true;
						mainWindow.webContents.send("button-update", "ready");
					} else if (AButton) {
						canAccept = true;
						mainWindow.webContents.send("button-update", "0");
					} else if (BButton) {
						canAccept = true;
						mainWindow.webContents.send("button-update", "1");
					} else if (XButton) {
						canAccept = true;
						mainWindow.webContents.send("button-update", "2");
					} else if (YButton) {
						canAccept = true;
						mainWindow.webContents.send("button-update", "3");
					} else if (XboxButton) {
						canAccept = false;
						lastValue = "";
						mainWindow.webContents.send("button-update", "debug");
					} else if (startButton && backButton) {
						canAccept = false;
						lastValue = "";
						mainWindow.webContents.send("button-update", "shutdown");
						shutdown.shutdown({
							force: true,
							timerseconds: 5,
							sudo: true,
							debug: false,
							quitapp: false,
						});
					}
				} else if (canAccept === true) {
					canAccept = false;
					let whatToSend = "broken";
					if (whichController === 0) whatToSend = "P1";
					else if (whichController === 1) whatToSend = "P2";
					else if (whichController === 3) whatToSend = "P3";
					mainWindow.webContents.send("button-update", whatToSend);
				}
			}

			//This works, so if you need to, go back to it
			// if (lastValue !== decoded) {
			// 	if (whichController === 2) {
			// 		canAccept = true;
			// 		mainWindow.webContents.send("button-update", "reset");
			// 		lastValue = decoded;
			// 	} else if (canAccept === true) {
			// 		canAccept = false;
			// 		let whatToSend = "broken";
			// 		if (whichController === 0) whatToSend = "P1";
			// 		else if (whichController === 1) whatToSend = "P2";
			// 		else if (whichController === 3) whatToSend = "P3";
			// 		mainWindow.webContents.send("button-update", whatToSend);
			// 		lastValue = decoded;
			// 	}
			// }
		});

		inEndpoint.on("error", (err) => {
			console.log("Error", err);
		});

		inEndpoint.startPoll();
	}
};

const { app, BrowserWindow } = require("electron/main");

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	});

	mainWindow.loadFile("index.html");
	mainWindow.maximize();

	newInitiateIR(mainWindow);
}

app.whenReady().then(() => {
	createWindow();

	app.on("activate", function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

app.on("window-all-closed", function () {
	if (process.platform !== "darwin") app.quit();
});

const usb = require("usb");
const path = require("node:path");
const DEVICE_INFO = [{ vendorId: 1118, productId: 672, interfaceId: 0 }];
const webusb = new usb.WebUSB({
	allowAllDevices: true,
});
let device;

const newInitiateIR = async (mainWindow) => {
	const legacyDevice = usb.findByIds(1118, 672);
	let canAccept = false;
	let lastValue = "";

	if (legacyDevice) {
		legacyDevice.open();

		let legacyInterface = legacyDevice.interfaces[0];

		if (legacyInterface.isKernelDriverActive()) {
			legacyInterface.detachKernelDriver();
		}

		const inEndpoint = legacyInterface.endpoints[0];

		inEndpoint.on("data", (usbEvent) => {
			var dataView = new Uint8Array(usbEvent);
			const whichController = dataView[2];
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
				if (whichController === 2) {
					canAccept = true;
					mainWindow.webContents.send("button-update", "reset");
					lastValue = decoded;
				} else if (canAccept === true) {
					canAccept = false;
					let whatToSend = "broken";
					if (whichController === 0) whatToSend = "P1";
					else if (whichController === 1) whatToSend = "P2";
					else if (whichController === 3) whatToSend = "P3";
					mainWindow.webContents.send("button-update", whatToSend);
					lastValue = decoded;
				}
			}
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

	//mainWindow.webContents.openDevTools();

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

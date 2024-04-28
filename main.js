const usb = require("usb");
const DEVICE_INFO = [{ vendorId: 1118, productId: 672, interfaceId: 0 }];
const webusb = new usb.WebUSB({
	allowAllDevices: true,
});
let device;

const newInitiateIR = async () => {
	const legacyDevice = usb.findByIds(1118, 672);

	if (legacyDevice) {
		legacyDevice.open();

		let legacyInterface = legacyDevice.interfaces[0];

		if (legacyInterface.isKernelDriverActive()) {
			legacyInterface.detachKernelDriver();
		}

		const inEndpoint = legacyInterface.endpoints[0];

		inEndpoint.on("data", (data) => {
			console.log("Data", data);
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
	});

	mainWindow.loadFile("index.html");

	mainWindow.webContents.openDevTools();

	newInitiateIR();
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

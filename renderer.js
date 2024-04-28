const DEVICE_INFO = [{ vendorId: 1118, productId: 672, interfaceId: 0 }];
let usbConnection = null;

function getDeviceDetails(device) {
	return device.productName || `Unknown device ${device.deviceId}`;
}

async function testIt() {

	// let device;
	// navigator.usb
	// 	.requestDevice({
	// 		filters: DEVICE_INFO,
	// 	})
	// 	.then((selectedDevice) => {
	// 		device = selectedDevice;
	// 		return device.open();
	// 	})
	// 	.then(() => device.selectConfiguration(0))
	// 	.then(() => device.claimInterface(1))
	// 	.then(() => device.releaseInterface(1));
        

	// return;
	const noDevicesFoundMsg = "No devices found";
	const grantedDevices = await navigator.usb.getDevices();
	console.log(grantedDevices);
	let grantedDeviceList = "";
	if (grantedDevices.length > 0) {
		for (const device of grantedDevices) {
			grantedDeviceList += `<hr>${getDeviceDetails(device)}</hr>`;
		}
	} else {
		grantedDeviceList = noDevicesFoundMsg;
	}
	document.getElementById("granted-devices").innerHTML = grantedDeviceList;

	grantedDeviceList = "";
	try {
		const grantedDevice = await navigator.usb.requestDevice({
			filters: [],
		});
		grantedDeviceList += `<hr>${getDeviceDetails(grantedDevice)}</hr>`;
	} catch (ex) {
		if (ex.name === "NotFoundError") {
			grantedDeviceList = noDevicesFoundMsg;
		}
	}
	document.getElementById("granted-devices2").innerHTML = grantedDeviceList;
}

document.getElementById("clickme").addEventListener("click", testIt);

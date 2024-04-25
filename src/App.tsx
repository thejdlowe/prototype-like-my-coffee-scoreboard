import React from "react";
import logo from "./logo.svg";
import "./App.css";
const DEVICE_INFO = { vendorId: 1118, productId: 672, interfaceId: 0 };

function App() {
	const testMe = async () => {
		const devices = await navigator.usb.getDevices();
		console.log({ devices, test: chrome });
	};
	return (
		<div className="App">
			<header className="App-header">
				<button onClick={testMe}>Click</button>
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;

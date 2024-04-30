const state = {
	current: "title",
	players: [
		{ name: "", score: 0 },
		{ name: "", score: 0 },
		{ name: "", score: 0 },
	],
};
window.electronAPI.onButtonUpdate((value) => {
	if (value === "ready") {
		document.querySelectorAll("#P1, #P2, #P3").forEach((el) => {
			el.style.backgroundColor = "white";
		});
		document.querySelector("#rawValue").innerHTML = "Ready";
	} else if (["P1", "P2", "P3"].includes(value)) {
		const el = document.querySelector(`#${value}`);
		el.style.backgroundColor = el.dataset.background;
		document.querySelector("#rawValue").innerHTML = "Not Ready";
	}
});

document.querySelector("body").addEventListener("mousemove", () => {
	document.querySelector("#debug").style.display = "block";
});

document.querySelectorAll("#P1, #P2, #P3").forEach((column) => {
	let score = 0;
	const scoreHolder = document.createElement("div");
	const displayScore = () => {
		scoreHolder.innerHTML = score;
	};
	const updateScore = (val) => {
		score = val;
		displayScore();
	};

	const zeroButton = document.createElement("button");
	zeroButton.innerText = "+0";
	zeroButton.addEventListener("click", () => {
		updateScore(score);
	});

	const oneButton = document.createElement("button");
	oneButton.innerText = "+1";
	oneButton.addEventListener("click", () => {
		updateScore(++score);
	});

	const twoButton = document.createElement("button");
	twoButton.innerText = "+2";
	twoButton.addEventListener("click", () => {
		updateScore(score + 2);
	});

	const threeButton = document.createElement("button");
	threeButton.innerText = "+3";
	threeButton.addEventListener("click", () => {
		updateScore(score + 3);
	});
	const resetButton = document.createElement("button");
	resetButton.innerText = "Reset";
	resetButton.addEventListener("click", () => {
		updateScore(0);
	});
	column.appendChild(scoreHolder);
	column.appendChild(zeroButton);
	column.appendChild(oneButton);
	column.appendChild(twoButton);
	column.appendChild(threeButton);
	column.appendChild(resetButton);
	displayScore();
});

window.electronAPI.onButtonUpdate((value) => {
	//console.log(value);
	document.querySelector("#rawValue").innerHTML = value;
});

document.querySelectorAll("#green, #red, #yellow").forEach((column) => {
	let score = 0;
	const scoreHolder = document.createElement("div");
	const displayScore = () => {
		scoreHolder.innerHTML = score;
	};
	const updateScore = (val) => {
		score = val;
		displayScore();
	};

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
	column.appendChild(oneButton);
	column.appendChild(twoButton);
	column.appendChild(threeButton);
	column.appendChild(resetButton);
	displayScore();
});

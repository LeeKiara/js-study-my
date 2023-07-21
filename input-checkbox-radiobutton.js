(() => {
	const button = document.querySelector("button");

	button.addEventListener("click", (e) => {
		// radio button check된 요소
		const checkedElem = document.querySelectorAll(
			"input[name='gender']:checked"
		);
		console.log(checkedElem);

		let arrRadio = Array.from(checkedElem).map((item) => item.value);
		console.dir(arrRadio);

		// check box 선택된 요소
		const checkedHobby = document.querySelectorAll(
			"input[name='hobby']:checked"
		);

		console.log(checkedHobby);

		let arrCheckbox = Array.from(checkedHobby).map((item) => item.value);
		console.dir(arrCheckbox);

		displayMsg(arrRadio, arrCheckbox);
	});

	function displayMsg(arr1, arr2) {
		console.log(arr1);
		console.log(arr2);

		if (arr1.length === 0 && arr2.length === 0) {
			return;
		}

		let messageStr1 = "";
		let messageStr2 = "";

		for (let item of arr1) {
			messageStr1 += item;
		}

		for (let item of arr2) {
			messageStr2 += item + ",";
		}

		messageStr1 = messageStr1 && `성별은 ${messageStr1} `;
		messageStr2 =
			messageStr2 && `취미는 ${messageStr2.slice(0, messageStr2.length - 1)}`;

		let messageSeperate = messageStr1 != "" && messageStr2 != "" ? "," : "";
		let messageTail = messageStr1 != "" || messageStr2 != "" ? "입니다." : "";

		alert(`${messageStr1} ${messageSeperate} ${messageStr2} ${messageTail}`);
	}
})();

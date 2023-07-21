(() => {
	const button = document.querySelector("button");

	button.addEventListener("click", () => {
		console.log("button click");

		const checkedItems = document.querySelector(
			"input[name='programming']:checked"
		);
		console.log(checkedItems);

		// const arr = Array.from(checkedItems).map((item) => item.value);
		const itemStr = checkedItems.value;

		alert(`선택한 프로그래밍 언어는 ${itemStr} 입니다`);
	});
})();

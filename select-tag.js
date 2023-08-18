(() => {
	const form = document.querySelector("form");
	const select = form.querySelector("select");
	const button = form.querySelector("button");

	button.addEventListener("click", (e) => {
		// form tag안에 button이 1개 있을경우, 자동으로 submit 기능
		// submit의 기본동작을 막음
		e.preventDefault();

		console.log("button click");

		alert(select.value);
	});
})();

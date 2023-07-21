(() => {
  const button = document.querySelector("button");


  button.addEventListener("click", (e) => {
    console.log("button click");

    const checkedProducts = document.querySelectorAll("input[name='product']:checked");

    console.log(checkedProducts);    

    let arrProduct = Array.from(checkedProducts).map((item) => item.value);
    console.dir(arrProduct);

    let alertMsg = "";
    for(let elem of arrProduct) {
      alertMsg = alertMsg + elem + ",";
    }
    (alertMsg != "") && 
        alert(`선택한 상품명은 ${alertMsg.slice(0, alertMsg.length-1)} 입니다.`);

  });
})()
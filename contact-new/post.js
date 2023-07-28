// 서버에서 데이터 조회후 화면에 출력
// JSON데이터로 tr 목록을 만드는 것

// async: 함수를 비동기적으로 실행되게 함
// UI컨텍스트와 별개의 컨텍스트로 실행되게 함
// 프로세스(process): 프로그램이 실행되서 메모리(램)에 올라가면 프로세스
// 스레드(thread): 프로세스의 실행단위를 나눈 것
// 컨텍스트(context): 스레드내의 시간을 분할하여 CPU 처리할 수 있게 한 단위
// 컨텍스트1(우선순위1), 컨텍스트2(우선순위2)
// 우선순위에 따라서 1을 좀더 시간을 많이 할애, 2는 약간만 할애
(async () => {
  // fetch(..)
  // http접속을 통해서 데이터를 가져오거나 보내거나 할 수 있음.
  // await Promise객체
  // Promise객체 처리가 완료되면(resolve), 리턴값을 받음
  // await 키워드는 async 함수에서만 사용 가능
  const response = await fetch(
    "http://localhost:8080/posts"
  );
  // 결과가 배열
  const result = await response.json();

  //----- debuging.....
  // console.dir("----- debuging >> result");
  // console.dir(result);

  const data = Array.from(result);  

  data
  .sort((a,b)=>a.no - b.no)
  .forEach(item => {
    // console.log("--- debuging item");
    // console.log(item);

    const template = cardTemplate(item);
    // console.log("--- debuging template");
    // console.log(template);

    document.forms[0].insertAdjacentHTML(
      "afterend",
      template
    );    
  });

})();

function cardTemplate(item) {
  const template = /*html*/ `
  <div data-no='${item.no}'>
    <em>${item.creatorName}</em>
    <hr>
    <h3>${item.title}</h3>
    <p>${item.content}</p>
    <div><img width="auto" height="100px" src="${item.image}" alt="${item.title}"></div>
    <hr>
    <small>${new Date(item.createdTime).toLocaleString()}</small>
  </div>
  `;

return template;

}

/*
--------------------
 추가 function
--------------------
*/
(() => {
  const form = document.forms[0];
  const title = form.querySelector("input");
  const content = form.querySelector("textarea");
  const file = form.querySelector("div:nth-of-type(3)").querySelector("input");

  const add = form.querySelector("button");

  add.addEventListener("click", async (e) => {
    e.preventDefault();
 
    if (title.value === "") {
      alert("title를 입력해주세요.");
      return;
    }

    if (content.value === "") {
      alert("content를 입력해주세요.");
      return;
    }

    // FileReader 객체 생성
    const reader = new FileReader();
    // FileReader 로드 완료 시 호출되는 이벤트 핸들러
    reader.addEventListener("load", async (e) => {

      console.log(e);

      const image = e.target.result;

      // 서버에 데이터 전송
      // fetch(url, options)
      const response = await fetch("http://localhost:8080/posts", {
        // HTTP Method  
        method: "POST",
        // 보낼 데이터 형식은 json
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title:title.value,
          content:content.value,
          image
        }),
      });

      console.log("button click 후 response");
      console.log(response);

      const result = await response.json();

      console.log("----debug >> result");
      console.log(result.data);

      const template = cardTemplate(result.data);

      console.log("----debug >> template");
      console.log(template);

      document.forms[0].insertAdjacentHTML(
      "afterend",
      template
      ); 

      form.reset(); 
    });

    // 파일을 Data URL 형식으로 읽어오기
    reader.readAsDataURL(file.files[0]);
    
  });  

})();

// 삭제폼
(() => {

  const form = document.forms[0];

  // 삭제 버튼
  const buttons = form.querySelectorAll("button"); 
  const del = buttons[1];

  // 삭제 대상 no
  const inputs = form.querySelectorAll("input"); 
  const no = inputs[2];

  del.addEventListener("click", async (e) => {
    e.preventDefault();

  await fetch(
    `http://localhost:8080/posts/${no.value}`, 
    {
      method: "DELETE",
    }
  );

    const div = document.querySelector(
      `div[data-no="${no.value}"]`
    );

    if (!div) {
      alert("해당 자료가 없습니다.");
      return;
    }

    div.remove();

    form.reset();

    alert("삭제 되었습니다.");   


  });

})();


function createRow(no, title, content, createdTime, creatorName) {
  // 1. 요소 생성
  const tr = document.createElement("tr");

  // 2. 요소의 속성 설정
  tr.dataset.no = no;
  tr.innerHTML = `
  <td>${no}</td>
  <td>${title}</td>
  <td>${content}</td>
  <td>${createdTime}</td>
  <td>${creatorName}</td>`;
  return tr;
}
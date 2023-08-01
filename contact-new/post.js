function cardTemplate(item) {
  const template = /*html*/ `
  <div class="container">
    <div data-no='${item.no}'>
      <em>${item.creatorName}</em>
      <hr>
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      ${item.image ? `<img width="auto" height="100px" src="${item.image}" alt="${item.title}">` : ""}
      <hr>
      <small>${new Date(item.createdTime).toLocaleString()}</small>      
      <div><button class="btn-modify" >수정</button>
      <button class="btn-remove" data-no='${item.no}'>삭제</button></div>
    </div>
  </div>
  `;
  
  return template;
}

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


/*
--------------------
 삭제 기능(이벤트 위임)
--------------------
*/
(()=>{
  document.body.addEventListener("click", async (e) => {
    /** @type {HTMLButtonElement}*/

    // e.target : 실제 이벤트가 발생한 요소
    if(e.target.classList.contains("btn-remove")) {
      // e.preventDefault();

      const removeBtn = e.target;
      const divElement = removeBtn.parentElement.parentElement;
      const dataNoValue = removeBtn.getAttribute('data-no');

      alert(dataNoValue)

      await fetch(
        `http://localhost:8080/posts/${dataNoValue}`, 
        {
          method: "DELETE",
        }
      );
      
      removeBtn.parentElement.parentElement.remove();  
    }
    
    });
  })();

  // 수정처리(이벤트 위임)
  (() => {

    // tbody onclick eventhandler add
    document.body.addEventListener("click", (e) => {

      // click the update-button
      if(e.target.classList.contains("btn-modify")) {
        // jsdoc type 힌트를 넣어줌
        /** @type {HTMLButtonElement} */
        const modifyBtn = e.target;

        // button -> div -> div
        const div = modifyBtn.parentElement.parentElement;

        // div의 모든 값 가져오기
        const modifyNo = div.dataset.no;
        const title = div.querySelector("h3");
        const content = div.querySelector("p");
        console.log(modifyNo);
        console.log(title);
        console.log(content);

        // 모달 레이어 띄우기
        /** @type {HTMLDivElement} */
        const layer = document.querySelector("#modify-layer");
        layer.hidden = false;

        const displayNo = document
                          .querySelector("#modify-box")
                          .querySelector("h3");

         // 모달 내부의 폼에 선택값을 채워 넣음
         const form = document.forms[1];
         const inputTitle = form.querySelector("input");
         const inputContent = form.querySelector("textarea");

         displayNo.innerHTML = "*NO : "+modifyNo;
         inputTitle.value = title.innerHTML;
         inputContent.value = content.innerHTML;

         // 확인/취소 버튼의 이벤트 핸들러 추가
         const buttons = layer.querySelectorAll("button");
         // 수정 버튼
         buttons[0].addEventListener("click", async (e) => {
          e.preventDefault();

          const title = form.querySelector("input").value;
          const content = form.querySelector("textarea").value;

         });

         // 취소 버튼


      }

    });

  })();

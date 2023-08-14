let PAGE_SIZE = 3;    // 고정된 페이지 사이즈(목록 갯수)
let currentPage = 0;  // 현재 페이지 번호
let currentQuery = ""; // 현재 검색 키워드

function cardTemplate(item) {
  const template = /*html*/ `
  <div class="container">
    <div data-no='${item.no}'>
      <div>
        <button class="btn-modify" >수정</button>
        <button class="btn-remove" data-no='${item.no}'>삭제</button>
      </div>
      <em>${item.creatorName}</em>
      <hr>
      <h3>${item.title}</h3>
      <p>${item.content}</p>
      ${item.image ? `<img width="auto" height="100px" src="${item.image}" alt="${item.title}">` : ""}
      <hr>
      <small>${new Date(item.createdTime).toLocaleString()}</small>      
    </div>
  </div>
  `;
  
  return template;
}

// 데이터 조회(페이징 처리)
async function getPagedList(page, query) {
  let url = `http://localhost:8080/posts/paging?page=${page}&size=${PAGE_SIZE}`;

  // 검색 조건이 있으면...
  if(query) {

  }

  // http 통신을 통해서 데이터 조회 후 응답값 받음
  //  - await 키워드는 async 함수에서만 사용 가능
  const response = await fetch(url);
  const result = await response.json();

  console.log("--- debuging result");
  console.log(result);

  // 응답값 객체를 배열로 전환
  const data = Array.from(result.content);  

  console.log("--- debuging data");
  console.log(data);

  // 화면 dispaly
  const divContent = document.querySelector("div");
  

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

}

// 웹 페이지 로딩이 완료되면, 페이징으로 데이터 조회 및 화면 display
(() => {

  window.addEventListener("DOMContentLoaded", () => {

    getPagedList(0);
  });
})();

// 이전/다음 페이징
(() => {

  // 이전/다음 버튼 선택
  const btnPrev = document.forms[1].querySelector("#btnPrev");
  const btnNext = document.forms[1].querySelector("#btnNext");

  btnPrev.addEventListener("click", (e) => {
    e.preventDefault();    

  });

  // 다음 버튼
  btnNext.addEventListener("click", (e) => {
    e.preventDefault();

    alert("다음 페이지 조회");

    // 페이징 처리(현재페이지, 검색어)
    getPagedList(currentPage + 1, currentQuery);

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

    if(file.files[0]) {
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

        const result = await response.json();
        const template = cardTemplate(result.data);

        document.forms[0].insertAdjacentHTML(
          "afterend",
          template
        ); 

        form.reset(); 
      });

      // 파일을 Data URL 형식으로 읽어오기
      reader.readAsDataURL(file.files[0]);
      
    } else {

      alert("파일을 선택하세요.");
    }    
  });  

})();

// 데이터를 서버에 전송하고, UI요소 생성
async function createPost(image) {

}


/*
--------------------
 삭제 기능(이벤트 위임)
--------------------
*/
(() => {
  document.body.addEventListener("click", async (e) => {
    /** @type {HTMLButtonElement}*/

    // e.target : 실제 이벤트가 발생한 요소
    if(e.target.classList.contains("btn-remove")) {
      // e.preventDefault();

      const removeBtn = e.target;
      const div = removeBtn.parentElement.parentElement;

      // button -> div -> div
      const deleteNo = div.dataset.no;

      if(confirm("삭제 하시겠습니까?")) {

        await fetch(
          `http://localhost:8080/posts/${deleteNo}`, 
          {
            method: "DELETE",
          }
        );
        
        removeBtn.parentElement.parentElement.remove();  
      }
      
    }
    
    });
  })();

  // 수정처리(이벤트 위임)
  (() => {

    // tbody onclick eventhandler add
    document.body.addEventListener("click", (e) => {

      /*
      수정버튼을 클릭한 이벤트에 작동
      */ 
      if(e.target.classList.contains("btn-modify")) {
        // jsdoc type 힌트를 넣어줌
        /** @type {HTMLButtonElement} */
        const modifyBtn = e.target;

        // button -> div -> div
        const div = modifyBtn.parentElement.parentElement;

        // div의 모든 값 가져오기
        const modifyNo = div.dataset.no;
        const displayTitle = div.querySelector("h3");
        const displayContent = div.querySelector("p");
        console.log(modifyNo);
        console.log(displayTitle);
        console.log(displayContent);

        // 모달 레이어 띄우기
        /** @type {HTMLDivElement} */
        const layer = document.querySelector("#modify-layer");
        layer.hidden = false;

        const displayNo = document
                          .querySelector("#modify-box")
                          .querySelector("h3");

         // 모달 내부의 폼에 선택값을 채워 넣음
         const form = document.forms[1];
         const title = form.querySelector("input");
         const content = form.querySelector("textarea");

         displayNo.innerHTML = "*NO : "+modifyNo;
         title.value = displayTitle.innerHTML;
         content.value = displayContent.innerHTML;

         // 확인/취소 버튼의 이벤트 핸들러 추가
         const buttons = layer.querySelectorAll("button");
         // 수정 버튼
         buttons[0].addEventListener("click", async (e) => {
          e.preventDefault();

          console.log(modifyNo);
          console.log(title.value);
          console.log(content.value);

          const response = await fetch(`http://localhost:8080/posts/${modifyNo}`, 
            {method: "PUT",
            headers: {"content-type":"application/json"},
            body: JSON.stringify({
              title:title.value,
              content:content.value,
            }),
            });
          
          console.log(response.status);

          displayTitle.innerHTML = title.value;
          displayContent.innerHTML = content.value;
          layer.hidden = true;

         });

         // 취소 버튼


      }

    });

  })();

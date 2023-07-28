(() => {
  const inputName = document.querySelector("input:nth-of-type(1)");
  const inputPhone = document.querySelector("input:nth-of-type(2)");
  const inputEmail = document.querySelector("input:nth-of-type(3)");

  layerDisplay("",1);
  layerDisplay("",2);

  let contacts = [];

  inputEmail.addEventListener("keypress",(e) => {
    // console.log(e.key);
    if(e.key === "Enter") {
      addContact();
    }
  });

  function layerDisplay(show, itemNo) {
    (show === "show") ? 
      document.querySelector(`aside>div:nth-of-type(${itemNo})`).style.display = "" 
      : document.querySelector(`aside>div:nth-of-type(${itemNo})`).style.display = "none";
  }

  // 연락처 추가 button 
  const layerAddContact = document.querySelector("article>button:nth-of-type(1)");

  // 연락처 추가 button 이벤트핸들러 
  layerAddContact.addEventListener("click", (e) => {
    console.log("btnAsideControll click");
    
    layerDisplay("show",1);
    layerDisplay("",2);

  });

  // 연락처 삭제 button 
  const layerRemoveContact = document.querySelector("article>button:nth-of-type(2)");

  // 연락처 삭제 button 이벤트핸들러 
  layerRemoveContact.addEventListener("click", (e) => {
    console.log("btnAsideControll click");
    
    layerDisplay("",1);
    layerDisplay("show",2);

  });

  const btnAddContact = document.querySelector("#addContact");

  // 연락처 추가 button 이벤트핸들러 
  btnAddContact.addEventListener("click", (e) => {
    console.log("button click");
    addContact();
  });
  
  // 연락처 추가
  function addContact() {

    console.log("addContact");

    const name  = inputName.value;
    const phone = inputPhone.value;
    const email = inputEmail.value;

    console.log(`${name}, ${phone}, ${email}`);
  
    if (
      name !== "" &&
      phone !== "" &&
      email !== ""
    ) {
      contacts.push({
        name: name,
        phone: phone,
        email: email,
      });
  
      displayContacts();

      inputName.value = "";
      inputPhone.value = "";
      inputEmail.value = "";      

      // layerDisplay("");
    }
  }
  
  const btnRemoveContact = document.querySelector("#removeContact");

  // console.log(btnRemoveContact);

  // 연락처 삭제 button 이벤트핸들러 
  btnRemoveContact.addEventListener("click", (e) => {
    console.log("removeContact click");
    removeContact();
  });
  

  function removeContact() {
    if(!confirm("삭제하시겠습니까?")) {
      return;
    }
  
    let removeName = document.getElementById("removeName").value;

    // 삭제대상 이름만 제외하고 배열에 저장
    contacts = contacts.filter(
      (contact) =>
        contact.name !== removeName
    );

    displayContacts();

    document.getElementById("removeName").value = "";
  }
  
  function displayContacts() {
    let contactList = document.querySelector("tbody");
    console.log(contactList);

    contactList.innerHTML = "";
    for (let i = 0; i < contacts.length; i++) {
      contactList.innerHTML += `<tr><td>${contacts[i].name}</td><td>${contacts[i].phone} </td><td> ${contacts[i].email}</td></tr>`;
    }
  }

  document.querySelector("#listContact").addEventListener("click", (e)=>{
    layerDisplay("",1);
    layerDisplay("",2);
  });
})()

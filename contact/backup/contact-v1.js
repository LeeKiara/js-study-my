let contacts = [];

const button = document.querySelector("button");
button.addEventListener("click", (e) => {
  addContact();
});


// let deleteButton = document.querySelector("button[name='deleteContact']:");
// deleteButton.addEventListener("click", (e) => {
//   alert("delete");
// });

function addContact() {
  let contactName = document.getElementById(
    "contactName"
  ).value;
  let contactPhone = document.getElementById(
    "contactPhone"
  ).value;
  let contactEmail = document.getElementById(
    "contactEmail"
  ).value;

  if (
    contactName !== "" &&
    contactPhone !== "" &&
    contactEmail !== ""
  ) {
    contacts.push({
      name: contactName,
      phone: contactPhone,
      email: contactEmail,
    });

    document.getElementById("contactName").value =
      "";
    document.getElementById(
      "contactPhone"
    ).value = "";
    document.getElementById(
      "contactEmail"
    ).value = "";

    displayContacts();
  }
}

function removeContact() {
  let removeContactName = document.getElementById(
    "removeContactName"
  ).value;
  contacts = contacts.filter(
    (contact) =>
      contact.name !== removeContactName
  );
  document.getElementById(
    "removeContactName"
  ).value = "";
  displayContacts();
}

function displayContacts() {
  let contactList = document.getElementById(
    "contactList"
  );
  contactList.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    contactList.innerHTML += `<li>${contacts[i].name} | ${contacts[i].phone} | ${contacts[i].email}</li>`;
  }
}
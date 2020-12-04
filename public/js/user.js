function userToHTML(user) {
  return `
    <div class="media-body">
        <h4 class="mt-0">Datos Personales</h4>
        <hr />
        <p><b>Correo electrónico:</b></p>
        <p id="email">${user.email}</p>
        <p><b>Nombre:</b></p>
        <p id="name">${user.name + " " + user.lastName}</p>
    </div>`;
}

function getUser() {
  let email = getTokenValue("user-email");
  sendHTTPRequest(
    "/api/users/" + email,
    "",
    HTTPMethods.get,
    (response) => {
      let user = JSON.parse(response.data);
      let userHTML = userToHTML(user);
      document.getElementById("userData").innerHTML = userHTML;
    },
    (error) => {
      window.location.replace("/login.html");
      document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + "</div>";
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  getUser();

  let inputSearch = document.getElementById("inputSearch");
  inputSearch.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      window.location.replace("/productSearch.html?name=" + inputSearch.value);
    }
  });
});

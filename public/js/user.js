function userToHTML(user) {
  return `
    <div class="media-body">
        <h4 class="mt-0">Datos Personales</h4>
        <hr />
        <p><b>Correo electrónico:</b></p>
        <p id="email">${user.email}</p>
        <p><b>Nombre:</b></p>
        <p id="name">${user.name + " " + user.lastName}</p>
    </div>`
}

function getUser() {
  let urlParams = new URLSearchParams(window.location.search);
  let email = urlParams.get('email');
  let url = APIURL + '/users/' + email;
  sendHTTPRequest(url, '', HTTTPMethods.get, (data) => {
    let user = JSON.parse(data.data);
    let userHTML = userToHTML(user);
    document.getElementById("userData").innerHTML = userHTML;
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + '</div>';
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getUser();
});
function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function handleFormLogin(event) {
  event.preventDefault();
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
  let userCredentials = { email, password };
  sendHTTPRequest(
    "/api/login",
    userCredentials,
    HTTPMethods.post,
    (response) => {
      let token = JSON.parse(response.data);
      setCookie("token", token.token, 2);
      setCookie("user-email", email, 2);
      window.location.replace("/");
    },
    (err) => {}
  );
  return false;
}

document.addEventListener("DOMContentLoaded", () => {});

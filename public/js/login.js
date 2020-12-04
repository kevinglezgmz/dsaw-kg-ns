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
    (err) => {
      console.log(err);
    }
  );
  return false;
}

document.addEventListener("DOMContentLoaded", () => {});

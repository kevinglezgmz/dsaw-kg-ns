function verifyLoggedUser() {
  let email = getTokenValue("user-email");
  sendHTTPRequest(
    "/api/users/" + email,
    "",
    HTTPMethods.get,
    (response) => {
      window.location.replace("/");
    },
    (err) => {
      console.log(err);
    }
  );
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function handleFormSignUp(event) {
  event.preventDefault();
  let name = document.getElementById("inputName").value;
  let lastName = document.getElementById("inputSurnames").value;
  let email = document.getElementById("inputEmail").value;
  let password = document.getElementById("inputPassword").value;
  let confirmPassword = document.getElementById("inputConfirmPassword").value;

  if (
    /\d/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    password.length >= 8 &&
    password === confirmPassword
  ) {
    let newUser = { name, lastName, email, password };
    sendHTTPRequest(
      "/api/users",
      newUser,
      HTTPMethods.post,
      (response) => {
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
      },
      (err) => {
        console.log(err);
      }
    );
  }

  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  verifyLoggedUser();
});

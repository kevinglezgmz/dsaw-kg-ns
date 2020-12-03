function getTokenValue(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function handleFormUpdate(event) {
  let email = getTokenValue("user-email");
  let name = document.getElementById("inputName").value;
  let lastName = document.getElementById("inputSurnames").value;
  let password = document.getElementById("inputPassword").value;
  let confirmPassword = document.getElementById("inputConfirmPassword").value;
  let updatee = { name, lastName, password };
  if (
    /\d/.test(password) &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    password.length >= 8 &&
    password === confirmPassword
  ) {
    sendHTTPRequest(
      "/api/users/" + email,
      updatee,
      HTTPMethods.put,
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {});

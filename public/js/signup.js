function verifyLoggedUser() {
  let email = getTokenValue("user-email");
  sendHTTPRequest(
    "/api/users/" + email,
    "",
    HTTPMethods.get,
    (response) => {
      console.log(response);
      // window.location.replace("/");
    },
    (err) => {
      console.log(err);
    }
  );
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

  $("#inputName").on("keydown", (event) => {
    let name = $("#inputName").val();
    if (name === "") {
      $("#inputName").removeClass("is-valid");
      $("#inputName").addClass("is-invalid");
    } else if (name !== "" && $("#inputName").hasClass("is-invalid")) {
      $("#inputName").removeClass("is-invalid");
      $("#inputName").addClass("is-valid");
    }
  });

  $("#inputSurnames").on("keydown", (event) => {
    let surname = $("#inputSurnames").val();
    if (surname === "") {
      $("#inputSurnames").removeClass("is-valid");
      $("#inputSurnames").addClass("is-invalid");
    } else if (surname !== "" && $("#inputSurnames").hasClass("is-invalid")) {
      $("#inputSurnames").removeClass("is-invalid");
      $("#inputSurnames").addClass("is-valid");
    }
  });

  $("#inputEmail").on("keydown", (event) => {
    let email = $("#inputEmail").val();
    if (email === "") {
      $("#inputEmail").removeClass("is-valid");
      $("#inputEmail").addClass("is-invalid");
    } else if (email !== "" && $("#inputEmail").hasClass("is-invalid")) {
      $("#inputEmail").removeClass("is-invalid");
      $("#inputEmail").addClass("is-valid");
    }
  });

  $("#inputPassword").on("keydown", (event) => {
    let password = $("#inputPassword").val();
    if (password === "") {
      $("#inputPassword").removeClass("is-valid");
      $("#inputPassword").addClass("is-invalid");
    } else if (password !== "" && $("#inputPassword").hasClass("is-invalid")) {
      $("#inputPassword").removeClass("is-invalid");
      $("#inputPassword").addClass("is-valid");
    }
  });

  $("#inputConfirmPassword").on("keydown", (event) => {
    let confirmPassword = $("#inputConfirmPassword").val();
    if (confirmPassword === "") {
      $("#inputConfirmPassword").removeClass("is-valid");
      $("#inputConfirmPassword").addClass("is-invalid");
    } else if (confirmPassword !== "" && $("#inputConfirmPassword").hasClass("is-invalid")) {
      $("#inputConfirmPassword").removeClass("is-invalid");
      $("#inputConfirmPassword").addClass("is-valid");
    }
  });
});

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

function userToForm() {
  let email = getTokenValue("user-email");
  url = "/api/users/" + email;
  sendHTTPRequest(url, "", HTTPMethods.get, (data) => {
    let user = JSON.parse(data.data);
    $("#inputName").val(user.name);
    $("#inputSurnames").val(user.lastName);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  userToForm();

  let inputSearch = document.getElementById("inputSearch");
  inputSearch.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      window.location.replace("/productSearch.html?name=" + inputSearch.value);
    }
  });

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
    let surnames = $("#inputSurnames").val();
    if (surnames === "") {
      $("#inputSurnames").removeClass("is-valid");
      $("#inputSurnames").addClass("is-invalid");
    } else if (surnames !== "" && $("#inputSurnames").hasClass("is-invalid")) {
      $("#inputSurnames").removeClass("is-invalid");
      $("#inputSurnames").addClass("is-valid");
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

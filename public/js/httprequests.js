const HTTPMethods = {
  put: "PUT",
  post: "POST",
  get: "GET",
  delete: "DELETE",
};

const siteURL = window.location.protocol + "//" + window.location.host;

let TOKEN = getTokenValue("token");

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

function sendHTTPRequest(urlAPI, data, method, cbOK, cbError) {
  // 1. Crear XMLHttpRequest object
  let xhr = new XMLHttpRequest();
  // 2. Configurar:  PUT actualizar archivo
  xhr.open(method, siteURL + urlAPI);
  // 3. indicar tipo de datos JSON
  xhr.setRequestHeader("Content-Type", "application/json");
  console.log(TOKEN);
  xhr.setRequestHeader("Authorization", "Bearer " + TOKEN);
  // 4. Enviar solicitud al servidor
  if (typeof data === "object") data = JSON.stringify(data);
  xhr.send(data);
  // 5. Una vez recibida la respuesta del servidor
  xhr.onload = function () {
    if (xhr.status != 200) {
      // analizar el estatus de la respuesta HTTP
      // Ocurrió un error
      alert(xhr.status + ": " + xhr.statusText); // e.g. 404: Not Found
      cbError(xhr.status + ": " + xhr.statusText + "  // " + xhr.responseText);
    } else {
      // console.log(xhr.responseText); // Significa que fue exitoso
      cbOK({ status: xhr.status, data: xhr.responseText });
    }
  };
}

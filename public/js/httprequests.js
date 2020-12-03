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
  let xhr = new XMLHttpRequest();
  xhr.open(method, siteURL + urlAPI);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.setRequestHeader("Authorization", "Bearer " + TOKEN);
  if (typeof data === "object") data = JSON.stringify(data);
  xhr.send(data);
  xhr.onload = function () {
    if (xhr.status != 200) {
      alert(xhr.status + ": " + xhr.statusText);
      cbError(xhr.status + ": " + xhr.statusText + "  // " + xhr.responseText);
    } else {
      cbOK({ status: xhr.status, data: xhr.responseText });
    }
  };
}

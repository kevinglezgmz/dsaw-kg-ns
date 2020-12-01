const orderToHTML = (user) => {
  let sexo = (user.sexo === 'H') ? 'Hombre' : 'Mujer';
  return `
    <div class="media col-8 mt-2">
        <div class="media-left align-self-center mr-3">
            <img class="rounded-circle" src="${user.image}" >
        </div>
        <div class="media-body">
                <h4>${user.nombre} ${user.apellidos}</h4>
                <p >Correo: ${user.email}</p>
                <p >Fecha de nacimiento:${user.fecha} </p>
                <p >Sexo: ${sexo} </p>
            </div>
    </div>`
}

const ordersListToHTML = (list, id) => {
  if (id && list && document.getElementById(id)) {
    document.getElementById(id).innerHTML = list.map(orderToHTML).join(' ');
  }
}

function getOrders() {
  let urlParams = new URLSearchParams(window.location.search);
  let email = urlParams.get('email');
  let url = APIURL + '/orders/' + email;
  sendHTTPRequest(url, '', HTTTPMethods.get, (data) => {
    let orders = JSON.parse(data.data);
    ordersListToHTML(orders, "ordersList")
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + '</div>';
  })
}

document.addEventListener('DOMContentLoaded', () => {
  getOrders();
});
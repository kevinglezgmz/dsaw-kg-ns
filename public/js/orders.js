let productsList;
let ordersList;

function productToHTML(product) {
  return `<div class="media">
  <img id="product_img" src="${product.images[0]}" class="align-self-center mr-3">
  <div class="media-body">
    <h6 class="mt-0">${product.name}</h6>
    <p>${product.description}</p>
  </div>
</div>`;
}

function orderToHTML(order) {
  let products = [];
  let productsID = {};
  for (let productID of order.products) {
    productsID[productID] = productID;
  }
  for (let product of productsList) {
    if (productsID[product.productID.toString()]) {
      products.push(product);
    }
  }
  return `<div class="media-body">
            <div class="row">
              <div class="col-sm-4">
                <h6><b>Fecha de compra</b></h6>
                <p>Hoy</p>
              </div>
              <div class="col-sm-4">
                <h6><b>Dirección de envío</b></h6>
                <p>${order.address + ", " + order.zip + ", " + order.county + ", " + order.state}</p>
              </div>
            </div>
            <hr>
            <div class="row">
              <p><b>Número de pedido:</b> ${order.orderID}</p>
            </div>
            <hr>
            <div class="row">
            ${productsList.slice(0, 3).map(productToHTML).join(" ")}
            </div>
          </div>`;
}

function ordersListToHTML(list, id) {
  if (id && list && document.getElementById(id)) {
    document.getElementById(id).innerHTML = list.map(orderToHTML).join(" ");
  }
}

function getOrdersAndProducts() {
  sendHTTPRequest(
    "/api/orders",
    "",
    HTTPMethods.get,
    (data) => {
      ordersList = JSON.parse(data.data);
      sendHTTPRequest(
        "/api/products",
        "",
        HTTPMethods.get,
        (data) => {
          productsList = JSON.parse(data.data);
          console.log(productsList);
          ordersListToHTML(ordersList, "ordersList");
        },
        (error) => {
          console.log(error);
        }
      );
    },
    (error) => {
      document.getElementById("ordersList").innerHTML = `<h2 style="margin:auto;">No tienes pedidos.</h2>`;
      //document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + "</div>";
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  getOrdersAndProducts();

  let inputSearch = document.getElementById("inputSearch");
  inputSearch.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      window.location.replace("/productSearch.html?name=" + inputSearch.value);
    }
  });
});

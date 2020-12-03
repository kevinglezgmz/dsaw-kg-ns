const productToHTML = (product) => {
  return `<div class="media col-8 mt-2" id="modelo">
  <div class="media-left align-self-center mr-3">
    <img class="rounded" style="width: inherit;" src="${product.images[0]}">
  </div>
  <div class="media-body">
    <h4>${product.name}</h4>
    <p>ID: ${product.productID}</p>
    <p>Precio: ${product.price}</p>
    <p>${product.description}</p>
  </div>
  <div class="media-right align-self-center">
  <div class="row">
  <div class="btn btn-primary" data-id="${product.productID}" > <a class="text-white" href="product.html?productID=${product.productID}"><i class="fas fa-search"></i></a></div>
</div>
<div class="row">
                <div class="btn btn-primary " data-id="${product.productID}"><a class="text-white" href="editProduct.html?productID=${product.productID}"><i class="fas fa-pencil-alt edit"></i></a></div>
            </div>
<div class="row">
<div class="btn btn-primary mt-2" data-toggle="modal" data-target="#deleteFormModal"  data-id="${product.productID}"><i class="fas fa-trash-alt remove "></i></div>
</div>
        </div>
</div>`;
}
const productsListToHTML = (list, id) => {
  if (id && list && document.getElementById(id)) {
    document.getElementById(id).innerHTML = list.map(productToHTML).join(" ");
  }
}

function getProducts() {
  let url = "/api/products"

  sendHTTPRequest(url, "", HTTPMethods.get, (data) => {
    let productsList = JSON.parse(data.data);
    productsListToHTML(productsList, "productsContainer");
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-danger">"` + error + "</div>";
  });
}

function deleteProduct(ele) {
  let productID = ele.getAttribute('data-id');
  //Enviar DELETE request
  let url = '/product/' + productID;
  //console.log(url);
  sendHTTPRequest(url, "", HTTTPMethods.delete, (data) => {
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-success">Producto eliminado</div>';
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + '</div>';
  })
}

document.addEventListener("DOMContentLoaded", () => {
  getProducts();
  $('#deleteFormModal').on('show.bs.modal', function (event) {
    $('#deleteProduct').on('click', (e) => {
      deleteProduct(event.relatedTarget);
    })
  });
  $
})
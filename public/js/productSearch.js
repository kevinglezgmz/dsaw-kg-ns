const productToHTML = (product)=>{
    return `<div class="col-sm-8">
    <div class="media">
      <img id="product_img" src="${product.images[0]}" class="align-self-center mr-3" alt="...">
      <div class="media-body">
        <h5 class="mt-0">${product.name}</h5>
        <p>${product.description}</p>
        <p>Precio: ${product.price}</p>
      </div>
      <ul id="buyList">
        <li>
          <button type="button" class="btn btn-success">Comprar ahora</button>
        </li>
        <li>
          <button type="button" class="btn btn-secondary">Añadir al carrito</button>
        </li>
      </ul>
    </div>
    <hr />
  </div>`;
}
const productsListToHTML = (list, id) => {
  console.log(list);
  if (id && list && document.getElementById(id)) {
    //console.log(list);
    document.getElementById(id).innerHTML = list.map(productToHTML).join(' ');
  }
}
function getProducts(){
  let url = '/api/products';

  sendHTTPRequest(url, '', HTTPMethods.get, (data) =>{
    let productsList = JSON.parse(data.data);
    productsListToHTML(productsList, 'productsContainer')
  }, (error)=>{
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + '</div>';
  });
}
document.addEventListener("DOMContentLoaded", ()=>{
  getProducts();
})
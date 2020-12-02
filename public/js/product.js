const APIURL = window.location.protocol + '//' + window.location.host + '/api';

function addProductImgs(imgs) {
  //console.log(imgs);
  if (imgs.length === 1) {
    return `<div class="tab-pane active" id="pic-1"><img src="${imgs[0]}" /></div>`
  }
  let imgsHTML = `<div class="tab-pane active" id="pic-1"><img src="${imgs[0]}" /></div>`;
  for (let i = 1; i < imgs.length; i++) {
    //console.log(imgs[i])
    imgsHTML += `<div class="tab-pane" id="pic-${i+1}"><img src="${imgs[i]}" /></div>`;
  }
  //console.log(imgsHTML);
  return imgsHTML;
}

function addImgsButton(imgs) {
  if (imgs.length === 1) {
    //console.log("len 1");
    return `<li class="active">
    <a data-target="#pic-1" data-toggle="tab"><img src="${imgs[0]}" /></a>
  </li>`
  }
  let btnHTML = `<li class="active">
  <a data-target="#pic-1" data-toggle="tab"><img src="${imgs[0]}" /></a>
</li>`
  for (let i = 1; i < imgs.length; i++) {
    console.log(imgs[i])
    btnHTML += `<li>
  <a data-target="#pic-${i+1}" data-toggle="tab"><img src="${imgs[i]}" /></a>
</li>`
  }
  return btnHTML;
}

function addStars(score) {
  let roudedScore = Math.round(score)
  let starsHTML = '';
  for (let i = 0; i < roudedScore; i++) {
    starsHTML += `<span class="fa fa-star checked"></span>`;
  }
  for (let i = roudedScore; i < 5; i++) {
    starsHTML += `<span class="fa fa-star"></span>`;
  }
  return starsHTML;
}

function addColors(colors) {
  let colorsHTML = '';
  for (let i = 0; i < colors.length; i++) {
    colorsHTML += `<span class="color" style="background-color:${colors[i]};"></span>`
  }
  return colorsHTML
}

function addSizes(sizes) {
  let sizesHTML = '';
  for (let i = 0; i < sizes.length; i++) {
    sizesHTML += `<span class="size" data-toggle="tooltip" title="${sizes[i]}">${sizes[i]}</span>`
  }
  return sizesHTML;
}

const productToHTML = (product) => {
  let imgsHTML = addProductImgs(product.images);
  let imgsBtn = addImgsButton(product.images);
  let starsHTML = addStars(product.score);
  let colorsHTML = addColors(product.colors);
  let sizesHTML = addSizes(product.sizes);
  return `<div class="card">
      <div class="container-fliud">
        <div class="wrapper row">
          <div class="preview col-md-6">
            <div class="preview-pic tab-content">
              ${imgsHTML}
            </div>
            <ul class="preview-thumbnail nav nav-tabs">
              ${imgsBtn}
            </ul>
          </div>
          <div class="details col-md-6">
            <h3 class="product-title">${product.name}</h3>
            <div class="rating">
              <div class="stars">
                ${starsHTML}
              </div>
              <span class="review-no">${product.reviews + " reseñas"}</span>
            </div>
            <p class="product-description">
              ${product.description}
            </p>
            <h4 class="price">Precio: <span>${'$'+product.price}</span></h4>
            <p class="vote"><strong>${product.like_ratio+'%'}</strong> de los compradores les gustó este producto! <strong>(${product.voters} votos)</strong></p>
            <h5 class="sizes">
              Tallas:
              ${sizesHTML}
            </h5>
            <h5 class="colors">
              Colores:
              ${colorsHTML}
              </h5>
            <div class="action">
              <button class="add-to-cart btn btn-default" type="button" id="addToCart">Añadir al carrito</button>
              <button class="like btn btn-default" type="button" id="liked"><span class="fa fa-heart"></span></button>
            </div>
          </div>
        </div>
      </div>
    </div>`
}

const productListToHTML = (list, id) => {
  if (id && list && document.getElementById(id)) {
    //console.log(list);
    document.getElementById(id).innerHTML = list.map(productToHTML).join(' ');
  }
}

function getProduct() {
  let urlParams = new URLSearchParams(window.location.search);
  //console.log(urlParams);
  let productID = urlParams.get('productID');
  //console.log(productID);
  let url = '/api/products/' + productID
  sendHTTPRequest(url, '', HTTPMethods.get, (data) => {
    //console.log(data);
    let product = JSON.parse(data.data);
    let productList = [];
    productList.push(product);
    productListToHTML(productList, 'product');
  }, (error)=>{
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-danger">' + error + '</div>';
  })
}

document.addEventListener("DOMContentLoaded", function(){
  //console.log('getprods');
  getProduct();
})
const APIURL = window.location.protocol + "//" + window.location.host + "/api";
let products;

function categoryProductToCardHTML(product) {
  return `<div class="card category-card" onclick="goToProductsPageByCategory(event)" data-category="${product.category}">
    <div class="image-box">
      <img src="${product.images[0]}" class="card-img-top" alt="..." />
    </div>
    <div class="card-body">
      <h5 style="text-align: center;"><a href="#">${product.category}</a></h5>
    </div>
  </div>`;
}

function productToHTML(product) {
  return `<div class="card category-card" onclick="goToProductPage(event)" data-product-id="${product.productID}">
    <div class="image-box">
      <img src="${product.images[0]}" class="card-img-top" alt="..." />
    </div>
    <div class="card-body">
      <h5 style="text-align: center;"><a href="#">${product.name}</a></h5>
      <p>${product.description.length > 60 ? product.description.substr(0, 60) + "..." : product.description}</p>
    </div>
  </div>`;
}

function offerToHTML(product) {
  return `<div class="card category-card" onclick="goToProductPage(event)" data-product-id="${product.productID}">
    <div class="image-box">
      <img src="${product.images[0]}" class="card-img-top" alt="..." />
    </div>
    <div class="card-body">
      <h5 style="text-align: center;"><a href="#" style="color:red;">${product.name}</a></h5>
      <p>${product.description.length > 60 ? product.description.substr(0, 60) + "..." : product.description}</p>
    </div>
  </div>`;
}

function goToProductsPageByCategory(event) {
  event.preventDefault();
  let category = event.path;
  for (let ele of event.path) {
    if (ele.getAttribute("data-category")) {
      category = ele.getAttribute("data-category");
      window.location.href = "/productSearch.html?category=" + category;
    }
  }
}

function goToProductPage(event) {
  event.preventDefault();
  let productID;
  for (let ele of event.path) {
    if (ele.getAttribute("data-product-id")) {
      productID = ele.getAttribute("data-product-id");
      window.location.href = "/product.html?productID=" + productID;
    }
  }
}

function categoryProductListToHTML(productList) {
  let productsHTML = productList.reverse().map((product) => categoryProductToCardHTML(product));
  return productsHTML.join("");
}

function productListToHTML(productList) {
  let productsHTML = productList.map((product) => productToHTML(product));
  return productsHTML.join("");
}

function offersListToHTML(offerList) {
  let offersHTML = offerList.map((product) => offerToHTML(product));
  return offersHTML.join("");
}

function setCategoryCards() {
  let categories = {};
  let categoryProducts = [];
  for (let product of products.reverse()) {
    if (categories[product.category]) continue;
    categoryProducts.push(product);
    categories[product.category] = true;
  }
  document.getElementById("categoryCards").innerHTML = categoryProductListToHTML(categoryProducts);
}

function setNewProducts() {
  document.getElementById("newProductCards").innerHTML = productListToHTML(products.slice(0, 8));
}

function setOfferProducts() {
  document.getElementById("offerCards").innerHTML = offersListToHTML(products.slice(8, 18));
}

function getAllProducts() {
  sendHTTPRequest(
    "/api/products/",
    "",
    HTTPMethods.get,
    (data) => {
      products = JSON.parse(data.data);
      setCategoryCards();
      setNewProducts();
      setOfferProducts();
    },
    (err) => {
      console.log(err);
    }
  );
}

document.addEventListener("DOMContentLoaded", () => {
  getAllProducts();
});

let PAGES = {
  current: 1,
  currentIndex: 0,
  totalPages: 0,
};
let NAME_FILTER = "";
let productsList;
const MAX_PRODUCTS_PER_PAGE = 3;

function productToHTML(product) {
  return `  <div class="product-box">
              <div class="media">
                <img class="product-img" style="cursor:pointer;" src="${product.images[0]}" class="align-self-center mr-3" 
                  onclick="goToProductPage(event)" data-product-id="${product.productID}" alt="..." />
                <div class="media-body" onclick="goToProductPage(event)" style="cursor:pointer;" data-product-id="${
                  product.productID
                }">
                  <h5 class="mt-0"><a href="#">${product.name}</a></h5>
                  <p>${product.description.substr(0, 55) + "..."}</p>
                  <p>Precio: ${parseFloat(product.price).toFixed(2)}</p>
                </div>
                <ul class="buy-list">
                  <li>
                    <button type="button" class="btn btn-success btn-format" data-product-id="${
                      product.productID
                    }" onclick="buyProductNow(event)">Comprar ahora</button>
                  </li>
                  <li>
                    <button type="button" class="btn btn-secondary btn-format" data-product-id="${
                      product.productID
                    }" onclick="addProductToCart(event)">Añadir al carrito</button>
                  </li>
                </ul>
              </div>
            </div>`;
}

function buyProductNow(ev) {
  setCookie("cart-details", ev.target.getAttribute("data-product-id"));
  window.location.href = "/payment.html";
}

function addProductToCart(ev) {
  let currCart = getTokenValue("cart-details");
  let products = new Set();
  let currProducts = currCart.split(",");
  for (let product of currProducts) {
    products.add(product);
  }
  products.add(ev.target.getAttribute("data-product-id"));
  setCookie("cart-details", Array.from(products).join(","), 2);
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

function productsListToHTML(list, id) {
  if (id && list && document.getElementById(id)) {
    document.getElementById(id).innerHTML = list.map(productToHTML).join(" ");
  }
}

function getProductsPage(page, filter) {
  productsListToHTML(productsList.slice((page - 1) * 3, page * 3), "productList");
  if (PAGES.totalPages === 1 || PAGES.totalPages === 0) {
    disablePaginationButtons();
  } else {
    handleClicks();
  }
}

function disablePaginationButtons() {
  let paginationButtons = document.querySelectorAll(".pagination li");
  paginationButtons[1].firstChild.innerText = 1;
  paginationButtons[2].firstChild.innerText = 2;
  paginationButtons[3].firstChild.innerText = 3;
  for (let ele of paginationButtons) {
    ele.className = "page-item disabled";
    ele.firstChild.className = "page-link";
    ele.removeEventListener("click", handleClicks);
  }
}

function handleClicks(ev) {
  let paginationButtons = document.querySelectorAll(".pagination li");
  if (ev) {
    let clickedTag = ev.target;
    if (+clickedTag.innerText === PAGES.current + 1 || clickedTag.innerText === "Next") {
      PAGES.current += 1;
    } else if (+clickedTag.innerText === PAGES.current - 1 || clickedTag.innerText === "Previous") {
      PAGES.current -= 1;
    }
  }
  paginationButtons[1].firstChild.innerText = PAGES.current - 1;
  paginationButtons[2].firstChild.innerText = PAGES.current;
  paginationButtons[3].firstChild.innerText = PAGES.current + 1;

  if (PAGES.current <= 2 || PAGES.current === PAGES.totalPages - 1) {
    for (let ele of paginationButtons) {
      ele.className = "page-item";
      ele.addEventListener("click", handleClicks);
      ele.firstChild.className = "page-link";
    }
  }

  if (PAGES.current === 1) {
    paginationButtons[0].removeEventListener("click", handleClicks);
    paginationButtons[0].className = "page-item disabled";
    paginationButtons[1].firstChild.innerText = "";
    paginationButtons[1].firstChild.className = "";
  } else if (PAGES.current === PAGES.totalPages) {
    paginationButtons[4].removeEventListener("click", handleClicks);
    paginationButtons[4].className = "page-item disabled";
    paginationButtons[3].firstChild.innerText = "";
    paginationButtons[3].firstChild.className = "";
  }

  paginationButtons[2].className = "page-item active";
  if (ev) getProductsPage(PAGES.current, NAME_FILTER);
}

document.addEventListener("DOMContentLoaded", () => {
  getProducts();
  let paginationButtons = document.querySelectorAll(".pagination li");
  for (let ele of paginationButtons) {
    ele.addEventListener("click", handleClicks);
  }

  let radioButtons = document.querySelectorAll(".form-check > .form-check-input");
  for (let radio of radioButtons) {
    radio.addEventListener("click", (ev) => {
      let selectedCategory = ev.target.getAttribute("id");
      if (selectedCategory === "todos") {
        window.location.replace("/productSearch.html?name=" + inputSearch.value);
      } else {
        window.location.replace("/productSearch.html?name=" + inputSearch.value + "&category=" + selectedCategory);
      }
    });
  }

  let inputSearch = document.getElementById("inputSearch");
  inputSearch.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
      let selectedCategory = document.querySelector("input[type=radio]:checked").getAttribute("id");
      if (selectedCategory === "todos") {
        window.location.replace("/productSearch.html?name=" + inputSearch.value);
      } else {
        window.location.replace("/productSearch.html?name=" + inputSearch.value + "&category=" + selectedCategory);
      }
    }
  });
});

function getProducts() {
  let urlParams = new URLSearchParams(window.location.search);
  let name = urlParams.get("name");
  let category = urlParams.get("category");
  let url = "/api/products";
  if (name && category) {
    url += "?name=" + name + "&category=" + category;
  } else if (name) {
    url += "?name=" + name;
  } else if (category) {
    url += "?category=" + category;
  }

  let catRadio = document.getElementById(category);
  if (category && catRadio) {
    catRadio.setAttribute("checked", true);
  } else {
    document.getElementById("todos").setAttribute("checked", true);
  }

  document.getElementById("inputSearch").value = name;
  sendHTTPRequest(
    url,
    "",
    HTTPMethods.get,
    (data) => {
      productsList = JSON.parse(data.data);
      PAGES.totalPages = Math.ceil(productsList.length / MAX_PRODUCTS_PER_PAGE);
      PAGES.current = 1;
      getProductsPage(1, NAME_FILTER);
    },
    (error) => {
      console.log(error);
    }
  );
}

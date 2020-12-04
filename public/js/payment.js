let productsList;
let totalCost;

function productToHTML(product) {
  return `<li class="list-group-item d-flex justify-content-between lh-condensed">
            <div>
              <h6 class="my-0">${product.name}</h6>
            </div>
            <span class="text-muted">$${parseFloat(product.price).toFixed(2)}</span>
          </li>`;
}

function goToOrdersPage(event) {
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
    totalCost = 0;
    list.forEach((product) => {
      totalCost += product.price - 50.0;
    });
    document.getElementById(id).innerHTML =
      list.map(productToHTML).join(" ") +
      `<li class="list-group-item d-flex justify-content-between bg-light">
        <div class="text-success">
          <h6 class="my-0">Promo code</h6>
          <small>NAVIDAD2020</small>
        </div>
        <span class="text-success">-$50.00</span>
      </li>` +
      `<li class="list-group-item d-flex justify-content-between">
        <span>Total (MXN)</span>
        <strong>$${parseFloat(totalCost).toFixed(2)}</strong>
      </li>`;
  }
}

function setProductsInfo() {
  document.getElementById("badgeNum").innerText = productsList.length;
  productsListToHTML(productsList, "productList");
}

document.addEventListener("DOMContentLoaded", () => {
  getProducts();

  let inputCard = document.getElementById("cc-number");
  inputCard.addEventListener("keyup", (ev) => {
    let i = 0;
    for (i = 0; i < ev.target.value.length; i++) {
      if (!/\d/.test(ev.target.value.charAt(i))) {
        ev.target.value = ev.target.value.substr(0, i);
        break;
      }
    }
  });

  $("#address").on("keydown", (event) => {
    let address = $("#address").val();
    if (address === "") {
      $("#address").removeClass("is-valid");
      $("#address").addClass("is-invalid");
    } else if (address !== "" && $("#address").hasClass("is-invalid")) {
      $("#address").removeClass("is-invalid");
      $("#address").addClass("is-valid");
    }
  });

  $("#state").on("click", (event) => {
    let state = $("#state").val();
    if (state === "") {
      $("#state").removeClass("is-valid");
      $("#state").addClass("is-invalid");
    } else if (state !== "" && $("#state").hasClass("is-invalid")) {
      $("#state").removeClass("is-invalid");
      $("#state").addClass("is-valid");
    }
  });

  $("#county").on("click", (event) => {
    let county = $("#county").val();
    if (county === "") {
      $("#county").removeClass("is-valid");
      $("#county").addClass("is-invalid");
    } else if (county !== "" && $("#county").hasClass("is-invalid")) {
      $("#county").removeClass("is-invalid");
      $("#county").addClass("is-valid");
    }
  });

  $("#zip").on("keydown", (event) => {
    let zip = $("#zip").val();
    if (zip === "") {
      $("#zip").removeClass("is-valid");
      $("#zip").addClass("is-invalid");
    } else if (zip !== "" && $("#zip").hasClass("is-invalid")) {
      $("#zip").removeClass("is-invalid");
      $("#zip").addClass("is-valid");
    }
  });

  $("#cc-name").on("keydown", (event) => {
    let cc_name = $("#cc-name").val();
    if (cc_name === "") {
      $("#cc-name").removeClass("is-valid");
      $("#cc-name").addClass("is-invalid");
    } else if (cc_name !== "" && $("#cc-name").hasClass("is-invalid")) {
      $("#cc-name").removeClass("is-invalid");
      $("#cc-name").addClass("is-valid");
    }
  });

  $("#cc-number").on("keydown", (event) => {
    let cc_number = $("#cc-number").val();
    if (cc_number === "") {
      $("#cc-number").removeClass("is-valid");
      $("#cc-number").addClass("is-invalid");
    } else if (cc_number !== "" && $("#cc-number").hasClass("is-invalid")) {
      $("#cc-number").removeClass("is-invalid");
      $("#cc-number").addClass("is-valid");
    }
  });

  $("#cc-expiration").on("keydown", (event) => {
    let cc_expiration = $("#cc-expiration").val();
    if (cc_expiration === "") {
      $("#cc-expiration").removeClass("is-valid");
      $("#cc-expiration").addClass("is-invalid");
    } else if (cc_expiration !== "" && $("#cc-expiration").hasClass("is-invalid")) {
      $("#cc-expiration").removeClass("is-invalid");
      $("#cc-expiration").addClass("is-valid");
    }
  });

  $("#cc-cvv").on("keydown", (event) => {
    let cc_cvv = $("#cc-cvv").val();
    if (cc_cvv === "") {
      $("#cc-cvv").removeClass("is-valid");
      $("#cc-cvv").addClass("is-invalid");
    } else if (cc_cvv !== "" && $("#cc-cvv").hasClass("is-invalid")) {
      $("#cc-cvv").removeClass("is-invalid");
      $("#cc-cvv").addClass("is-valid");
    }
  });
});

function placeOrder(ev) {
  ev.preventDefault();
  let address = document.getElementById("address").value;
  let state = document.getElementById("state").value;
  let county = document.getElementById("county").value;
  let zip = document.getElementById("zip").value;
  let ccOwnerName = document.getElementById("cc-name").value;
  let ccNumber = document.getElementById("cc-number").value;
  let ccExpiration = document.getElementById("cc-expiration").value;
  let ccCVV = document.getElementById("cc-cvv").value;
  let orderedProducts = productsList.map((product) => product.productID);

  let orderDetails = {
    address,
    state,
    county,
    zip,
    ccName: ccOwnerName,
    ccNumber,
    ccExpiration,
    ccCVV,
    products: orderedProducts,
    total: totalCost,
    date: new Date(),
  };

  sendHTTPRequest(
    "/api/orders",
    orderDetails,
    HTTPMethods.post,
    (response) => {
      setCookie("cart-details", "", 0.01);
      window.location.href = "/orders.html";
    },
    (err) => {
      console.log(err);
    }
  );
}

function validateCardNumber(cardNumber) {
  var regex = new RegExp("^[0-9]{16}$");
  if (!regex.test(cardNumber)) return false;

  return luhnCheck(cardNumber);
}

function luhnCheck(val) {
  var sum = 0;
  for (var i = 0; i < val.length; i++) {
    var intVal = parseInt(val.substr(i, 1));
    if (i % 2 == 0) {
      intVal *= 2;
      if (intVal > 9) {
        intVal = 1 + (intVal % 10);
      }
    }
    sum += intVal;
  }
  return sum % 10 == 0;
}

function getProducts() {
  let products = getTokenValue("cart-details");
  if (!products || products.length < 5) {
    window.location.href = "/";
  }
  sendHTTPRequest(
    "/api/products?products=" + products,
    "",
    HTTPMethods.get,
    (data) => {
      productsList = JSON.parse(data.data);
      setProductsInfo();
    },
    (error) => {
      console.log(error);
    }
  );
}

function getSizes() {
  let sizes = [];
  if ($("#ECH").is(":checked")) {
    sizes.push("ECH");
  }
  if ($("#CH").is(":checked")) {
    sizes.push("CH");
  }
  if ($("#M").is(":checked")) {
    sizes.push("M");
  }
  if ($("#G").is(":checked")) {
    sizes.push("G");
  }
  if ($("#EG").is(":checked")) {
    sizes.push("EG");
  }
  return sizes;
}

function productToForm(product) {
  $("#productName").val(product.name);
  $("#productPrice").val(product.price);
  $("#productDescription").val(product.description);
  checkSizes(product.sizes);
  $("#productImg").val(product.images.join(","));
  $("#productColor").val(product.colors.join(","));
  $("#category").val(product.category);
  $("#productID").val(product.productID.toString());
}

function checkSizes(sizesList) {
  for (let i = 0; i < sizesList.length; i++) {
    let size = "#" + sizesList[i];
    $(size).prop("checked", true);
  }
}

function getProduct() {
  let urlParams = new URLSearchParams(window.location.search);
  let productID = urlParams.get("productID");
  let url = "/api/products/" + productID
  sendHTTPRequest(url, "", HTTPMethods.get, (data) => {
    let product = JSON.parse(data.data);
    productToForm(product);
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-danger">` + error + "</div>";
  })
}

function updateProduct(ele) {
  let url = '/api/products/' + ele.productID;
  sendHTTPRequest(url, JSON.stringify(ele), HTTPMethods.put, (data) => {
    document.getElementById("responseMSG").innerHTML = '<div class="alert alert-success">Producto actualizado</div>';
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-danger">` + error + '</div>';
  })
}

document.addEventListener("DOMContentLoaded", function () {
  getProduct();

  $("#productName").on("keydown", (event) => {
    let name = $("#productName").val();
    if (name === "") {
      $("#productName").removeClass('is-valid');
      $("#productName").addClass('is-invalid');
    } else if (name !== "" && $("#productName").hasClass("is-invalid")) {
      $("#productName").removeClass("is-invalid");
      $("#productName").addClass("is-valid");
    }
  })

  $("#productPrice").on("keydown", (event) => {
    let price = $("#productPrice").val();
    if (price === "") {
      $("#productPrice").removeClass("is-valid");
      $("#productPrice").addClass("is-invalid");
    } else if (price !== "" && $("#productPrice").hasClass("is-invalid")) {
      $("#productPrice").removeClass("is-invalid");
      $("#productPrice").addClass("is-valid");
    }
  })

  $("#productDescription").on("keydown", (event) => {
    let description = $("#productDescription").val();
    if (description === "") {
      $("#productDescription").removeClass("is-valid");
      $("#productDescription").addClass("is-invalid");
    } else if (description !== "" && $("#productDescription").hasClass("is-invalid")) {
      $("#productDescription").removeClass("is-invalid");
      $("#productDescription").addClass("is-valid");
    }
  })

  $("#productImg").on("keydown", (event) => {
    let img = $("#productImg").val();
    if (img === "") {
      $("#productImg").removeClass("is-valid");
      $("#productImg").addClass("is-invalid");
    } else if (img !== "" && $("#productImg").hasClass("is-invalid")) {
      $("#productImg").removeClass("is-invalid");
      $("#productImg").addClass("is-valid");
    }
  })

  $("#productColor").on("keydown", (event) => {
    let color = $("#productColor").val();
    if (color === "") {
      $("#productColor").removeClass("is-valid");
      $("#productColor").addClass("is-invalid");
    } else if (color !== "" && $("#productColor").hasClass("is-invalid")) {
      $("#productColor").removeClass("is-invalid");
      $("#productColor").addClass("is-valid");
    }
  })

  $("#editProduct").on("click", () => {
    let name = $("#productName").val();
    let price = parseInt($("#productPrice").val());
    let description = $("#productDescription").val();
    let sizes = getSizes();
    let images = $("#productImg").val().split(",");
    let colors = $("#productColor").val().split(",");
    let category = $("#category").val();

    if ($("#productName").hasClass("is-invalid") || $("#productPrice").hasClass("is-invalid") ||
      $("#productDescription").hasClass("is-invalid") || $("#productImg").hasClass("is-invalid") ||
      $("#productColor").hasClass("is-invalid")) {
      alert("Llena los campos que faltan");
      return;
    }

    let urlParams = new URLSearchParams(window.location.search);
    let productID = parseInt(urlParams.get('productID'));

    console.log($("#productImg").val().split(","));

    let productToUpdate = {
      productID: productID,
      name: name,
      price: price,
      description: description,
      sizes: sizes,
      images: images,
      colors: colors,
      category: category,
    }

    updateProduct(productToUpdate);
  });
});
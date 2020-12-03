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

function addProduct(ele) {
  let url = "/api/products/";
  sendHTTPRequest(url, JSON.stringify(ele), HTTPMethods.post, (data) => {
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-success">Producto agregado</div>`;
  }, (error) => {
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-danger">` + error + "</div>";
  })
}

document.addEventListener("DOMContentLoaded", function () {
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

  $("#productID").on("keydown", (event) => {
    let id = $("#productID").val();
    if (id === "") {
      $("#productID").removeClass("is-valid");
      $("#productID").addClass("is-invalid");
    } else if (id !== "" && $("#productID").hasClass("is-invalid")) {
      $("#productID").removeClass("is-invalid");
      $("#productID").addClass("is-valid");
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

  $("#addProduct").on("click", () => {
    let name = $("#productName").val();
    let price = parseInt($("#productPrice").val());
    let description = $("#productDescription").val();
    let sizes = getSizes();
    let images = $("#productImg").val().split(",");
    let colors = $("#productColor").val().split(",");
    let category = $("#category").val();

    if ($("#productName").hasClass("is-invalid") || $("#productPrice").hasClass("is-invalid") ||
      $("#productDescription").hasClass("is-invalid") || $("#productImg").hasClass("is-invalid") ||
      $("#productColor").hasClass("is-invalid") || $("#productName").val() === "" || $("#productPrice").val() === "" ||
      $("#productDescription").val() === "" || $("#productImg").val() === "" || $("#productColor").val() === "") {
      alert("Llena los campos que faltan");
      return;
    }

    let urlParams = new URLSearchParams(window.location.search);
    let productID = parseInt(urlParams.get('productID'));

    console.log($("#productImg").val().split(","));

    let productToAdd = {
      productID: productID,
      name: name,
      price: price,
      description: description,
      sizes: sizes,
      images: images,
      colors: colors,
      category: category,
    }

    addProduct(productToAdd);
  });
});
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
    console.log(error);
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-danger">` + error + "</div>";
  })
}

document.addEventListener("DOMContentLoaded", function () {
  $("#addProduct").on("click", () => {
    let name = $("#productName").val();
    let price = parseInt($("#productPrice").val());
    let description = $("#productDescription").val();
    let sizes = getSizes();
    let images = $("#productImg").val().split(",");
    let colors = $("#productColor").val().split(",");
    let category = $("#category").val();
    let productID = parseInt($("#productID").val());

    let productToAdd = {
      productID: productID,
      name: name,
      price: price,
      description: description,
      sizes: sizes,
      images: images,
      colors: colors,
      category: category,
      score: 0,
      reviews: 0,
      buyers: 0,
      voters: 0,
    }

    addProduct(productToAdd);
  });
});
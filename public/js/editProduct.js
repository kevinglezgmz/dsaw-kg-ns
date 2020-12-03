function getSizes(){
  let sizes = [];
  if($("#ECH").is(":checked")){
    sizes.push("ECH");
  }
  if($("#CH").is(":checked")){
    sizes.push("CH");
  }
  if($("#M").is(":checked")){
    sizes.push("M");
  }
  if($("#G").is(":checked")){
    sizes.push("G");
  }
  if($("#EG").is(":checked")){
    sizes.push("EG");
  }
  return sizes;
}
function productToForm(product){
  $("#productName").val(product.name);
  $("#productPrice").val(product.price);
  $("#productDescription").val(product.description);
  checkSizes(product.sizes);
  $("#productImg").val(product.images.join(","));
  $("#productColor").val(product.colors.join(","));
  $("#category").val(product.category);
  $("#productID").val(product.productID.toString());
}

function checkSizes(sizesList){
  for(let i = 0; i < sizesList.length; i++){
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
    console.log(error);
    document.getElementById("responseMSG").innerHTML = `<div class="alert alert-danger">` + error + '</div>';
  })
}

document.addEventListener("DOMContentLoaded", function () {
  getProduct();

  $("#editProduct").on("click", ()=>{
    let name = $("#productName").val();
    let price = parseInt($("#productPrice").val());
    let description = $("#productDescription").val();
    let sizes = getSizes();
    let images = $("#productImg").val().split(",");
    let colors = $("#productColor").val().split(",");
    let category = $("#category").val();

    let urlParams = new URLSearchParams(window.location.search);
    let productID = parseInt(urlParams.get('productID'));

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
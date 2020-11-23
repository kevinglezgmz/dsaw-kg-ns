const CloudantSDK = require("@cloudant/cloudant");
const CLOUDANT_CREDS = require("../localdev-config.json");
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const PRODUCTS_DB = cloudant.db.use("products");

class ProductsController {
  createProduct(name, score, reviews, buyers, voters, description, price, images, sizes, colors) {
    let newProduct = {
      name,
      score,
      reviews,
      buyers,
      voters,
      description,
      price,
      images,
      sizes,
      colors,
    };
    return newProduct;
  }

  async insertProduct(product) {
    let addedProduct = await PRODUCTS_DB.insert(product);
    return addedProduct;
  }
}

module.exports = ProductsController;

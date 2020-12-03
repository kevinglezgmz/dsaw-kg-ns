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

  async getAllProducts() {
    let products = [];
    let docs = await PRODUCTS_DB.list({ include_docs: true });
    for (let entry of docs.rows) {
      if (entry.doc.views) continue;
      let product = {
        productID: entry.doc.productID,
        name: entry.doc.name,
        description: entry.doc.description,
        price: entry.doc.price,
        images: entry.doc.images,
        category: entry.doc.category,
      };
      products.push(product);
    }
    return products;
  }

  async getProductByID(id) {
    const query = {
      selector: {
        productID: { $eq: id },
      },
    };
    let dbObject = await PRODUCTS_DB.find(query);
    let docs = dbObject.docs;
    let product = docs[0];
    return product;
  }

  async getProductsByNameOrDescription(stringToFind, category) {
    const query = {
      selector: {
        $or: [{ name: { $regex: `(?i)${stringToFind}` } }, { description: { $regex: `(?i)${stringToFind}` } }],
        $and: [{ category: { $eq: category } }],
      },
    };
    if (!stringToFind) {
      delete query.selector["$or"];
    }
    if (!category) {
      delete query.selector["$and"];
    }
    let products = [];
    let dbObject = await PRODUCTS_DB.find(query);
    let docs = dbObject.docs;
    for (let doc of docs) {
      let product = {
        productID: doc.productID,
        name: doc.name,
        price: doc.price,
        description: doc.description,
        images: doc.images,
        category: doc.category,
      };
      products.push(product);
    }
    return products;
  }

  async updateProduct(product) {
    let updateStatus = await PRODUCTS_DB.insert(product);
    return updateStatus;
  }

  async deleteProduct(product) {
    let deleteStatus = await PRODUCTS_DB.destroy(product._id, product._rev);
    return deleteStatus;
  }
}

module.exports = ProductsController;

"use strict";
const express = require("express");
const productsController = require("../controllers/productsController");
const productCtrlr = new productsController();
const router = express();

router.get("/", async (req, res) => {
  if (req.query.name || req.query.category) {
    let products = await productCtrlr.getProductsByNameOrDescription(req.query.name, req.query.category);
    res.send(products);
  } else if (req.query.products) {
    let products = [];
    let productsID = {};
    let allProducts = await productCtrlr.getAllProducts();
    for (let productID of req.query.products.split(",")) {
      productsID[productID] = productID;
    }
    for (let product of allProducts) {
      if (productsID[product.productID.toString()]) {
        products.push(product);
      }
    }
    res.send(products);
  } else {
    let products = await productCtrlr.getAllProducts();
    res.send(products);
  }
});

router.get("/:id", async (req, res) => {
  let product = await productCtrlr.getProductByID(parseInt(req.params.id));
  if (product) {
    delete product["_id"];
    delete product["_rev"];
    res.send(product);
  } else {
    res.set("Content-Type", "application/json");
    res.status(404).send({ message: "Product not found" });
  }
});

router.post("/", async (req, res) => {
  let addedProductStatus = await productCtrlr.insertProduct(req.body);
  if (addedProductStatus.ok) {
    res.send({ message: "Product created successfully" });
  } else {
    res.status(500).send({ message: "An unknown error ocurred" });
  }
});

router.put("/:id", async (req, res) => {
  let product = await productCtrlr.getProductByID(parseInt(req.params.id));
  res.set("Content-Type", "application/json");
  if (product) {
    Object.assign(product, req.body);
    let updateStatus = await productCtrlr.updateProduct(product);
    if (updateStatus.ok) {
      res.send({ message: "Product " + product.productID + " updated" });
    } else {
      res.status(500).send({ message: "An unknown error ocurred" });
    }
  } else {
    res.status(404).send({ message: "Product to update was not found" });
  }
});

router.delete("/:id", async (req, res) => {
  let product = await productCtrlr.getProductByID(parseInt(req.params.id));
  res.set("Content-Type", "application/json");
  if (product) {
    let deleteStatus = await productCtrlr.deleteProduct(product);
    if (deleteStatus.ok) {
      res.send({ message: "Product " + product.productID + " deleted" });
    } else {
      res.status(500).send({ message: "An unknown error ocurred" });
    }
  } else {
    res.status(404).send({ message: "Product to delete was not found" });
  }
});

module.exports = router;

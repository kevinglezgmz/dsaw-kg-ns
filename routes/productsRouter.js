"use strict";
const express = require("express");
const productsController = require("../controllers/productsController");
const productCtrlr = new productsController();
const router = express();

router.get("/", async (req, res) => {
  if (req.query.name) {
    let products = await productCtrlr.getProductsByNameOrDescription(req.query.name);
    res.send(products);
  } else {
    let products = await productCtrlr.getAllProducts();
    res.send(products);
  }
});

router.get("/categories/:category", async (req, res) => {
  let products = await productCtrlr.getProductsByCategory(req.params.category);
  res.send(products);
});

router.get("/:id", async (req, res) => {
  let product = await productCtrlr.getProductByID(req.params.id);
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
  console.log(req.body);
  //let product = productCtrlr.createProduct();
  let addedProduct = await productCtrlr.insertProduct(req.body);
  res.send(addedProduct);
});

router.put("/:id", async (req, res) => {
  let productUpdatee = req.body;
  let product = await productCtrlr.getProductByID(req.params.id);
  res.set("Content-Type", "application/json");
  if (product) {
    Object.assign(product, productUpdatee);
    let updateStatus = await productCtrlr.updateProduct(product);
    if (updateStatus.ok) {
      res.send({ message: "Product " + product.productID + " updated" });
    } else {
      res.status(400).send({ message: "Could not update the product" });
    }
  } else {
    res.status(404).send({ message: "Product to update was not found" });
  }
});

router.delete("/:id", async (req, res) => {
  let product = await productCtrlr.getProductByID(req.params.id);
  res.set("Content-Type", "application/json");
  if (product) {
    let deleteStatus = await productCtrlr.deleteProduct(product);
    if (deleteStatus.ok) {
      res.send({ message: "Product " + product.productID + " deleted" });
    } else {
      res.status(400).send({ message: "Could not delete the product" });
    }
  } else {
    res.status(404).send({ message: "Product to delete was not found" });
  }
});

module.exports = router;

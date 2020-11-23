"use strict";
const express = require("express");
const productsController = require("../controllers/productsController");
const productCtrlr = new productsController();
const router = express();

router.post("/", async (req, res) => {
  console.log(req.body);
  //let product = productCtrlr.createProduct();
  let addedProduct = await productCtrlr.insertProduct(req.body);
  res.send(addedProduct);
});

module.exports = router;

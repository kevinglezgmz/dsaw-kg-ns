"use strict";
const express = require("express");
const ordersController = require("../controllers/ordersController");
const UsersController = require("../controllers/usersController");
const orderCtrlr = new ordersController();
const userCtrlr = new UsersController();
const router = express();
const jwt = require("jsonwebtoken");
const SECRET_JWT = process.env.SECRET_JWT || "h@la123Cr@yola";

async function authentication(req, res, next) {
  let authHeader = req.get("Authorization");
  authHeader = authHeader.split(" ")[1];
  if (authHeader) {
    let token = jwt.verify(authHeader, SECRET_JWT);
    try {
      let user = await userCtrlr.getUserByEmail(token.email);
      if (user && user.token === authHeader) {
        req.user = user;
        next();
      } else {
        res.status(401).send("Not authorized");
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(401).send("Not authorized");
  }
}

router.post("/", authentication, async (req, res) => {
  res.set("Content-Type", "application/json");
  if (req.body) {
    let addedOrderStatus = await orderCtrlr.insertOrder(req.user, req.body);
    res.send(addedOrderStatus);
  } else {
    res.status(400).send({ message: "Order was not created" });
  }
});

router.get("/", authentication, async (req, res) => {
  let orders = orderCtrlr.getAllUserOrders(req.user);
  res.set("Content-Type", "application/json");
  if (orders) {
    res.send(orders);
  } else {
    res.status(404).send({ message: "User does not have any orders" });
  }
});

router.get("/:orderID", authentication, async (req, res) => {
  let order = await orderCtrlr.getOrderByID(req.user, parseInt(req.params.orderID));
  res.set("Content-Type", "application/json");
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Order not found" });
  }
});

module.exports = router;

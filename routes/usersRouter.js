"use strict";
const express = require("express");
const usersController = require("../controllers/usersController");
const userCtrlr = new usersController();
const router = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
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

router.post("/", async (req, res) => {
  let userData = req.body;
  let hash = bcrypt.hashSync(userData.password, 10);
  userData.password = hash;
  if (Object.keys(req.body).length > 0) {
    let userExists = await userCtrlr.getUserByEmail(req.body.email);
    if (!userExists) {
      let insertStatus = await userCtrlr.insertUser(req.body);
      if (insertStatus.ok) {
        res.send({ message: "Account created successfully" });
      } else {
        res.send(500).send({ message: "An unkown error ocurred" });
      }
    } else {
      res.set("Content-Type", "application/json");
      res.status(400).send({
        message: "Account was not created, user already exists",
      });
    }
  } else {
    res.set("Content-Type", "application/json");
    res.status(400).send({
      message: "Missing body",
    });
  }
});

router.get("/:email", authentication, async (req, res) => {
  let user = await userCtrlr.getUserByEmail(req.params.email);
  res.send(user);
});

router.put("/:email", authentication, async (req, res) => {
  let userUpdatee = req.body;
  let user = await userCtrlr.getUserByEmail(req.params.email);
  res.set("Content-Type", "application/json");
  if (user) {
    Object.assign(user, userUpdatee);
    let updateStatus = await userCtrlr.updateUser(user);
    if (updateStatus.ok) {
      res.send({
        message: "User " + user.userID + " updated",
      });
    } else {
      res.status(400).send({
        message: "Could not update the user",
      });
    }
  } else {
    res.status(404).send({
      message: "User to update was not found",
    });
  }
});

router.delete("/:email", authentication, async (req, res) => {
  let user = await userCtrlr.getUserByEmail(req.params.email);
  res.set("Content-Type", "application/json");
  if (user) {
    let deleteStatus = await userCtrlr.deleteUser(user);
    if (deleteStatus.ok) {
      res.send({
        message: "User " + user.userID + " deleted",
      });
    } else {
      res.status(400).send({
        message: "Could not delete the user",
      });
    }
  } else {
    res.status(404).send({
      message: "User to delete was not found",
    });
  }
});
module.exports = router;

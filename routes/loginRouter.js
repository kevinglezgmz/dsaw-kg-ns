const express = require("express");
const usersController = require("../controllers/usersController");
const userCtlr = new usersController();
const router = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const SECRET_JWT = process.env.SECRET_JWT || "h@la123Cr@yola";

router.post("/", async (req, res) => {
  if (req.body.email && req.body.password) {
    let user = await userCtlr.getUserByEmail(req.body.email);
    if (user && bcrypt.compareSync(req.body.password, user.password)) {
      let token = jwt.sign(
        { _id: user._id, userID: user.userID, name: user.name, lastName: user.lastName, email: user.email },
        SECRET_JWT
      );
      user.token = token;
      let updateStatus = await userCtlr.updateUser(user);
      if (updateStatus.ok) {
        res.status(200).send({ token: token });
      } else {
        res.send(500).send({ message: "An unkown error ocurred" });
      }
    } else {
      res.status(401).send({ message: "Wrong credentials" });
    }
  } else {
    res.status(400).send({ message: "Missing email/pass" });
  }
});

module.exports = router;

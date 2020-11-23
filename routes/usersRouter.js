"use strict";
const express = require("express");
const usersController = require("../controllers/usersController");
const userCtrlr = new usersController();
const router = express();

router.post("/", async (req, res) => {
    console.log(req.body);
    if (Object.keys(req.body).length > 0) {
        let userExists = await userCtrlr.getUserByEmail(req.body.email);
        if (!userExists) {
            let addedUser = await userCtrlr.insertUser(req.body);
            res.send(addedUser);
        } else {
            res.set("Content-Type", "application/json");
            res.status(400).send({
                message: "Account was not created, user already exists"
            });
        }
    } else {
        res.set("Content-Type", "application/json");
        res.status(400).send({
            message: "Missing body"
        });
    }
})

router.put("/:email", async (req, res) => {
    let userUpdatee = req.body;
    let user = await userCtrlr.getUserByEmail(req.params.email);
    res.set("Content-Type", "application/json");
    if (user) {
        Object.assign(user, userUpdatee);
        let updateStatus = await userCtrlr.updateUser(user);
        if (updateStatus.ok) {
            res.send({
                message: "User " + user.userID + " updated"
            });
        } else {
            res.status(400).send({
                message: "Could not update the user"
            });
        }
    } else {
        res.status(404).send({
            message: "User to update was not found"
        });
    }
})

router.delete("/:email", async (req, res) => {
    let user = await userCtrlr.getUserByEmail(req.params.email);
    res.set("Content-Type", "application/json");
    if (user) {
        let deleteStatus = await userCtrlr.deleteUser(user);
        if (deleteStatus.ok) {
            res.send({
                message: "User " + user.userID + " deleted"
            });
        } else {
            res.status(400).send({
                message: "Could not delete the user"
            });
        }
    } else {
        res.status(404).send({
            message: "User to delete was not found"
        });
    }
})
module.exports = router;
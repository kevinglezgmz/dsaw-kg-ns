"use strict";
const express = require("express");
const ordersController = require("../controllers/ordersController");
const orderCtrlr = new ordersController();
const router = express();

router.post("/", async (req,res)=>{
    console.log(req.body);
    res.set("Content-Type", "application/json");
    if(req.body){
        let addedOrder = await orderCtrlr.insertOrder(req.body);
        res.send(addedOrder);
    }else{
        res.status(400).send({message: "Order was not created"})
    }
});

router.get("/", async (req, res)=>{
    let orders = await orderCtrlr.getAllOrders();
    res.set("Content-Type", "application/json");
    if(orders){
        res.send(orders);
    }else{
        res.status(404).send({message:"Could not find orders"});
    }
})

router.put("/:orderID", async (req, res) => {
    //console.log(typeof req.params.orderID);
    let orderUpdatee = req.body;
    let order = await orderCtrlr.getOrderByID(parseInt(req.params.orderID));
    res.set("Content-Type", "application/json");
    if(order){
        Object.assign(order, orderUpdatee);
        let updateStatus = await orderCtrlr.updateOrder(order);
        if(updateStatus.ok){
            res.send({message: "Order " + order.orderID + " updated"});
        }else{
            res.status(400).send({message: "Could not update the order"});
        }
    }
})

router.delete("/:orderID", async (req,res)=>{
    let order = await orderCtrlr.getOrderByID(parseInt(req.params.orderID));
    res.set("Content-Type", "application/json");
    if(order){
        let deleteStatus = await orderCtrlr.deleteOrder(order);
        if (deleteStatus.ok) {
            res.send({
                message: "Order " + order.orderID + " deleted"
            });
        } else {
            res.status(400).send({
                message: "Could not delete the order"
            });
        }
    }else{
        res.status(404).send({message: "Order to delete was not found"});
    }
})

module.exports = router;
const CloudantSDK = require("@cloudant/cloudant");
const CLOUDANT_CREDS = require("../localdev-config.json");
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const ORDERS_DB = cloudant.db.use("orders");

class OrdersController{
    async insertOrder(order){
        let addedOrder = await ORDERS_DB.insert(order);
        return addedOrder;
    }
    async updateOrder(order){
        let updateStatus = await ORDERS_DB.insert(order);
        return updateStatus;
    }
    async deleteOrder(order){
        let deleteStatus = await ORDERS_DB.destroy(order._id, order._rev);
        return deleteStatus;
    }
    async getAllOrders(){
        let orders = [];
        let docs = await ORDERS_DB.list({include_docs:true});
        for(let entry of docs.rows){
            let order = {
                orderID: entry.doc.orderID,
                orderDate: entry.doc.orderDate,
                products: entry.doc.products,
                total: entry.doc.total,
                orderStatus: entry.doc.orderStatus,
                shippingInfo: entry.doc.shippingInfo,
                paymentInfo: entry.doc.paymentInfo,
            }
            orders.push(order);
        }
        return orders;
    }
    //async getUserOrders(){}
    async getOrderByID(orderID){
        const query = {
            selector: {
                orderID: {
                    $eq: orderID
                }
            }
        }
        let dbObject = await ORDERS_DB.find(query);
        let uniqueOrder = dbObject.docs[0];
        return uniqueOrder;
    }
};

module.exports = OrdersController;
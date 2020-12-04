const CloudantSDK = require("@cloudant/cloudant");
const CLOUDANT_CREDS = require("../localdev-config.json");
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_DB = cloudant.db.use("users");

class OrdersController {
  async insertOrder(user, order) {
    let orderID = 410000;
    if (user.orders) {
      for (let userOrder in user.orders) {
        if (userOrder.orderID > orderID) {
          orderID = parseInt(order.orderID);
        }
      }
      order.orderID = orderID + 1;
      user.orders.push(order);
    } else {
      order.orderID = orderID + 1;
      user.orders = [order];
    }
    let addedOrderStatus = await USERS_DB.insert(user);
    return addedOrderStatus;
  }

  getAllUserOrders(user) {
    if (!user.orders) return;
    let orders = [];
    for (let userOrder of user.orders) {
      let order = {
        orderID: userOrder.orderID,
        address: userOrder.address,
        state: userOrder.state,
        county: userOrder.county,
        zip: userOrder.zip,
        products: userOrder.products,
        total: userOrder.total,
        date: userOrder.date,
      };
      orders.push(order);
    }
    return orders;
  }

  getOrderByID(user, orderID) {
    if (!user.orders) return;
    for (let order of user.orders) {
      if (order.orderID === orderID) return order;
    }
  }
}

module.exports = OrdersController;

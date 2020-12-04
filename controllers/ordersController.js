const CloudantSDK = require("@cloudant/cloudant");
const CLOUDANT_CREDS = require("../localdev-config.json");
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_DB = cloudant.db.use("users");

class OrdersController {
  async insertOrder(user, order) {
    let orderDetails = {
      address: order.address,
      state: order.state,
      county: order.county,
      zip: order.zip,
      ccName: order.ccName,
      ccNumber: order.ccNumber,
      ccExpiration: order.ccExpiration,
      ccCVV: order.ccCVV,
      products: order.products,
      total: order.total,
      date: order.date,
    };
    let orderID = 410000;
    if (user.orders) {
      for (let userOrder in user.orders) {
        if (userOrder.orderID > orderID) {
          orderID = parseInt(orderDetails.orderID);
        }
      }
      orderDetails.orderID = orderID + 1;
      user.orders.push(orderDetails);
    } else {
      orderDetails.orderID = orderID + 1;
      user.orders = [orderDetails];
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

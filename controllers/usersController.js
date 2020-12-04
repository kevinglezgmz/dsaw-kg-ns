const CloudantSDK = require("@cloudant/cloudant");
const CLOUDANT_CREDS = require("../localdev-config.json");
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_DB = cloudant.db.use("users");

let CURRENT_ID = 0;

async function updateCurrentID() {
  let list = await USERS_DB.list({ include_docs: true });
  let users = [];
  for (let entry of list.rows) {
    users.push(entry.doc);
  }
  let userID = 100000;
  for (let user of users) {
    if (user.userID > userID) {
      userID = user.userID;
    }
  }
  CURRENT_ID = userID + 1;
  console.log(`Current id: ${CURRENT_ID}`);
}
class UsersController {
  generateID() {
    return CURRENT_ID++;
  }

  async createUser(name, lastName, email, password) {
    let userID = this.generateID();
    let newUser = {
      userID,
      name,
      lastName,
      email,
      password,
    };
    return newUser;
  }

  async insertUser(user) {
    user.userID = this.generateID();
    let userToAdd = {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userID: user.userID,
    };
    let addedUserStatus = await USERS_DB.insert(userToAdd);
    return addedUserStatus;
  }

  async updateUser(user) {
    let userUpdatee = {
      _id: user._id,
      _rev: user._rev,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      userID: user.userID,
    };
    let updateStatus = await USERS_DB.insert(userUpdatee);
    return updateStatus;
  }

  async getUserByCredentials(email, password) {
    const query = {
      selector: {
        email: {
          $eq: email,
        },
        password: {
          $eq: password,
        },
      },
    };
    let dbObject = await USERS_DB.find(query);
    let uniqueUser = dbObject.docs[0];
    return uniqueUser;
  }

  async getUserByEmail(email) {
    const query = {
      selector: {
        email: {
          $eq: email,
        },
      },
    };
    let dbObject = await USERS_DB.find(query);
    let uniqueUser = dbObject.docs[0];
    return uniqueUser;
  }

  async deleteUser(user) {
    let deleteStatus = await USERS_DB.destroy(user._id, user._rev);
    return deleteStatus;
  }
}

updateCurrentID();
module.exports = UsersController;

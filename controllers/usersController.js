const CloudantSDK = require("@cloudant/cloudant");
const CLOUDANT_CREDS = require("../localdev-config.json");
const cloudant = new CloudantSDK(CLOUDANT_CREDS.url);
const USERS_DB = cloudant.db.use("users");

let CURRENT_ID = 0;

async function updateCurrentID() {
    let usersDB = await USERS_DB.list({
        include_docs: true
    }).rows;
    if (!usersDB) {
        CURRENT_ID = 1;
    } else {
        let usersList = usersDB.map((obj) => {
            return obj.userID
        });
        CURRENT_ID = Math.max(...usersList) + 1;
    }
    console.log(`Current id: ${CURRENT_ID}`);
}
class UsersController {
    generateID() {
        let id = CURRENT_ID;
        CURRENT_ID++;
        return id;
    }
    async createUser(name, lastName, email, password) {
        let userID = this.generateID();
        let newUser = {
            userID,
            name,
            lastName,
            email,
            password
        }
        return newUser;
    }
    async insertUser(user) {
        user.userID = this.generateID();
        let addedUser = await USERS_DB.insert(user);
        return addedUser;
    }
    async updateUser(user) {
        let updateStatus = await USERS_DB.insert(user);
        return updateStatus;
    }
    //async getUserByCredentials(email, password){}
    async getUserByEmail(email) {
        const query = {
            selector: {
                email: {
                    $eq: email
                }
            }
        }
        let dbObject = await USERS_DB.find(query);
        let uniqueUser = dbObject.docs[0];
        return uniqueUser;
    }
    async deleteUser(user) {
        let deleteStatus = await USERS_DB.destroy(user._id, user._rev);
        return deleteStatus;
    }
};

updateCurrentID();
module.exports = UsersController;
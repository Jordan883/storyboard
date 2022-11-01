const users = require("./data/users");
const Connection = require("./config/mongoConnection");

async function main(){
    const db = await Connection.dbConnection();
    await db.dropDatabase();
    const user1 = await users.create(
        "child",
        "123456@gmail.com",
        "abc",
        "kk",
        "123456abc"
    );
    await Connection.closeConnection();
}
main();
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

function checkid(id)
{
    let parsedId = ObjectId(id);
    return parsedId;
}
module.exports = {
async create(type,email,username,password){
    const userCollection = await users();

    let newuser = {
        type:type,
        email:email,
        username:username,
        password:password
    };

    const insertInfo = await userCollection.insertOne(newuser);
    if (insertInfo.insertedCount === 0) throw 'Could not add user';
    const newId = insertInfo.insertedId;
    let x = newId.toString();
    const user = await this.get(x);
    return user;
},

async get(id){
    const userCollection=await users()
    const user = await userCollection.findOne({ _id: checkid(id) });
    user._id=user._id.toString()
    return user
},

async delete(id)
{
    const userCollection = await users();
    const user = await this.get(id);
    const deletionInfo = await userCollection.deleteOne({ _id: checkid(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }
    return `${user.username} has been successfully deleted!`;
}

}
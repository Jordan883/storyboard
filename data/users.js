const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

function checkid(id)
{
    let parsedId = ObjectId(id);
    return parsedId;
}
module.exports = {
async create(type,email,username,name,password){
    const userCollection = await users();
    if(!this.check(email,password)) throw'the email or password is wrong'
    let newuser = {
        type:type,
        email:email,
        username:username,
        name:name,
        password:password
    };

    const insertInfo = await userCollection.insertOne(newuser);
    if (insertInfo.insertedCount === 0) throw 'Could not add user';
    const newId = insertInfo.insertedId;
    let x = newId.toString();
    const user = await this.get(x);
    return user;
},

async get(email){
    const userCollection=await users()
    const user = await userCollection.findOne({ email:email });
    user._id=user._id.toString()
    return user
},

async delete(id)
{
    const userCollection = await users();
    const user = await userCollection.findOne({_id:checkid(id)})
    const deletionInfo = await userCollection.deleteOne({ _id: checkid(id) });
    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }
    return `${user.username} has been successfully deleted!`;
},

async check(email,password){
    const userCollection=await users();
    const user=await this.get(email)
    if(user.password==password) return true
    else return false
}

}
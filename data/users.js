const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');

function checkid(id)
{
    let parsedId = ObjectId(id);
    return parsedId;
}
module.exports = {
async create(type,email,username,name,secret){
    const userCollection = await users();
    let newuser = {
        type:type,
        email:email,
        username:username,
        secret:secret,
        name:name,
        family:null,
        content_restrict:null
    };

    const olduser = await userCollection.findOne({email:email})
    if(olduser) throw 'the user already exist'
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

async getByEmail(email){
    const userCollection=await users()
    const user = await userCollection.findOne({ email:email });
    user._id=user._id.toString()
    return user
},

async updateUser(id,type,email,name,username,family,content_restrict){
    const userCollection = await users();
    let modifyuser = {
        type:type,
        email: email,
        username:username,
        name:name,
        family:family,
        content_restrict:content_restrict
      };
  
      const updatedInfo = await userCollection.updateOne(
        { _id: ObjectId(id) },
        { $set: modifyuser }
      );
      if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount) {
        throw "could not update user successfully";
      }
      return true;
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


}
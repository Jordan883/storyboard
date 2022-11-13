const func = require('./functions');
const mongoCollections = require('../config/mongoCollections');
const articles = mongoCollections.articles;
const userdata = require("./users");
const { ObjectId } = require('mongodb');

module.exports = {
  async createComment(articleId, userId, articleComment) {
    if (!articleId || !userId || !articleComment) throw 'please provide all inputs for comment';
    if (!ObjectId.isValid(articleId)) throw 'invalid article ID';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';

    const newId = ObjectId();
    const date = new Date();
    let newComment = {
      _id: newId,
      aricleId: articleId,
      userId: userId,
      articleComment: articleComment,
      timestamp: date.toDateString(),
    };

    const articleCollection = await articles();
    const updateInfo = await articleCollection.updateOne({ _id: ObjectId(articleId) },
      { $addToSet: { comments: newComment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a comment';   
  },
  async removeComment(commentId) {
    let article = await artilecollection.findone // to be continued //
    
  async getAllComments(articleId) {
    if (!articleId) throw 'please provide article id';
    if (!ObjectId.isValid(articleId)) throw 'invalid article id';
    
    const articlecollection = await articles();
    const articlelist = await articlecollection.find({_id: ObjectId(articleId) }, { projection: { comments: 1 } }).toArray();
    if (!articlelist || articlelist === null) gthrow 'no article with that id';
    return articlelist;
  },  
}

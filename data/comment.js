const func = require('./functions');
const mongoCollections = require('../config/mongoCollections');
const articles = mongoCollections.articles;
const userdata = require("./users");
const { ObjectId } = require('mongodb');

module.exports = {
  async createComment(articleId, userId, articleComment) {
    if (!articleId || !userId || !articleComment) throw 'please provide all inputs for comment';
    if (arguments.length != 4) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(articleId)) throw 'invalid article ID';
    if (!ObjectId.isValid(userId)) throw 'invalid user ID';

    const newId = ObjectId();
    const date = new Date();
    let newComment = {
      _id: newId,
      aricleId: articleId,
      userId: userId,
      articleComment: articleComment,
    };

    const articleCollection = await articles();
    const updateInfo = await articleCollection.updateOne({ _id: ObjectId(articleId) },
      { $addToSet: { comments: newComment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a comment';   
  },  
}
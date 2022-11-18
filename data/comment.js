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
    return newComment;
  },   
  async getAllComments(articleId) {
    if (!articleId) throw 'please provide article id';
    if (!ObjectId.isValid(articleId)) throw 'invalid article id';
    
    const articlecollection = await articles();
    const articlelist = await articlecollection.find({ _id: ObjectId(articleId) }, { projection: { comments: 1 } }).toArray();
    if (!articlelist || articlelist === null) throw 'no article with that id';
    return articlelist;
  },
  async getUserByCommentId(commentId) {
    if (!commentId) throw 'please provide comment id';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';

    const articleCollection = await articles();
    let article = await articleCollection.findOne(
      { "comments._id": ObjectId(commentId) },
      { projection: { comments: 1 } }
    );
    if (park === null) throw 'No comment with that id';
    var userId = null;
    for (const element of article.comments) {
      if (element._id.toString() === commentId.toString()) {
        userId = element.userId;
        break;
      }
    }
    if (userId === null) throw "could not find that user with that comment";
    const user = await userdata.get(userId);
    return user;
  }
}


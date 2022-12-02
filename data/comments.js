// Comments is a sub-document of article
const func = require('./functions');
const mongoCollections = require('../config/mongoCollections');
const articles = mongoCollections.articles;
const userdata = require("./users");
const { ObjectId } = require('mongodb');

module.exports = {
  async createComment(articleId, userId, rating, articleComment) {
    const newId = ObjectId();
    const date = new Date();

    let newComment = {
      _id: newId,
      articleId: articleId,
      userId: userId,
      rating: rating,
      timestamp: date.toDateString(),
      articleComment: articleComment,
      reply: []
    };
    const articleCollection = await articles();
    const updateInfo = await articleCollection.updateOne({ _id: ObjectId(articleId) },
      { $addToSet: { comments: newComment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not add a comment';

    let article = await articleCollection.findOne({ _id: ObjectId(articleId) });
    const rate = func.computeRating(article);

    const updatedInfo = await articleCollection.updateOne(
      { _id: ObjectId(articleId) },
      { $set: { content_rating: rate } }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Could not update average rating';
    return newComment;
  },
  async removeComment(commentId) {
    if (!commentId) throw 'please provide comment id';
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';

    const articleCollection = await articles();
    let article = await articleCollection.findOne({ "comments._id": ObjectId(commentId) });
    if (article === null) throw 'No comment with that id';
    const updateInfo = await articleCollection.updateOne(
      { _id: ObjectId(article._id) },
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
      throw 'Could not remove that a comment';

    article = await articleCollection.findOne({ _id: ObjectId(article._id) });
    const rating = func.computeRating(article);
    const updatedInfo = await articleCollection.updateOne(
      { _id: ObjectId(article._id) },
      { $set: { averageRating: rating } }
    );
    if (!updatedInfo.matchedCount && !updatedInfo.modifiedCount)
      throw 'Could not update average rating';
    return true;
  },
  async getAllComments(articleId) {
    if (!articleId) throw 'please provide article id';
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(articleId)) throw 'invalid article ID';

    const articleCollection = await articles();
    const articleList = await articleCollection.find({ _id: ObjectId(articleId) }, { projection: { comments: 1 } }).toArray();
    if (!articleList || articleList === null) throw 'no article with that id';
    return articleList;
  },

  async replyComment(commentId, userId, newUserComment) {
    if (!commentId || !userId || !newUserComment) throw 'please provide comment id and comment';
    if (arguments.length != 3) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';
    if (!ObjectId.isValid(userId)) throw 'invalid comment ID';

    const user = await userdata.getUserById(userId);
    const name = user.firstname + " " + user.lastname;
    const id = user._id;
    const date = new Date();
    const newId = ObjectId();
    let newcomment = {
      _id: newId,
      userId: id,
      username: name,
      usercomment: newUserComment,
      timestamp: date.toDateString(),
    };

    const articleCollection = await articles();
    let article = await articleCollection.findOne({ "comments._id": ObjectId(commentId) });
    if (article === null)
      article = await articleCollection.findOne({ "comments.reply._id": ObjectId(commentId) });
    if (article === null) throw 'No comment with that id';
    const updateInfo = await articleCollection.updateOne(
      { "comments._id": ObjectId(commentId) },
      { $addToSet: { "comments.$.reply": newcomment } }
    );
    const updateInfo2 = await articleCollection.updateOne(
      { "comments.reply._id": ObjectId(commentId) },
      { $addToSet: { "comments.$.reply": newcomment } }
    );
    if (!updateInfo.matchedCount && !updateInfo.modifiedCount && !updateInfo2.matchedCount && !updateInfo2.modifiedCount)
      throw 'Could not reply that a comment';
    return true;
  },

  async getUserByCommentId(commentId) {
    if (!commentId) throw 'please provide comment id';
    if (arguments.length != 1) throw 'the number of parameter is wrong';
    if (!ObjectId.isValid(commentId)) throw 'invalid comment ID';

    const articleCollection = await articles();
    let article = await articleCollection.findOne(
      { "comments._id": ObjectId(commentId) },
      { projection: { comments: 1 } }
    );
    if (article === null) {
      article = await articleCollection.findOne(
        { "comments.reply._id": ObjectId(commentId) },
        { projection: { comments: 1 } }
      );
    }
    if (article === null) throw 'No comment with that id';
    var userId = null;
    for (const element of article.comments) {
      if (element._id.toString() === commentId.toString()) {
        userId = element.userId;
        break;
      }
      for (const e of element.reply) {
        if (e._id.toString() === commentId.toString()) {
          userId = e.userId;
          break;
        }
      }
    }
    if (userId === null) throw "could not find that user with that comment";
    const user = await userdata.getUserById(userId);
    return user;
  }
}
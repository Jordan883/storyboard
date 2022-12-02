const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const func = require("./functions");

const users = mongoCollections.users;
const articles = mongoCollections.articles;

// BASIC FUNCTIONS: (Which every data module should have!)
// Create
// Get all
// Get one (by ID)
// Delete one (by ID)
// Update one (by ID)

// We can add custom functions as we need them. 

function checkid(id)
{
    let parsedId = ObjectId(id);
    return parsedId;
}

module.exports = {
  async createArticle(poster, title, content, image) {
    const articleCollection = await articles();

    // Content: string
    // Comments: [Comment]
    // Poster: id
    // Time: time
    // Content_Rating: [float]
    // Access: int
    const newArticleId = ObjectId();
    let newArticle = {
      _id: newArticleId,
      title: title,
      content: [],
      comments: [],
      poster: poster,
      time: [],
      content_rating: 5,
      access: [],
      // image function
      image: image
    };
    
    const insertInfo = await articleCollection.insertOne(newArticle);

    const newContentId = ObjectId();
    let newContent = {
      _id: newContentId,
      text: content
    };

    const contentUpdateInfo = await articleCollection.updateOne({ _id: ObjectId(newArticleId) },
      { $addToSet: { content: newContent } }
    );

    const versionUpdateInfo = await articleCollection.updateOne({ _id: ObjectId(newArticleId) },
      { $set: { current_version: newContentId } }
    );

    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add article";
    newArticle = await articleCollection.findOne(newArticle);
    return newArticle;
  },

  async get(id){
      const articleCollection=await articles()
      const article = await articleCollection.findOne({ _id: checkid(id) });
      article._id=article._id.toString()

      // get current version
      contentId = article.current_version
      content = await articleCollection.findOne({ "content._id":contentId});
      return article
  },

  async getContent(id){
      const articleCollection=await articles()
      const article = await articleCollection.findOne({ _id: checkid(id) });

      // get current version
      contentId = article.current_version
      versions = article.content

      for (const version in versions) {
        var inner = versions[version]
        if (inner._id.toString() == contentId.toString())
            {
                var text = inner.text.toString()
            }
      }
      return text
  },

  async delete(id)
  {
      const articleCollection = await articles();
      const article = await this.get(id);
      const deletionInfo = await articleCollection.deleteOne({ _id: checkid(id) });
      if (deletionInfo.deletedCount === 0) {
          throw `Could not delete article with id of ${id}`;
      }
      return `${article.title - article.poster} has been successfully deleted!`;
  },

  async edit(id, text)
  {
      const articleCollection = await articles();
      const article = await this.get(id);
      const newContentId = ObjectId();

      let newContent = {
          _id: newContentId,
          text: text
      };

      const contentUpdateInfo = await articleCollection.updateOne({ _id: ObjectId(id) },
      { $addToSet: { content: newContent } }
      );

      const versionUpdateInfo = await articleCollection.updateOne({ _id: ObjectId(id) },
      { $set: { current_version: newContentId } }
      );

      return `${article.title - article.poster} has been successfully updated!`;
  },

  async getAllArticles()
  {
      const articleCollection = await articles();
      const articlesList = await articleCollection.find({}, {
      }).toArray();
      if (!articlesList) throw 'could not get all articles';
      return articlesList;
  },

  async getArticlesByRestrict(level, posteremail)
  {
      const articleCollection = await articles();
      const articlesList = await articleCollection.find({ $or: [{content_rating: { $gte: level } }, {poster: posteremail}]}, {}).toArray();
      if (!articlesList) throw 'could not get all articles';
      return articlesList;
  },

  async getAllVersions(ArticleId)
  {
      const articleCollection = await articles();
      const VersionList = await articleCollection.find({ _id: ObjectId(ArticleId) }).toArray();
      article = VersionList[0];
      history = article.content;

      return history;
  },

  async restoreVersion(versionId)
  {
      const articleCollection = await articles();
      const article = await articleCollection.find({ "content._id": ObjectId(versionId) }).toArray();
      const versionUpdateInfo = await articleCollection.updateOne({ _id: ObjectId(article[0]._id) },
      { $set: { current_version: ObjectId(versionId) } }
      );
      return "Successful";
  },

};
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
    const articlesCollection = await articles();

    // Content: string
    // Comments: [Comment]
    // Poster: id
    // Time: time
    // Content_Rating: [float]
    // Access: int    
    let newArticle = {
      title: title,
      content: content,
      comments: [],
      poster: poster,
      time: [],
      content_rating: [],
      access: [],

      // image function
      image: image

    };
    
    const insertInfo = await articlesCollection.insertOne(newArticle);
    if (!insertInfo.acknowledged || !insertInfo.insertedId)
      throw "Could not add article";
    newArticle = await articlesCollection.findOne(newArticle);
    return newArticle;
  },

  async get(id){
      const articleCollection=await articles()
      const article = await articleCollection.findOne({ _id: checkid(id) });
      article._id=article._id.toString()
      return article
  },

  async delete(id)
  {
      const articleCollection = await articles();
      const article = await this.get(id);
      const deletionInfo = await articleCollection.deleteOne({ _id: checkid(id) });
      if (deletionInfo.deletedCount === 0) {
          throw `Could not delete article with id of ${id}`;
      }
      return `${article.title - article.author} has been successfully deleted!`;
  }

};

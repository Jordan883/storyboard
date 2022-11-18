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

module.exports = {
  async createArticle(poster, title, content, image) {
    const articlesCollection = await articles();
    const newId = ObjectId();

    // Content: string
    // Comments: [Comment]
    // Poster: id
    // Time: time
    // Content_Rating: [float]
    // Access: int    
    let newArticle = {
      _id: newId,
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

};

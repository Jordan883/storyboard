const mongoCollections = require('../config/mongoCollections');
const articles = mongoCollections.articles;
const {ObjectId} = require('mongodb');

const createArticle = async (
  content
) => {
  // All inputs have been checked. Load into the database 
  const articleCollection = await articles();

  let newArticle = {
    content: content
  };

  const insertInfo = await articleCollection.insertOne(newArticle);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw 'Error: Could not add article';

  // const newId = insertInfo.insertedId.toString();

  // const article = await getMovieById(newId);
  // return article;
};

module.exports = {
  createArticle
};
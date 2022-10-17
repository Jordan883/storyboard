const mongoCollections = require('../config/mongoCollections');
const articles = mongoCollections.articles;
const {ObjectId} = require('mongodb');

// const createArticle = async (
//   content
// ) => {
//   // All inputs have been checked. Load into the database 
//   const articleCollection = await articles();

//   let newArticle = {
//     content: content
//   };

//   const insertInfo = await articleCollection.insertOne(newArticle);
//   if (!insertInfo.acknowledged || !insertInfo.insertedId)
//     throw 'Error: Could not add article';

//   // const newId = insertInfo.insertedId.toString();

//   // const article = await getMovieById(newId);
//   // return article;
// };

// module.exports = {
//   createArticle

function checkid(id)
{
    let parsedId = ObjectId(id);
    return parsedId;
}
module.exports = {
async create(title,author,content){
    const articleCollection = await articles();

    let newarticle = {
        title:title,
        author:author,
        content:content
    };

    const insertInfo = await articleCollection.insertOne(newarticle);
    if (insertInfo.insertedCount === 0) throw 'Could not add article';
    const newId = insertInfo.insertedId;
    let x = newId.toString();
    const article = await this.get(x);
    return article;
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

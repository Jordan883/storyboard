// TODO: Add output instructions for when this app runs. 
const articles = require('./data/articles');
const connection = require('./config/mongoConnection');

const main = async () => {
    const db = await connection.dbConnection();
    await db.dropDatabase();

    // Create and add a movie
    const firstArticle = await articles.createArticle(
        'Hello from StoryBoard!'
    );

    await connection.closeConnection();
};

main();
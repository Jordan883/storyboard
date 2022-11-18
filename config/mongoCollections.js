const dbConnection = require('./mongoConnection');

/* This will allow you to have one reference to each collection per app */
/* Feel free to copy and paste this this */
const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection.connectToDb();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

/* Now, you can list your collections here: */
module.exports = {
  //TODO: Add collections as needed (per the data directory)
  articles:getCollectionFn('articles'),
  comments: getCollectionFn('comments'),
  families:getCollectionFn('families'),
  users:getCollectionFn('users')
};

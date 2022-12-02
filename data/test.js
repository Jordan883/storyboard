const users = require("../data/users");
const articles = require("../data/articles");
const comments = require("../data/comments");

const dbConnection = require("../config/mongoConnection");

async function test() {
  const db = await dbConnection.connectToDb();
  await db.dropDatabase();

  console.log("------------Init Users------------");
  const user1 = await users.create(
    "jf",
    "Jordan",
    "jfernan6@stevens.edu",
  );
  const user2 = await users.create(
    "yz",
    "Yifan",
    "zyfhood@gmail.com",
  );
  const user3 = await users.create(
    "sl",
    "Siyan",
    "sliu112@stevens.edu",
  );
  const user4 = await users.create(
    "km",
    "Kaijie",
    "ppooglemail@gmail.com",
  );
  const user5 = await users.create(
    "wz",
    "Wenjing",
    "18679699872@163.com",
  );
  const user6 = await users.create(
    "cc",
    "Chun",
    "chchun0322@gmail.com",
  );
  await users.updateUser(user1._id);
  await users.updateUser(user2._id);
  await users.updateUser(user3._id);
  await users.updateUser(user4._id);
  await users.updateUser(user5._id);
  await users.updateUser(user6._id);

  console.log("------------create users successfully------------");

  console.log("------------Init Articles------------");

  const article = await articles.createArticle(
    "I like it",
    "1",
    "2"    
  );
 
  console.log("------------create articles successfully------------");

  console.log("------------Init Comments------------");

  const comment1 = await comments.createComment(
    article._id,
    user1._id,
    "1"
  );
  const comment2 = await comments.createComment(
    article._id,
    user2._id,
    "2"
  );
  const comment3 = await comments.createComment(
    article._id,
    user3._id,
    "3"
  );
  const comment4 = await comments.createComment(
    article._id,
    user4._id,
    "4"
  );
  const comment5 = await comments.createComment(
    article._id,
    user5._id,
    "5"
  );
  const comment6 = await comments.createComment(
    article._id,
    user6._id,
    "6"
  );

  console.log("------------create comments successfully------------");

  await dbConnection.closeConnection();
 
}

test();

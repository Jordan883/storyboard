const express = require("express");
const router = express.Router();
const data = require("../data/articles");
const userdata = require("../data/users");
const commentdata = require("../data/comment");
var xss = require("xss");

router
  .route("/id/comments/:id")
  .get(async (req, res) => {
    if (req.session && req.session.user)
      var currentUsername = req.session.user.name;
    else currentUsername = null;
    try {
      const park = await data.getarticleById(req.params.id);
      const comments = article.comments;
      var userList = [];
      for (const element of comments) {
        const userInfo = await userdata.getUserById(element.userId);
        const name = userInfo.firstname + " " + userInfo.lastname;
        var user = {
          currentUsername: currentUsername,
          userId: element.userId,
          username: name,
          comment: element.parkComment,
          timestamp: element.timestamp,
          commentId: element._id,
        };
        userList.push(user);
      }
      res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      try {
        const userInfo = req.session.user;
        const info = req.body;
        const articleId = req.params.id;
        if (!info.newCommentTxt)
          throw "Please provide all the input for createComment!";
        const infonewCommentTxt = xss(info.newCommentTxt);
        const comment = await commentdata.createComment(
          parkId,
          userInfo.userId,
          infonewCommentTxt
        );
        res.status(200).json(comment);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    } else
      res
        .status(400)
        .render("function/Login", { error: "Log in to comment articles!" });
  });

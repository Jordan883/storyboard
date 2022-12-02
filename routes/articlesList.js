const express = require("express");
const router = express.Router();
const data = require("../data/articles");
const userdata = require("../data/users");
const familydata = require("../data/families");
var xss = require("xss");

router.route("/").get(async (req, res) => {
    // get user info
    const email = req.oidc.user.email;
    const userInfo = await userdata.getByEmail(email);
    const familyInfo = await familydata.getFamilyById(userInfo.family);
    var isChild = false
    if (userInfo.type.toString() == "Child"){
        var isChild = true
    }

    // content restrict if user is child by their restrict level
    if (isChild){
        articles = await data.getArticlesByRestrict(familyInfo.content_restrict);
    }else{
        articles = await data.getAllArticles();
    }

    for (let article of articles) {
      article.rating = article.content_rating;
      const userInfo = await userdata.getByEmail(article.poster);
      article.poster = userInfo.name
    }

    res.render("function/ArticlesList", {
      articles: articles,
      isChild: isChild,
    });
});

router.route("/search").post(async (req, res) => {
  try {
    const info = req.body;
    let searchdata;
    if ("articlename" in info) {
      const infoarticlename = xss(info.articlename);
      searchdata = await data.getArticlesByName(infoarticlename);
    } else {
      const infoactivityname = xss(info.activityname);
      searchdata = await activitydata.getAllArticlesByActivityName(
        infoactivityname
      );
    }
    res.status(200).json(searchdata);
  } catch (e) {
    res.status(500).json(e);
  }
});

router
  .route("/id/comments/:id")
  .get(async (req, res) => {
    if (req.session && req.session.user)
      var currentUsername = req.session.user.name;
    else currentUsername = null;
    try {
      const article = await data.getArticleById(req.params.id);
      const comments = article.comments;
      var userList = [];
      for (const element of comments) {
        const userInfo = await userdata.getUserById(element.userId);
        const name = userInfo.firstname + " " + userInfo.lastname;
        var user = {
          currentUsername: currentUsername,
          userId: element.userId,
          username: name,
          comment: element.articleComment,
          timestamp: element.timestamp,
          commentId: element._id,
          reply: element.reply,
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
        if (!info.newCommentRating || !info.newCommentTxt)
          throw "Please provide all the input for createComment!";
        const infonewCommentRating = xss(info.newCommentRating);
        const infonewCommentTxt = xss(info.newCommentTxt);
        const comment = await commentdata.createComment(
          articleId,
          userInfo.userId,
          infonewCommentRating,
          infonewCommentTxt
        );
        res.status(200).json(comment);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    } else
      res
        .status(400)
        .render("function/Login", { error: "Log in to comment!!!" });
  });

router.route("/id/comments/reply/:id").post(async (req, res) => {
  if (req.session.user) {
    try {
      const userInfo = req.session.user;
      const info = req.body;
      const commentId = req.params.id;
      if (!info.newCommentTxt)
        throw "Please provide all the input for replyComment!";
      const replyToUser = await commentdata.getUserByCommentId(commentId);
      const comment =
        "@" +
        replyToUser.firstname +
        replyToUser.lastname +
        " " +
        info.newCommentTxt;
      const updated = await commentdata.replyComment(
        commentId,
        userInfo.userId,
        comment
      );
      res.status(200).json(updated);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else
    res
      .status(400)
      .render("function/Login", { error: "Log in to comment!!!" });
});

module.exports = router;

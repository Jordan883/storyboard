const express = require("express");
const router = express.Router();
const data = require("../data/articles");
const userdata = require("../data/users");
const familydata = require("../data/families");
const commentdata = require("../data/comments");
const { requiresAuth } = require('express-openid-connect');
const { auth_middleware }  = require('./auth_middleware');
const multer = require('multer')

var xss = require("xss");
const path = require('path')
const fs = require('fs')
const upload = multer({dest: './images/'})
router.use(upload.any())

router.get("/", auth_middleware, async (req, res) => {
    res.status(200).render("function/Articles_Menu", {
    });
});

router.post("/", auth_middleware, async (req, res) => {
    res.status(200).render("function/Articles_Menu", {
    });
});

router.get("/newArticle", auth_middleware, async (req, res) => {
    res.status(200).render("function/Articles", {
    });
});

router.post("/newArticle", auth_middleware, async (req, res) => {
    try {
      // get user info
      const email = req.oidc.user.email;
      const userInfo = await userdata.getByEmail(email);

      // get input
      const body = req.body;
      const title = xss(body.title);
      const content = xss(body.content);

      // get image url
      var newPath = undefined;
      if (req.files[0]){
        var extname = path.extname(req.files[0].originalname);
        var newPath = './public/images/' + title + extname;
        fs.rename(req.files[0].path, newPath, function(err){});
      }

      // insert article record
      const Article = await data.createArticle(
        userInfo.email,
        title,
        content,
        newPath,
      );
      res.status(200).render("function/myArticles", {});
    } catch (e) {
      res
        .status(500)
        .render("function/Appointment_Error", { error: e, title: "Error" });
    }
});

// delete article
router.get("/deleteArticle/:id", requiresAuth(), async (req, res) => {
    const article = await data.delete(req.params.id);
    res.render("function/myArticles", {});
});

// edit article
router.get("/editArticle/:id", requiresAuth(), async (req, res) => {
    const article = await data.get(req.params.id);
    const currentVersion = await data.getContent(req.params.id);
    res.render("function/EditArticle", {article: article, content: currentVersion});
});

router.post("/editArticle/:id", requiresAuth(), async (req, res) => {
    var body = req.body;

    // get input
    const content = xss(body.content);

    // get article infos
    const editInfo = await data.edit(req.params.id, content);
    res.render("function/myArticles", {});
});

// view history
router.get("/viewEditHistory/:id", requiresAuth(), async (req, res) => {
    articleId = req.params.id
    const history = await data.getAllVersions(articleId);

    res.render("function/ArticleEditHistory", {
            version: history,
            articleId: articleId,
        });
});

// restore history
router.post("/restoreVersion/:id", requiresAuth(), async (req, res) => {
    const msg = await data.restoreVersion(req.params.id);
    res.render("function/myArticles", {});
});

// view single article
router.get("/id/:id", requiresAuth(), async (req, res) => {
    try {
        const article = await data.get(req.params.id);
        const rating = (article.averageRating / 5) * 100;
        const currentVersion = await data.getContent(req.params.id);

        // get user info
        const email = req.oidc.user.email;
        const userInfo = await userdata.getByEmail(email);


        // check if the user is the author
        var isAuthor = false;
        if (article.poster == userInfo.email){
            var isAuthor = true
            };

        // check if the user if the author's parent
        var isParent = false;
        var family = await familydata.getFamilyById(userInfo.family)
        var parents = family.parents
        var isParent = parents.includes(userInfo._id.toString())

        // get author name ( we store author's email in article collection )
        const authorInfo = await userdata.getByEmail(article.poster);
        article.poster = authorInfo.name

        res.render("function/SingleArticle", {
            article: article,
            content: currentVersion,
            rating: rating,
            user: userInfo.name,
            isAuthor: isAuthor,
            isParent: isParent,
        });

    } catch (error) {
        res.status(500).json({ error: error });
    }
});


router.get("/id/comments/:id", requiresAuth(), async (req, res) => {

    // get user info
    const email = req.oidc.user.email;
    const userInfo = await userdata.getByEmail(email);
    if (userInfo)
      var currentUsername = userInfo.name;
    else currentUsername = null;
    try {
      const article = await data.get(req.params.id);
      const comments = article.comments;

      var userList = [];
      for (const element of comments) {

        const userInfoInner = await userdata.get(element.userId);
        const name = userInfoInner.name;
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

router.post("/id/comments/:id", requiresAuth(), async (req, res) => {

    // get user info
    const email = req.oidc.user.email;
    const userInfo = await userdata.getByEmail(email);

    if (userInfo) {
      try {
        const info = req.body;
        const articleId = req.params.id;
        if (!info.newCommentRating || !info.newCommentTxt)
          throw "Please provide all the input for createComment!";
        const text = xss(info.newCommentTxt);
        const rating = xss(info.rating);
        const userId = userInfo._id;

        const comment = await commentdata.createComment(
          articleId,
          userId,
          rating,
          text,
        );

        res.status(200).json(comment);
      } catch (error) {
        res.status(500).json({ error: error });
      }
    } else
      res
        .status(400)
        .render("function/Login", { error: "Log in to comment articles!!!" });
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
      .render("function/Login", { error: "Log in to comment articles!!!" });
});

module.exports = router;

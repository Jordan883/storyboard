const express = require("express");
const router = express.Router();
const data = require("../data/articles");
const userdata = require("../data/users");
const { requiresAuth } = require('express-openid-connect');
var xss = require("xss");

router.get("/", requiresAuth(), async (req, res) => {
    res.status(200).render("function/Articles_Menu", {
    });
});

router.post("/", requiresAuth(), async (req, res) => {
    res.status(200).render("function/Articles_Menu", {
    });
});

router.get("/newArticle", requiresAuth(), async (req, res) => {
    res.status(200).render("function/Articles", {
    });
});

router.post("/newArticle", requiresAuth(), async (req, res) => {
    try {
      var body = req.body;
      
      // get user info
      // const user = await userdata.getUserByEmail(req.session.user.email);
      
      // get input
      const title = xss(body.title);
      const content = xss(body.content);
      const image = xss(body.image)

      // get article infos
      const Article = await data.createArticle(
        // user.firstname.toString(),
        'DummyName',
        title,
        content,

        // image function
        image
      );
      res
        .status(200)
        .render("function/myArticles", {});
    } catch (e) {
      res
        .status(500)
        .render("function/Appointment_Error", { error: e, title: "Error" });
    }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const data = require("../data/articles");
const userdata = require("../data/users");
var xss = require("xss");

router.get("/", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    res.status(200).render("function/Articles_Menu", {
    });
  }
});

router.post("/", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    res.status(200).render("function/Articles_Menu", {
    });
  }
});

router.get("/newArticle", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    res.status(200).render("function/Articles", {
    });
  }
});

router.post("/newArticle", async (req, res) => {
  if (!req.session.user) {
    res.status(400).redirect("/users");
  } else {
    try {
      var body = req.body;
      
      // get user info
      const user = await userdata.getUserByEmail(req.session.user.email);
      
      // get input
      const title = xss(body.title);
      const content = xss(body.content);
      const image = xss(body.image)

      // get article infos
      const Article = await data.createArticle(
        user.firstname.toString(),
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
  }
});

module.exports = router;

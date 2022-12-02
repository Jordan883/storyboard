const express = require('express');
const router = express.Router();
const data = require('../data/comments');
const func = require('../data/functions');
var xss = require("xss");

router
  .route('/articles/comments')
  .get(async (req, res) => {
    try {
      const comments = await data.getAllComments();
      res.status(200).json(comments);
    } catch (e) {
      res.status(500).json(e);
    }
  })
  .post(async (req, res) => {
    try {
      let commentInfo = req.body;
      if (!commentInfo.articleId || !commentInfo.rating || !commentInfo.articleComment) throw 'please provide all inputs';
      const commentInfoarticleId = xss(commentInfo.articleId);
      const commentInforating = xss(commentInfo.rating);
      const commentInfoarticleComment = xss(commentInfo.articleComment);
      if (!func.checkId(commentInfoarticleId) || !func.checkRating(commentInforating) || !func.checkString(commentInfoarticleComment))
        res.status(400).json({ error: 'invalid inputs' });
      const comment = await data.createComment(
        commentInfoarticleId,
        commentInforating,
        commentInfoarticleComment
      );
      res.status(200).json(comment);
    } catch (e) {
      res.status(400).json(e);
    }
  });
  module.exports = router;
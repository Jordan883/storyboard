const express = require('express');
const router = express.Router();
const data = require('../data/comments');
// const func = require('../data/functions');
var xss = require("xss");

router.post(async (req, res) => {
  try {
    let commentInfo = req.body;
    if (!commentInfo.articleId || !commentInfo.articleComment) throw 'Please provide all inputs';
    const commentInfoarticleId = xss(commentInfo.articleId);
    const commentInfoarticleComment = xss(commentInfo.articleComment);
 // if (!func.checkId(commentInfoarticleId) || !func.checkString(commentInfoarticleComment))
 //    res.status(400).json({ error: 'invalid inputs' });
    const comment = await data.createComment(
      commentInfoarticleId,
      commentInfoarticleComment
    );
    res.status(200).json(comment);
  } catch (e) {
    res.status(400).json(e);
  }
});
module.exports = router;

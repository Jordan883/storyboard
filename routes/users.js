const { ObjectId } = require('mongodb');
const express = require('express');
const router = express.Router();
const userData = require('../data/users')

router.get('/:id', async (req, res) => {
  try {
    if(!ObjectId.isValid(req.params.id)) return res.status(400).json({error:"id is false"});
    let user = await userData.get(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(404).json({ error: 'user not found' });
  }
});


router.post('/', async (req, res) => {
  let userInfo = req.body;

  if (!userInfo) {
    res.status(400).json({ error: 'You must provide data to create a user' });
    return;
  }

  try {
    const newuser = await userData.create(
      userInfo.type, 
      userInfo.email, 
      userInfo.username,
      userInfo.password
    );
    res.status(200).json(newuser);
  } catch (e) {
    res.status(400).json({ error: e });
  }
});


router.delete('/:id', async (req, res) => {
  if(!ObjectId.isValid(req.params.id)) return res.status(400).json({error:"id is false"});
  try {
    await userData.get(req.params.id);
  } catch (e) {
    res.status(404).json({ error: 'user not found' });
    return;
  }

  try {
    await userData.delete(req.params.id);
    res.status(200).json({"userId": `${req.params.id}`, "deleted": true});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
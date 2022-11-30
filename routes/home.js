const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const { requiresAuth } = require('express-openid-connect');
const users = mongoCollections.users;

router.get('/', requiresAuth() , async (req, res) => {
    const userCollection=await users()
    const user = await userCollection.findOne({ email:req.oidc.user.email });
    if(user) res.status(200).render('home')
    else res.redirect('/users/register')
})



module.exports = router;
const express = require('express');
const router = express.Router();
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

router.get('/',async (req, res) => {
    if(req.oidc.isAuthenticated()){
        const userCollection=await users()
        const user = await userCollection.findOne({ email:req.oidc.user.email });
        if(user) res.status(200).render('Home')
        else res.status(200).redirect('/users/register')
    } 
    else res.status(200).redirect('/login')
})



module.exports = router;
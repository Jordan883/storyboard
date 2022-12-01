const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const userData = require('../data').users;

router.get('/', requiresAuth() , async (req, res) => {
    let user = null;
    try {
        user = await userData.getByEmail( req.oidc.user.email );
    } catch (e) {
        res.redirect('/users/register')
    }
    if(user) res.status(200).render('home')
})



module.exports = router;
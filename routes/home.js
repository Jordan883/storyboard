const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const userData = require('../data').users;

router.get('/', requiresAuth() , async (req, res) => {
    let user = null;
    try {
        user = await userData.getByEmail( req.oidc.user.email );
    } catch (e) {
        return res.redirect('/users/register');
    }
    if(user && req.session.user){
        return res.status(200).render('home');
    } else {
        return res.redirect('/users/twofa');
    }
})



module.exports = router;
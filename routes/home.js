const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const userData = require('../data').users;

router.get('/', requiresAuth() , async (req, res) => {
    const user = await userData.getByEmail( req.oidc.user.email );
    if(user) res.status(200).render('home')
    else res.redirect('/users/register')
})



module.exports = router;
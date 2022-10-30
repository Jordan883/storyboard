const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

router
    .route('/')
    .get((req, res) => {
        res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
    });

router
    .route('/profile')
    .get(requiresAuth(), (req, res) => {
        res.send(JSON.stringify(req.oidc.user));
    });

module.exports = router;
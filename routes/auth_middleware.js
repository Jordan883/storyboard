const auth_middleware = (req, res, next) => {
    if (!req.oidc.isAuthenticated()){
        return res.status(403).redirect('/login');
    } else if (!req.session.user) {
        return res.status(403).redirect('/users/twofa');
    }
    next();
}

module.exports = {
    auth_middleware
};
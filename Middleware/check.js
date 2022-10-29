module.exports = {

    checkLogin: function (req, res, next) {
        if (!req.session.user) {
            req.flash('error', 'You are logged in');
            return res.redirect('/signin');
        }
        next();
    },
    
    checkNotLogin: function (req, res, next) {
        if (req.session.user) {
            req.flash('error', 'You are logged in');
            return res.redirect('back');
        }
        next();
    }
};
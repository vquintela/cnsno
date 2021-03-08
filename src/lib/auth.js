module.exports = {
    isLoggedIn(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        return res.redirect('signin');
    },

    isAdmin(req, res, next) {
        if(req.isAuthenticated() && req.user.rol === 'admin') {
            return next();
        }
        return res.redirect('/');
    },

    isNotLoggedIn(req, res, next) {
        if(!req.isAuthenticated()) {
            return next();
        }
        return res.redirect('profile');
    }
};
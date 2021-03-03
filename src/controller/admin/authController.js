const passport = require('passport');

const signin = async (req, res) => {
    res.render('admin/auth/signin');
}

const login = async (req, res, next) => {
    if(!req.body.email.trim() || !req.body.password.trim()) {
        req.flash('error', 'Complete todos los campos')
        res.redirect('/admin/signin')
        return
    }
    passport.authenticate('local.signin', {
        successRedirect: 'profile',
        failureRedirect: 'signin',
        failureFlash: true
    })(req, res, next);
}

const logout = async (req, res) => {
    req.logOut();
    res.redirect('/admin/signin');
}

module.exports = {
    signin,
    login,
    logout
}
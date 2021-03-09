const passport = require('passport');

const signin = async (req, res) => {
    res.render('admin/auth/signin');
}

// LOCAL SIGNIN
const login = async (req, res, next) => {
    if(!req.body.email.trim() || !req.body.password.trim()) {
        req.flash('error', 'Complete todos los campos')
        res.redirect('/signin')
        return
    }
    passport.authenticate('local.signin', {
        successRedirect: '/admin/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
}

// GOOGLE SIGNIN
const authGoogle = (req, res, next) => {
    passport.authenticate('google', { scope:
        [ 'email', 'profile' ] }
    )(req, res, next);
}

const callbackGoogle = async (req, res, next) => {
    passport.authenticate( 'google', {
        successRedirect: '/cliente',
        failureRedirect: '/auth/google/failure',
    })(req, res, next);
}

// FACEBOOK SIGNIN
const authFacebook = async (req, res, next) => {
    passport.authenticate('facebook', {
        scope: ['email', 'public_profile'], session : false
    })(req, res, next);
}

const callbackFacebook = async (req, res, next) => {
    passport.authenticate('facebook', { 
        successRedirect: '/cliente',
        failureRedirect: '/login' 
    })(req, res, next);
}

// LOGOUT
const logout = async (req, res) => {
    req.logOut();
    res.redirect('/signin');
}

module.exports = {
    signin,
    login,
    logout,
    authGoogle,
    callbackGoogle,
    authFacebook,
    callbackFacebook
}
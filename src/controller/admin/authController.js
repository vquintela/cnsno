const passport = require('passport');
const generate = require('../../lib/generateId');
const mailer = require('../../lib/mailer');
const Usuario = require('../../models/Usuario');
const { recaptchaKeys } = require('../../lib/keys');
const fetch = require('node-fetch');

const signin = async (req, res) => {
    res.render('admin/auth/signin', {
        csrfToken: req.csrfToken(),
        captchaToken: recaptchaKeys.sitio
    });
}

// LOCAL SIGNIN
const login = async (req, res, next) => {
    const captcha = await validarCaptcha(req.body.captchaToken);
    if (!captcha) {
        req.flash('error', 'Captcha no validado')
        res.redirect('/signin')
        return
    }
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
        successRedirect: '/admin/profile',
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
        successRedirect: '/admin/profile',
        failureRedirect: '/login' 
    })(req, res, next);
}

// SIGNUP
const signup = (req, res) => {
    res.render('admin/auth/signup', {
        csrfToken: req.csrfToken(),
        captchaToken: recaptchaKeys.sitio
    });
}

const saveSignup = async (req, res) => {
    const usuario = req.body;
    const captcha = await validarCaptcha(req.body.captchaToken);
    if (!captcha) {
        return res.render('admin/auth/signup', { 
            error: 'Recaptcha Fallo',
            csrfToken: req.csrfToken(),
            usuario: usuario,
            captchaToken: recaptchaKeys.sitio
        });
    }
    if(usuario.password !== usuario.verificarPassword) {
        return res.render('admin/auth/signup', { 
            errorpassword: 'Las contraseñas no coinciden',
            csrfToken: req.csrfToken(),
            usuario: usuario,
            captchaToken: recaptchaKeys.sitio
        });
    }
    usuario.numAut = generate.name();
    const resp = await Usuario.addUsuarios(usuario);
    if (resp === 1) {
        mailer.signup(usuario.email ,usuario.nombre, usuario.apellido, usuario.numAut);
        req.flash('success', 'Usuario Registrado, verifique su email para terminar');
        res.redirect('/signin');
        return
    } else {
        res.render('admin/auth/signup', {
            e: resp,
            csrfToken: req.csrfToken(),
            usuario: usuario,
            captchaToken: recaptchaKeys.sitio
        })
        return;

    }
}

// LOGOUT
const logout = async (req, res) => {
    req.logOut();
    res.redirect('/signin');
}

// VERIFICACION EMAIL
const verificaEmail = async (req, res) => {
    const {email, id } = req.query;
    const emailUser = await Usuario.getUsuarioEmail(email);
    if(!emailUser) {
        res.render('admin/auth/verificacion', {valor: false, mensaje: 'Email no registrado'});
    } else {
        if(emailUser.numAut === id) {
            const newNum = generate.name();
            await Usuario.editUsuario({estado: true, numAut: newNum}, emailUser.id);
            res.render('admin/auth/verificacion', {valor: true, mensaje: `${emailUser.nombre}, ${emailUser.apellido}`});
        } else {
            res.render('admin/auth/verificacion', {valor: false, mensaje: 'Autenticación no valida'});
        }
    }
}

// RENEW PASS USER
const nuevoPass = async (req, res) => {
    const { email } = req.body;
    if (!email.trim()) {
        req.flash('error', 'Ingrese su email por favor');
        return res.status(200).json('Ok');
    }
    let user = await Usuario.getUsuarioEmail(email);
    if(user) {
        user.password = generate.name();
        mailer.renew(user.email, user.nombre, user.apellido, user.password);
        await Usuario.editPass(user.password, user.id);
        req.flash('success', 'Se le a enviado a su email la nueva password');
        res.status(200).json('Ok');
    } else {
        req.flash('error', 'Usuario no Registrado, registrese por favor');
        res.status(200).json('Ok');
    }
}

const validarCaptcha = async (token) => {
    if (!token) return false;
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaKeys.secret}&response=${token}`;
    const body = await fetch(verifyURL).then((res) => res.json());
    if (body.success !== undefined && !body.success) return false;
    if (body.score < 0.5) return false;
    return true;
}

module.exports = {
    signin,
    login,
    logout,
    authGoogle,
    callbackGoogle,
    authFacebook,
    callbackFacebook,
    signup,
    saveSignup,
    verificaEmail,
    nuevoPass
}
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const Usuario = require('../models/Usuario');
const helpers = require('../lib/password');
const { googleKeys } = require('./keys');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await Usuario.getUsuarioEmail(email);
    if(user){
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.nombre));
        } else {
            done(null, false, req.flash('error', 'Usuario o Password Incorrecta'));
        }
    } else {
        done(null, false, req.flash('error', 'Usuario o Password Incorrecta'));
    }
}));

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: googleKeys.clientID,
      clientSecret: googleKeys.clientSecret,
      callbackURL: "/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      console.log(profile);
      const data = {
        nombre: profile.given_name,
        apellido: profile.family_name,
        email: profile.email,
        oauthId: profile.id,
      };
      const user = await Usuario.findOrCreate(data);
      console.log(user)
      return done(null, user[0]);
    }
  )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await (await Usuario.getUserPK(id)).toJSON()
    done(null, user);
});
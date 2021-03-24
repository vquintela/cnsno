const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const Usuario = require('../models/Usuario');
const helpers = require('../lib/password');
const { googleKeys, facebookKeys } = require('./keys');

// LOCAL SIGNIN
passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await Usuario.getUsuarioEmail(email);
    if(user){
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword && user.estado) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.nombre));
        } else {
            done(null, false, req.flash('error', 'Usuario o Password Incorrecta'));
        }
    } else {
        done(null, false, req.flash('error', 'Usuario o Password Incorrecta'));
    }
}));

// GOOGLE SIGIN
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
      const data = {
        nombre: profile.given_name,
        apellido: profile.family_name,
        email: profile.email,
        oauthId: profile.id,
      };
      const user = await Usuario.findOrCreate(data);
      return done(null, user[0]);
    }
  )
);

// FACEBOOK SIGNIN
passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: facebookKeys.clientID,
      clientSecret: facebookKeys.clientSecret,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "name", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile._json.id);
      const data = {
        nombre: profile._json.first_name,
        apellido: profile._json.last_name,
        email: profile._json.email,
        oauthId: profile._json.id,
      };
      const user = await Usuario.findOrCreate(data);
      return done(null, user[0]);
    }
  )
);

// SERIALIZE AND DESERIALIZE USER
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await (await Usuario.getUserPK(id)).toJSON()
    done(null, user);
});
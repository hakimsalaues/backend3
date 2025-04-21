const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/user');

// Local strategy (login vía email + password)
passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user || !user.isValidPassword(password)) {
        return done(null, false, { message: 'Credenciales inválidas' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// JWT strategy
passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secret_key'
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.sub).populate('cart');
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
));

module.exports = passport;
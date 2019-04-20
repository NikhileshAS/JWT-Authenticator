const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");

const tokenKey = require("../config/keys").tokenKey;

const User = mongoose.model("users");
const options = {};
options.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey = tokenKey;

module.exports = passport => {
  passport.use(
    new JWTStrategy(options, (payload, done) => {
      User.findById(payload.id)
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        .catch(error => console.log(error));
    })
  );
};

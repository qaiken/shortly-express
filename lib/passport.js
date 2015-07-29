var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var util = require('./utility');
var tokens = require('./tokens');

passport.use(new FacebookStrategy({
    clientID: tokens.clientID,
    clientSecret: tokens.clientSecret,
    callbackURL: "http://localhost:4568/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    util.findOrCreateUser(profile.displayName,profile.id)
    .then(function(model) {
      done(null,model);
    });
  }
));

passport.serializeUser(function(user,done) {
  done(null,user.get('fb_id'));
});

passport.deserializeUser(function(fb_id,done) {
  util.findUserById(fb_id)
  .then(function(model) {
    done(null,model);
  });
});

module.exports = passport;
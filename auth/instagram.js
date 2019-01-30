var passport = require('passport');
var InstagramStrategy = require('passport-instagram');

var User = require('../db/schema/user');
var config = require('./config');
var init = require('./init');

passport.use(new InstagramStrategy({
    clientID: config.instagram.clientID,
    clientSecret: config.instagram.clientSecret,
    callbackURL: config.instagram.callbackURL
  },
  // linkedin sends back the tokens and progile info
  function(accessToken, refreshToken, profile, done) {
    console.log(profile);
    var profile = profile._json.data;
    var userDB;

    var searchQuery = {
      instagramId: profile.id
    };

    var updates = {
      instagramId: profile.id,
      username: profile.username,
      profile_picture: profile.profile_picture
    };

    var options = {
      upsert: true,
      new: true
    };

    // update the user if s/he exists or add a new user
    User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
      if (err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });

  }
));

// serialize user into the session
init();


module.exports = passport;
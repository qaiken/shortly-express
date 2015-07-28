var request = require('request');
var bcrypt = require('bcrypt');
var session = require('express-session');
var User = require('../app/models/user');


exports.getUrlTitle = function(url, cb) {
  request(url, function(err, res, html) {
    if (err) {
      console.log('Error reading url heading: ', err);
      return cb(err);
    } else {
      var tag = /<title>(.*)<\/title>/;
      var match = html.match(tag);
      var title = match ? match[1] : url;
      return cb(err, title);
    }
  });
};

var rValidUrl = /^(?!mailto:)(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[0-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))|localhost)(?::\d{2,5})?(?:\/[^\s]*)?$/i;

exports.isValidUrl = function(url) {
  return url.match(rValidUrl);
};

/************************************************************/
// Add additional utility functions below
/************************************************************/
exports.ensureAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

exports.checkActiveSession = function(req, res, next) {
  if (req.isAuthenticated()) { return res.redirect('/'); }
  next();
};

exports.findUserById = function(fb_id) {
  return new User({'fb_id': fb_id}).fetch();
};

exports.findOrCreateUser = function(username,fb_id) {
  return new User({'user_name': username, 'fb_id': fb_id}).fetch()
  .then(function(model) {
    if(!model) {
      return new User({'user_name': username, 'fb_id': fb_id}).save();
    }
    return model;
  });
};

var express = require('express');
var passport = require('passport');
var session = require('express-session');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var User = require('../models/user');

var app = express();
var localStrategy = require('passport-local').Strategy;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(session({
  secret:'secret',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure:false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

///////////////////////////////////////
//////////MONGO THINGS/////////////////
///////////////////////////////////////

var mongoURI = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pawfinder' ;
var mongoDB = mongoose.connect(mongoURI).connection;

///////////////////////////////////////
/////////////Passport//////////////////
///////////////////////////////////////

passport.serializeUser(function(user, done){
  console.log('Serialize ran');

  console.log(user.id, user._id);
  done(null, user.id);
});

passport.deserializeUser(function(user, done){
  console.log('Deserialize ran');

  User.findById(user.id, function(err, user){
    if(err) {
      done(err);
    }
    done(null, user);
  });
});

passport.use('local', new localStrategy({
  passReqToCallback: true, usernameField: 'username'},
    function(req, username, password, done){
      User.findOne({username: username}, function(err, user){
        if(err){
          console.log(err);
        }
        if(!user){
          return done(null, false);
        }

        user.comparePassword(password, function(err, isMatch){
          if(err){
            console.log(err);
          }
          if(isMatch){
            done(null, user);
          } else {
            done(null, false);
          }
        });
      });

}));

app.set("port", process.env.PORT || 5000);

var server = app.listen(app.get('port'), function(){
  var port = server.address().port;
  console.log('Listening on port', app.get('port'));
});

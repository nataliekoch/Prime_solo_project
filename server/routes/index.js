var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../../models/user');

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

router.get('/login',function(request, response){
	response.sendFile(path.join(__dirname, '../../public/views/login.html'));
})

router.get('/success', function(request, response){
	response.send(request.user);
});

router.get('/failure', function(request, response){
	response.send(request.user);
});

router.get('/register', function(request, response){
	response.sendFile(path.join(__dirname, '../../public/views/signUp.html'));
});

router.get('/searchPage', function(request, response){
	response.send('searchPage');
});

router.post('/', passport.authenticate('local', {
	successRedirect: '/searchPage', failureRedirect:'/failure'
}));

router.post('/newUser', function(request, response){
	User.create(request.body, function(err, post){
		if(err) {
			console.log(err);
		} else {
			response.redirect('/success');
		}
	});
});

module.exports = router;

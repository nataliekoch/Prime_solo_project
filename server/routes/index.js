var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../../models/user');

// TODO: REFACTOR TO REMOVE REDUNDENCES//
router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

router.get('/profile', function(request, response){
  response.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

router.get('/login',function(request, response){
	response.sendFile(path.join(__dirname, '../../public/views/index.html'));
})

router.get('/success', function(request, response){
	response.send(request.user);
});

router.get('/failure', function(request, response){
	response.send(request.user);
});

router.get('/signUp', function(request, response){
	response.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

router.get('/searchPage', function(request, response){
	response.sendFile(path.join(__dirname, '../../public/views/index.html'));
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

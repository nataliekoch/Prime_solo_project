var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var User = require('../../models/user');

router.get('/', function(request, response){
  response.sendFile(path.join(__dirname, '../../public/views/index.html'));
});

module.exports = router;

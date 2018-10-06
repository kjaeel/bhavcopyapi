var express = require('express')
var router = express.Router()
var userController = require('./controller')
var  util = require('../util.js')
var uniqid = require('uniqid');
var userModel = require('./model')

router.use('/', function (req, res, next) {
  console.log( req.method +' ' + req.originalUrl)
  next()
})

router.get('/', function (req, res) {
  res.send('Welcome to home automation REST api server')
})

router.get('/getUserKnx', function (req, res) {
	userModel.getUser().then(function(success){
		res.send(success)
	},function(error) {
		res.send(faliure)
	})
})

router.get('/userInput/:id', function (req, res) {
	var id = req.params.id;
	if(!util.isEmpty(req.query)){
		var text = req.query.text?req.query.text:false;
	}else{
		var text = false
	}
	var requstObj = {
		alexaUserId : id,
		text : text
	}  
	console.log(requstObj);
	userController.userInput(requstObj).then(function (success) {
		res.send(success)
	},function (faliure) {
		res.send(faliure)
	})
})

router.post('/upload', function(req, res) {
	var id = uniqid();
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let knxFile = req.files.knxFile;
 
  // Use the mv() method to place the file somewhere on your server
  knxFile.mv(__dirname+'/userFile/'+id+'.json', function(err) {
    if (err){
			return res.status(500).send(err);
		}else{
			userController.knxUpload(id).then(function (success) {
					console.log("All Done.");
					res.send(success);
			},function (faliure) {
				res.send(faliure)
			})
		}
  });
});

module.exports = router
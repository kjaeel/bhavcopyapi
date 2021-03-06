var express = require('express')
var router = express.Router()
var userController = require('./controller')
var  util = require('../util.js')

router.use('/', function (req, res, next) {
  console.log( req.method +' ' + req.originalUrl)
  next()
})

router.get('/', function (req, res) {
  res.send('Welcome to home vedant margdarshak REST api server')
})

router.get('/fetchDailyBhavCopy', function (req, res) {
  userController.fetchDailyBhavCopy().then(function (success) {
      console.log("All Done.");
      res.send(success);
  },function (faliure) {
      res.send(faliure)
  })
})

module.exports = router

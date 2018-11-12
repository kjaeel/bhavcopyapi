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
  userController.fetchDailyBhavCopy(req.query.day).then(function (success) {
      console.log("All Done.");
      res.send(success);
  },function (faliure) {
      res.send(faliure)
  })
})

router.get('/getBhavCopy', function (req, res) {
  userController.getBhavCopy().then(function (success) {
      res.send(success);
  },function (faliure) {
      res.send(faliure)
  })
})

router.get('/populateContractTables', function (req, res) {
  userController.populateContractTables().then(function (success) {
      res.send(success);
  },function (faliure) {
      res.send(faliure)
  })
})

router.get('/getContracts', function (req, res) {
  userController.getContracts().then(function (success) {
      res.send(success);
  },function (faliure) {
      res.send(faliure)
  })
})

router.post('/getChart', function (req, res) {
  var reqObject = req.body;
  userController.getChart(reqObject).then(function (success) {
      res.send(success);
  },function (faliure) {
      res.send(faliure)
  })
})

router.post('/savePortfolio', function (req, res) {
    var reqObject = req.body;
    userController.savePortfolio(reqObject).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
});

router.get('/getPortfolio', function (req, res) {
    var user_id = req.query.user_id;
    userController.getPortfolio(user_id).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
});

router.post('/updatePortfolio', function (req, res) {
    var reqObject = req.body;
    userController.updatePortfolio(reqObject).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
});

router.post('/getMacd', function (req, res) {
    var reqObject = req.body;
    userController.getMacd(reqObject).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
})

router.post('/getStochastic', function (req, res) {
    var reqObject = req.body;
    userController.getStochastic(reqObject).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
})
module.exports = router

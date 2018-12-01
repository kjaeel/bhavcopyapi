var express = require('express')
var router = express.Router()
var userController = require('./controller')
var  util = require('../util.js')
var verifyToken 	 = require('../verify-token');
var jwt    			 = require('jsonwebtoken');

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
  userController.getContracts(req.query).then(function (success) {
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
    userController.getMacd(reqObject.data).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
})

router.post('/getStochastic', function (req, res) {
    var reqObject = req.body;
    userController.getStochastic(reqObject.data).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
})

router.post('/saveUser', function (req, res) {
    var reqObject = req.body;
    userController.saveUser(reqObject).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
})

router.get('/getUser', verifyToken ,function (req, res) {
    var user_id = req.query.user_id;
    userController.getUser(user_id).then(function (success) {
        res.send(success);
    },function (faliure) {
        res.send(faliure)
    })
});

router.post('/login', function (req, res) {
	var userDetails = req.body || null;	// user details data in POST Request body
	userController.login(userDetails)
	.then(function success(result) {
		try{
			var dateObj = new Date();
	        var expires = dateObj.getTime() + 86400*1000; // expire after 24 hour
	        var sercet = util.jwt_secret;
	        var token = jwt.sign(JSON.stringify(result),sercet);
		}catch(e){
            console.log("exception :",e);
            res.send(e);
		}
		res.setHeader('authToken',token);
		res.send(result);
	}, function failure (err) {
		res.send(err);
	});
});
module.exports = router

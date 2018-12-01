var utils           = require('./util');
var jwt             = require('jsonwebtoken');

module.exports = function(req,res,next) {
  var token = req.body.token || req.query.token || req.headers['authtoken'];
    if (token) {
    // verifies secret and checks exp
        jwt.verify(token,utils.jwt_secret, function(err, decoded) {
            if (err) { //failed verification.
                message = { 
                    "error": true,
                    "msg" : "invalid token"
                }
                utils.jsonWriter(message, 200, res);
            }
            req.decoded = decoded;
            next(); //no error, proceed
        });
    } else {
        // forbidden without token
        console.log("Token required!!!");
        message = { 
                    "error": true,
                    "msg" : "Token required"
                }
        utils.jsonWriter(message, 403, res);
    }
}
var Q = require('q');
var  config = require('../config')
var mysql = require('mysql');
var moment = require('moment');
var utils = require('../util');
const uuidv5 = require('uuid/v5');

// save user details
var saveUser = function (userDetails) {
  var deferred = Q.defer();
  var connection = mysql.createConnection(config.mysql);
  connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      //Make SQL statement:
      var query = "SELECT user_id FROM `user` WHERE email = ?";
      var mobile = null, email = null, password = null;
      if(userDetails && userDetails.email) {
        email = utils.encryptAES(userDetails.email);
      }
      if(userDetails.password) password = utils.encryptAES(userDetails.password);//Make an array of values:
      var values = email;
      //Execute the SQL statement, with the value array:
      connection.query(query,values, function (err, result) {
          if (err){
              console.log(err);
              connection.end(function(err) {
                           // The connection is terminated now
                          console.log("Connection is terminated now.");
                          deferred.reject("error occured");
              }); 
          }else{
            if(result && !result.length){
              var plan_start_date = null;
              var plan_expire_date = null;
              var created_at = null;
              if(userDetails.plan_start_date) plan_start_date = new Date(userDetails.plan_start_date);
              if(userDetails.plan_expire_date) plan_expire_date = new Date(userDetails.plan_expire_date);
              if(userDetails.created_at)  created_at = new Date(userDetails.created_at);

              var userDetailsObj = [];
              userDetails["user_id"] = uuidv5(userDetails.name, utils.uuidKey);
              userDetailsObj.push(userDetails.user_id);
              userDetailsObj.push(userDetails.name);
              userDetailsObj.push(email);
              userDetailsObj.push(userDetails.mobile);
              userDetailsObj.push(password);
              userDetailsObj.push(userDetails.plan_name?userDetails.plan_name:null);
              userDetailsObj.push(userDetails.plan_start_date?userDetails.plan_start_date:null);
              userDetailsObj.push(userDetails.plan_expire_date?userDetails.plan_expire_date:null);
              userDetailsObj.push(new Date());
              var insertUser = "INSERT INTO `user`(`user_id`, `name`, `email`, `mobile`, `password`, `plan_name`, `plan_start_date`, `plan_expire_date`, `created_at`) VALUES (?,?,?,?,?,?,?,?,?)"
              connection.query(insertUser,userDetailsObj, function (err, result) {
                if (err) {
                  console.log(err);
                  connection.end(function(err) {
                               // The connection is terminated now
                              console.log("Connection is terminated now.");
                              deferred.reject(err);
                  });
                } else {
                  connection.end(function(err) {
                    // The connection is terminated now
                   console.log("Connection is terminated now.");
                   deferred.resolve(result);
                  });
                }
              }); 
            }else{
              connection.end(function(err) {
                // The connection is terminated now
               console.log("Connection is terminated now.");
               deferred.reject("user already exist");
              });
            }
          }
      });
  });
  return deferred.promise;
};

var getUser = function(user_id) {
    var deferred = Q.defer();
    var query = "SELECT * FROM `user` WHERE user_id = ?";
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:

        //Execute the SQL statement, with the value array:
        connection.query(query,[user_id], function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                             // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.reject("error occured");
                }); 
            }else{
                //console.log("Number of records inserted: " + result.affectedRows);
                connection.end(function(err) {
                            // The connection is terminated now
                            console.log("Connection is terminated now.");
                            
                            delete result[0].password
                            result[0].email = utils.decryptAES(result[0].email);
                            deferred.resolve(result)
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}

// update user details
// var updateUser = function (userDetails) {
//  var deferred = Q.defer();
//  var id = userDetails.id;
 
//   if(result.birthDate){
//     var date = moment(result.birthDate).format('L');
//     result._doc.birthDate = date;
//   }


 
//    return deferred.promise;
// };

var userLogin = function(userDetails){
  var deferred = Q.defer();
  email = utils.encryptAES(userDetails.email);
  userDetails.email = email;
  password = utils.encryptAES(userDetails.password);
  userDetails.password = password;
  var query = "SELECT * FROM `user` WHERE email = ? and password = ?";
  var connection = mysql.createConnection(config.mysql);
  connection.connect(function(err) {
      if (err) throw err;
      console.log("Connected!");
      //Make SQL statement:

      //Execute the SQL statement, with the value array:
      connection.query(query,[userDetails.email,userDetails.password], function (err, result) {
          if (err){
              console.log(err);
              connection.end(function(err) {
                            // The connection is terminated now
                          console.log("Connection is terminated now.");
                          deferred.reject("error occured");
              }); 
          }else{
              //console.log("Number of records inserted: " + result.affectedRows);
              connection.end(function(err) {
                  // The connection is terminated now
                  console.log("Connection is terminated now.");
                  if(result && result.length){
                    delete result[0].password
                    result[0].email = utils.decryptAES(result[0].email);
                    deferred.resolve(result)
                  }else{
                    deferred.reject("Invalid Credentials.")
                  }
              }); 
          }
      });
  }); 
  return deferred.promise;
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

var resetPassword = function (resetPasswordDetails) {
  var deferred = Q.defer();
  resetPasswordDetails.password = utils.encryptAES(resetPasswordDetails.password);
  User.update({'_id' : resetPasswordDetails.userId},{ $set: {password: resetPasswordDetails.password}}, function(err, result) {
     if (err) {
       deferred.reject(err);
     } else {
       deferred.resolve(result);
     }
   }); 
    return deferred.promise;
 };

// exports section
exports.saveUser = saveUser;
exports.getUser = getUser;
//exports.updateUser = updateUser;
exports.userLogin = userLogin;
exports.resetPassword = resetPassword;
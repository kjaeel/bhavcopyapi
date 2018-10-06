var Q = require('q');
const mongoose = require('mongoose');
var moment = require('moment');

const Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema({
  "name": { type: String },
  "alexaUserId" : { type: String },
  "email": { type: String },
  "validity": { type: Date },
  "localstore": { type: Boolean },
  "Role": { type: String  },
  "knxip": { type: String },
  "knxport": { type: String },
  "readcycle": { type: Boolean },
  "readcycleduration": { type: Number },
  "mindimval": { type: Number },
  "maxdimval": { type: Number },
  "showrelative": { type: Boolean},
  "rooms" : { type : Array, default : [] }
},
{
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
//Transform
userSchema.options.toJSON.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};
userSchema.options.toObject.transform = function (doc, ret, options) {
  // remove the _id of every document before returning the result
  ret.id = ret._id;
  delete ret._id;
  delete ret.__v;
};

// model creation for user schema
var User = mongoose.model('users', userSchema);

// save user details
var saveUser = function (userDetails) {
  var deferred = Q.defer();
  var query = User.find();
  var mobile = null, email = null, password = null;
  if(userDetails && userDetails.validity){
    try{
      userDetails.validity = moment(userDetails.validity, "DD-MM-YYYY").format();                          // 2018-08-16T13:58:27+05:30
    }
    catch(error){
      console.error(error);    
    }
  }
  
  if(userDetails && userDetails.email) {

    //email = utils.encryptAES(userDetails.email);
    email = userDetails.email
    query.where('email').eq(email);
  }
  //if(userDetails.phoneNo) mobile = utils.encryptAES(userDetails.phoneNo);
  //if(userDetails.password) password = utils.encryptAES(userDetails.password);
  query.exec()
  .then(function (result) {
    if(result && !result.length){
      var userDetailsObj = {
      // required parameters
      "name": userDetails.name,
      "alexaUserId" : userDetails.alexaUserId,
      "email": userDetails.email,
      "validity": userDetails.validity,
      "localstore": userDetails.localstore,
      "Role": userDetails.Role,
      "knxip": userDetails.knxip,
      "knxport": userDetails.knxport,
      "readcycle": userDetails.readcycle,
      "readcycleduration": userDetails.readcycleduration,
      "mindimval": userDetails.mindimval,
      "maxdimval": userDetails.maxdimval,
      "showrelative": userDetails.showrelative,
      "rooms" : userDetails.rooms
      };

      var userObj = new User(userDetailsObj);

      userObj.save(function (err) {
        if (err) {
          deferred.reject(err);
        } else {
          delete userObj._doc.__v;
          // if(userObj.email){
          //   var emailDcrypt = utils.decryptAES(userObj.email)
          //   userObj.email = emailDcrypt;
          // }
          // if(userObj.phoneNo){
          //   var phoneNo = utils.decryptAES(userObj.phoneNo)
          //   userObj.phoneNo = phoneNo;
          // }
          deferred.resolve(userObj);
        }
      }); 
    }else{
      //update existing record
      console.log("user already exist now updating.")
      updateUser(userDetails).then(function(success) {
        deferred.resolve(success);        
      },function(faliure) {
        deferred.reject(faliure)
      })
    }
  }, function (err) {
    deferred.reject(err);
  });

  return deferred.promise;
};

var getUser = function(userDetails) {
  var deferred = Q.defer();
  var query = User.find();
  if(userDetails && userDetails.alexaUserId) {
    var alexaUserId = userDetails.alexaUserId;//utils.encryptAES(userDetails.email);
    query.where('alexaUserId').eq(alexaUserId);
  }
query.exec()
.then(function (result) {
  if(result && result.length){
    deferred.resolve(result);
  }else{
    deferred.resolve(false);
  }
  
}, function (err) {
  deferred.reject(err);
});
return deferred.promise;
}

// update user details
var updateUser = function (userDetails) {
  var deferred = Q.defer();
 //  var id = userDetails.id;
 //  console.log("delete id :",delete userDetails.id);
 //  var hex = /[0-9A-Fa-f]{6}/g;
 //  id = (hex.test(id))? mongoose.Types.ObjectId(id) : id;
 //  if(userDetails.phoneNo){
 //     userDetails.phoneNo = utils.encryptAES(userDetails.phoneNo);
 //  } 
 //  if(userDetails.email){
 //     userDetails.email = utils.encryptAES(userDetails.email);
 //  }
  User.findOneAndUpdate({'email' : userDetails.email },{$set : userDetails}, {new: true}, function(err, result) {
     if (err) {
       deferred.reject(err);
     } else {
       // if(result.email){
       //   var emailDcrypt = utils.decryptAES(result.email)
       //   result._doc.email = emailDcrypt;
       // }
       delete result._doc.__v;
       deferred.resolve(result);
     }
   }); 
    return deferred.promise;
 };

// exports section
exports.saveUser = saveUser     ;
exports.getUser = getUser;
exports.updateUser = updateUser;

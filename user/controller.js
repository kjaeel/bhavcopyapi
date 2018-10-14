var userService = require('./service')
var Q = require('q');
var  util = require('../util.js')

exports.fetchDailyBhavCopy = function () {
	var deferred = Q.defer();
	userService.fetchDailyBhavCopy().then(function (success) {
		var response = {
			status :200,
			message:success
		}
		deferred.resolve(response)
	},function (faliure) {
		var response = {
			status :401,
			message:faliure
		}
		deferred.reject(response)
	})
	return deferred.promise;
};

exports.getBhavCopy = function(){
    var deferred = Q.defer();
	userService.getBhavCopy().then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}
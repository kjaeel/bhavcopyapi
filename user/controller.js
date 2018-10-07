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
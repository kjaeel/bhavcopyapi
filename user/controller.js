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

exports.populateContractTables = function () {
	var deferred = Q.defer();
	userService.populateContractTables().then(function (success) {
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

exports.getContracts = function () {
	var deferred = Q.defer();
	userService.getContracts().then(function (success) {
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

exports.getChart = function (reqObject) {
	var deferred = Q.defer();
	//validations!!!!
	if(!reqObject.id){
		var response = {
			status :403,
			message:'Param "id" missing or invlaid'
		}
		deferred.reject(response);
	}
	if(!reqObject.symbol){
		var response = {
			status :403,
			message:'Param "symbol" missing or invlaid'
		}
		deferred.reject(response);
	}
	if(!reqObject.contractType){
		var response = {
			status :403,
			message:'Param "contractType" missing or invlaid'
		}
		deferred.reject(response);
	}
	userService.getChart(reqObject).then(function (success) {
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

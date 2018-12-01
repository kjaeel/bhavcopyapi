var userService = require('./service')
var Q = require('q');
var  util = require('../util.js')

exports.fetchDailyBhavCopy = function (day) {
	var deferred = Q.defer();
	userService.fetchDailyBhavCopy(day).then(function (success) {
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

exports.getContracts = function (reqObj) {
	var deferred = Q.defer();
	if(!reqObj.contractId){
		var response = {
			status :403,
			message:'Param "contractId" missing or invlaid'
		}
		deferred.reject(response);
	}
	userService.getContracts(reqObj.contractId).then(function (success) {
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

exports.savePortfolio = function (reqObject) {
	var deferred = Q.defer();
	if(!reqObject.symbol){
		var response = {
			status :403,
			message:'Param "symbol" missing or invlaid'
		}
		deferred.reject(response);
	}
	if(!reqObject.edate){
		var response = {
			status :403,
			message:'Param "edate" missing or invlaid'
		}
		deferred.reject(response);
	}
	if(!reqObject.user_id){
		var response = {
			status :403,
			message:'Param "user_id" missing or invlaid'
		}
		deferred.reject(response);
	}
	userService.savePortfolio(reqObject).then(function (success) {
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

exports.getPortfolio = function (user_id) {
	var deferred = Q.defer();
	//validations!!!!
	if(!user_id){
		var response = {
			status :403,
			message:'Param "user_id" missing or invlaid'
		}
		deferred.reject(response);
	}

	userService.getPortfolio(user_id).then(function (success) {
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

exports.updatePortfolio = function (reqObject) {
	var deferred = Q.defer();
	//validations!!!!
	if(!reqObject.symbol){
		var response = {
			status :403,
			message:'Param "symbol" missing or invlaid'
		}
		deferred.reject(response);
	}
	if(!reqObject.user_id){
		var response = {
			status :403,
			message:'Param "user_id" missing or invlaid'
		}
		deferred.reject(response);
	}
	if(!reqObject.target){
		var response = {
			status :403,
			message:'Param "target" missing or invlaid'
		}
		deferred.reject(response);
	}
	userService.updatePortfolio(reqObject).then(function (success) {
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

exports.getMacd = function(reqObject){
	var deferred = Q.defer();
	reqObject.forEach(element => {
		if(!element.average1){
			var response = {
				status :403,
				message:'Param "average1" missing or invlaid'
			}
			deferred.reject(response);
		}
		if(!element.average3){
			var response = {
				status :403,
				message:'Param "average3" missing or invlaid'
			}
			deferred.reject(response);
		}
	});
	
	userService.getMacd(reqObject).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

exports.getStochastic = function(reqObject){
    var deferred = Q.defer();
	userService.getStochastic(reqObject).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

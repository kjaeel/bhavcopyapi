var Q = require('q');
var uniqid = require('uniqid');
var userModel = require('./model')
var fs = require('fs');
var request = require('request');

var dialougeFolowService = require('../service/dialougeFlowService')

exports.userInput = function(requstObj){
 var deferred = Q.defer();
 var sessionId = uniqid();
 //console.log(JSON.stringify(appliances));
 userModel.getUser(requstObj).then(function(success){
	try{
		if(success && success.length){
			dialougeFolowService.DialougeFlow(sessionId,requstObj.text).then(function(success) {
				deferred.resolve({'resolvedQuery' :  success.resolvedQuery,'parameters' : success.parameters})
			},function(faliure) {
				console.log("faliure-------------->",faliure);
				deferred.reject(faliure)
			})
			// var appliances = success[0].rooms[0].appliances;
			// var applianceEntries = [];
			// var commandEntries = [];
			// for(var i = 0 ; i < appliances.length ; i++){
			// 	applianceEntries.push( {
			// 		value: appliances[i].name.toLowerCase(),
			// 		synonyms: [appliances[i].name,appliances[i].name.toUpperCase()]
			// 	})
			// 	for(var j = 0 ; j < appliances[i].commands.length ; j++){
			// 		var splitCommand = appliances[i].commands[j].command
			// 		var subCommand;
			// 		var trueCommand;
			// 		var falseCommand;
			// 		if(splitCommand.includes("/")){
			// 			if( splitCommand.includes(" ")){
			// 				splitCommand = splitCommand.split(" ");
			// 				subCommand = splitCommand[1].split("/")
			// 				trueCommand = splitCommand[0] + ' ' +subCommand[0];
			// 				falseCommand =  splitCommand[0] + ' ' +subCommand[1]
			// 			}else{
			// 				splitCommand = splitCommand.split("/")
			// 				trueCommand = splitCommand[0];
			// 				falseCommand =  splitCommand[1];
			// 			}
			// 			commandEntries.push( {
			// 				value: trueCommand.toLowerCase(),
			// 				synonyms: [trueCommand,trueCommand.toUpperCase()]
			// 			})
			// 			commandEntries.push( {
			// 				value: falseCommand.toLowerCase(),
			// 				synonyms: [falseCommand,falseCommand.toUpperCase()]
			// 			})
			// 		}else{
			// 			commandEntries.push( {
			// 				value: splitCommand.toLowerCase(),
			// 				synonyms: [splitCommand,splitCommand.toUpperCase()]
			// 			})
			// 		}				
			// 	}
			// }
			
	
			// var traininAppliance = {
			// 	name : "appliance",
			// 	entries : applianceEntries
			// }
			// dialougeFolowService.userEntities(sessionId,traininAppliance).then(function(success) {
			// 	var trainingCommand = {
			// 		name : "command",
			// 		entries : commandEntries
			// 	}
			// 	dialougeFolowService.userEntities(sessionId,trainingCommand).then(function(success) {
					
			// 		dialougeFolowService.DialougeFlow(sessionId,requstObj.text).then(function(success) {
			// 			//console.log("Callback to plainText :",JSON.stringify(success));
			// 			deferred.resolve({'resolvedQuery' :  success.resolvedQuery,'parameters' : success.parameters})
			// 		},function(faliure) {
			// 			deferred.reject(faliure)
			// 		})
			// 	},function(faliure) {
			// 		deferred.reject(faliure)
			// 	})
			// 	//deferred.resolve(success)
			// },function(faliure) {
			// 	deferred.reject(faliure)
			// })
		}else{
			let err = new Error("User not found.");
			deferred.reject(err);

		}
		
	}catch(error){
		console.log(error);
	}
 },function(error){
	deferred.reject(faliure)
 })
 return deferred.promise;
}

exports.knxUpload = function(requstObj,sessionId,id,newApplianceEntities,newCommandEntities){
	var deferred = Q.defer();
	if(!sessionId){
		sessionId = uniqid();
	}

	userModel.saveUser(requstObj).then(function(success) {
		console.log("Done.")
		fs.unlink(__dirname+'/userFile/'+id+'.json', function(error) {
		    if (error) {
		        throw error;
        		deferred.reject(error);
			}
			var response = {"status":{
		        "code": 200,
		        "errorType": "success"
		    }
			}
			console.log('Deleted '+id+'.json');
			(function (exports) {
				'use strict';
			   
				var Sequence = exports.Sequence || require('sequence').Sequence
				  , sequence = Sequence.create()
				  , err
				  ;
			   
				sequence
				  .then(function (next) {
					if(newApplianceEntities.length){
						var applianceEntityId = "84431de8-b750-4dd5-8598-cdb81c225cff" ;
						updateDialougeFlowEntities(newApplianceEntities,applianceEntityId).then(function(success){
							next(false,success)
							//deferred.resolve(success)
						},function(error){
							next(error,false)
							//deferred.reject(error);
						})
					}else{
						var response = {"status": {
							"code": 200,
							"errorType": "success"
						}}
						next(false,response)
						//deferred.resolve();
					}
				  })
				  .then(function (next, error, response) {
					if(newCommandEntities.length){
						var commandEntityId = "39583666-049d-4b42-8c71-35425fcc41e5" ;
						updateDialougeFlowEntities(newCommandEntities,commandEntityId).then(function(success){
							next(false,success)
							//deferred.resolve(success)
						},function(error){
							next(error,false)
							//deferred.reject(error);
						})
					}else{
						var response = {"status": {
							"code": 200,
							"errorType": "success"
						}}
						next(false,response)
					}
				  })
				  .then(function (next, error, response) {
						if(error){
							deferred.reject(error);
						}else{
							deferred.resolve(response);
						}
				  });
			   
			  // so that this example works in browser and node.js
			  }('undefined' !== typeof exports && exports || new Function('return this')()));
		    //deferred.resolve(response);
		});
		
	/*	 */
/*		//console.log(success);
		var appliances = success.rooms[0].appliances;
		//console.log(JSON.stringify(appliances));

		var applianceEntries = [];
		var commandEntries = [];
		try{
			for(var i = 0 ; i < appliances.length ; i++){
				applianceEntries.push( {
					value: appliances[i].name.toLowerCase(),
					synonyms: [appliances[i].name,appliances[i].name.toUpperCase()]
				})
				for(var j = 0 ; j < appliances[i].commands.length ; j++){
					var splitCommand = appliances[i].commands[j].command
					var subCommand;
					var trueCommand;
					var falseCommand;
					if(splitCommand.includes("/")){
						if( splitCommand.includes(" ")){
							splitCommand = splitCommand.split(" ");
							subCommand = splitCommand[1].split("/")
							trueCommand = splitCommand[0] + ' ' +subCommand[0];
							falseCommand =  splitCommand[0] + ' ' +subCommand[1]
						}else{
							splitCommand = splitCommand.split("/")
							trueCommand = splitCommand[0];
							falseCommand =  splitCommand[1];
						}
						commandEntries.push( {
							value: trueCommand.toLowerCase(),
							synonyms: [trueCommand,trueCommand.toUpperCase()]
						})
						commandEntries.push( {
							value: falseCommand.toLowerCase(),
							synonyms: [falseCommand,falseCommand.toUpperCase()]
						})
					}else{
						commandEntries.push( {
							value: splitCommand.toLowerCase(),
							synonyms: [splitCommand,splitCommand.toUpperCase()]
						})
					}				
				}
			}
			
		}catch(error){
			console.log(error);
		}

		console.log("Starting Training.");
		var traininAppliance = {
			name : "appliance",
			entries : applianceEntries
		}
		console.log("Tranning Appliance.");

		dialougeFolowService.developerEntities(traininAppliance,"turn on fan").then(function(success) {
			var trainingCommand = {
				name : "command",
				entries : commandEntries
			}
			console.log("Tranning commands.");

			dialougeFolowService.developerEntities(sessionId,trainingCommand,"turn on fan").then(function(success) {
				deferred.resolve(success)
			},function(faliure) {
				deferred.reject(faliure)
			})
			deferred.resolve(success)
		},function(faliure) {
			deferred.reject(faliure)
		})*/
		//deferred.resolve(success)
	},function(faliure) {
		deferred.reject(faliure)
	});
	
	return deferred.promise;
   }

exports.getUser = function(userDetails) {
	var deferred = Q.defer();

	userModel.getUser(userDetails)
	.then(function(success){
		deferred.resolve(success);
	}, function(faliure){
		deferred.reject(faliure);
	});

	return deferred.promise;
}

var updateDialougeFlowEntities = function(data,entityId){
	var deferred = Q.defer();
	console.log("id-------------",entityId)
	var commandObj = [];
	try{
		for(var i = 0 ; i < data.length ; i++){
			commandObj.push({
				"synonyms": [
					data[i],
					data[i].toUpperCase()
				],
				"value": data[i]
			  });
		}
	}catch(e){
		console.log(e);
	}
	request.post({
	headers: {
		'Authorization': 'Bearer 732468342f8d4b0e988245fc3ff63dde',
		'Content-Type' : 'application/json'
		},
	url:   'https://api.dialogflow.com/v1/entities/'+entityId+'/entries?v=20150910',
	body:    JSON.stringify(commandObj)
	}, function(error, response, body){
		console.log("error----------------->",error);
		console.log("body================>",body);
		deferred.resolve(body);
	});	
	return deferred.promise;
}
 
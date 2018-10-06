var userService = require('./service')
var Q = require('q');
var  util = require('../util.js')
var jsonValidate = require('../service/jsonValidator');
var request = require('request');
var quickSort = require('quick-sort');

function diff(A, B) {    return A.filter(function (a) {        return B.indexOf(a) == -1;    });}

function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

exports.userInput = function (requstObj) {
	var deferred = Q.defer();
	if(!requstObj.text){
		var response = {
			status :403,
			message:'Param "text"missing or invlaid'
		}
		deferred.resolve(response);
	}
	userService.userInput(requstObj).then(function (success) {
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
		console.log("error---------------->",response);
		deferred.reject(response)
	})
	return deferred.promise;
};

exports.knxUpload = function (id) {
	var deferred = Q.defer();
	if(!id){
		var response = {
			status :403,
			message:'param "id" required'
		}
		deferred.resolve(response);
	}
	var	sessionId = false
	var userObject = require('./userFile/'+id+'.json')
	console.log("imported json :",userObject);
	if(!userObject){
		var response = {
			status :403,
			message:'request body missing'
		}
		deferred.resolve(response);
	}
	try{
		jsonValidate.validate(userObject).then(function(success){
		if(util.isEmpty(success)){
			console.log("validate DONE!!!------------------------------------")
			//Valid Json
			//validate from dizalouge flow get api weather entities are already present
			(function (exports) {
				'use strict';
			   			console.log("inside sequence------------------------------------")

				var Sequence = exports.Sequence || require('sequence').Sequence
				  , sequence = Sequence.create()
				  , err
				  ;
				sequence
				  .then(function (next) {
					var applianceEntityId = "84431de8-b750-4dd5-8598-cdb81c225cff" 
					validateFromDialougeflow(applianceEntityId).then(function(success){
						console.log("here in first then.")
						var dialogflowEntities = [];
						for(var i  = 0 ; i < success.entries.length ; i++){
							dialogflowEntities.push(success.entries[i].value.toLowerCase());
						}

						var userEntities = [];
						for(var i  = 0 ; i < userObject.rooms[0].appliances.length ; i++){
							userEntities.push(userObject.rooms[0].appliances[i].name.toLowerCase());
						}

						var newApplianceEntities = diff(userEntities,dialogflowEntities)
						next(newApplianceEntities)
					},function(faliure){
						console.log(faliure);
					});
				  })
				  .then(function (next, newApplianceEntities) {
					var commandEntityId = "39583666-049d-4b42-8c71-35425fcc41e5" 
					validateFromDialougeflow(commandEntityId).then(function(success){
						var dialogflowEntities = [];
						for(var i  = 0 ; i < success.entries.length ; i++){
							dialogflowEntities.push(success.entries[i].value.toLowerCase());
						}
						var userEntities = [];
						try{
							var appliances = userObject.rooms[0].appliances;
							var applianceEntries = [];
							var commandEntries = [];
							for(var i = 0 ; i < appliances.length ; i++){
								applianceEntries.push( {
									value: appliances[i].name.toLowerCase(),
									synonyms: [appliances[i].name,appliances[i].name.toUpperCase()]
								})
								for(var j = 0 ; j < appliances[i].commands.length ; j++){
									var splitCommand = appliances[i].commands[j].command.toUpperCase();
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

							for(var i  = 0 ; i < commandEntries.length ; i++){
							 	userEntities.push(commandEntries[i].value.toLowerCase());
							}
							var commandEntries = removeDuplicates(userEntities);
							var newCommandEntities = diff(commandEntries,dialogflowEntities)
							next(newApplianceEntities,newCommandEntities)

						}
						catch(e){
							console.log(e);
						}
					},function(faliure){
						console.log(faliure);
					});
				  })
				  .then(function (next, newApplianceEntities,newCommandEntities) {
					  console.log("Done")
					userService.knxUpload(userObject,sessionId,id,newApplianceEntities,newCommandEntities).then(function (success) {
						var response = {
							status :success.status.code,
							message:success.status.errorType
						}
						deferred.resolve(response)
					},function (faliure) {
						var response = {
							status :401,
							message:faliure
						}
						deferred.reject(response)
					})
				  });
			   
			  // so that this example works in browser and node.js
			  }('undefined' !== typeof exports && exports || new Function('return this')()));
		}else{									//invalid Json
			var response = {
				status :403,
				message:success
			}
			deferred.resolve(response)
		}	
	},function(error){
		deferred.reject(error)
	})
}catch(e){
	console.log("error===============================",e)
}
	
	return deferred.promise;
};

var validateFromDialougeflow = function(entityId){
	var deferred = Q.defer();
	var options = {
		url: 'https://api.dialogflow.com/v1/entities/'+entityId+'?v=20150910',
		headers: {
		  'Authorization': 'Bearer 732468342f8d4b0e988245fc3ff63dde',
		  'Content-Type' : 'application/json'
		}
	  };
	request(options, function (error, response, body) {
		console.log('error:', error); // Print the error if one occurred
		//console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
		console.log('type of body in user controller:', typeof(body)); // Print the HTML for the Google homepage.
		var body = JSON.parse(body);
		deferred.resolve(body); 
	});	
	return deferred.promise;
}

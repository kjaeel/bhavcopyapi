var Q = require('q');
var userModel = require('./model')
var fs = require('fs');
var request = require('request');

exports.fetchDailyBhavCopy = function(){
	var deferred = Q.defer();
	var request = require('request');
	var fs = require('fs');
	var today = new Date(2018,09,26);
	var year = today.getFullYear();
	var date = today.getDate();
	date = pad(date);
	var month = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
	var currentMonth = today.getMonth();
	(function (exports) {
		'use strict';
	
		var Sequence = exports.Sequence || require('sequence').Sequence
		, sequence = Sequence.create()
		, err
		;
	
		sequence
		.then(function (next) {
			//zip download code
			try{
				var url ='http://www.nseindia.com/content/historical/DERIVATIVES/'+ year + '/' + month[currentMonth] + '/fo' + date + month[currentMonth] + year + 'bhav.csv.zip'
				console.log(url);
				const req = request
				.get(url)
				.on('response', function (res) {
					if (res.statusCode === 200) {
						console.log("here");
						var file =fs.createWriteStream(__dirname+'\\zip\\fo' + date + month[currentMonth] + year + 'bhav.csv.zip');
						req.pipe(file)
						file.on('finish', function () {
							console.log("downlod done.. now saving!");
							 //	next();
					 	});
						file.on('close', function () {
								console.log("File save done");
							 	next();
						 });
					}else{
						console.log("URL not found.")
						deferred.reject("Invalid URL.");
					}
				})
			}catch(error){
				console.log(error);
				deferred.reject("error occured before extract.");
			}
			
		})
		.then(function (next) {
			//csv extract
			var extract = require('extract-zip')
			extract(__dirname+'/zip/fo' + date + month[currentMonth] + year + 'bhav.csv.zip', {dir: __dirname+'/extract/'}, function (err) {
				if(err){
					console.log(err);
					deferred.reject("error occured while extract.");
				}else{
					next();
				}
			});
		})
		.then(function (next) {
				//create bulk array
				var bulkArr = [];
				const csvFilePath=__dirname+'/extract/'+'/fo' + date + month[currentMonth] + year + 'bhav.csv';
				const csv=require('csvtojson')
				csv()
				.fromFile(csvFilePath)
				.then((jsonObj)=>{
					var monthToDb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
					for (let index = 0; index < jsonObj.length; index++) {
						var STRIKE_PR = parseInt(jsonObj[index].STRIKE_PR);
						var CONTRACTS = parseInt(jsonObj[index].CONTRACTS);
						var VAL_INLAKH = parseInt(jsonObj[index].VAL_INLAKH);
						var OPEN = parseFloat(jsonObj[index].OPEN);
						var HIGH = parseFloat(jsonObj[index].HIGH);
						var LOW = parseFloat(jsonObj[index].LOW);
						var CLOSE = parseFloat(jsonObj[index].CLOSE);
						var SETTLE_PR = parseFloat(jsonObj[index].SETTLE_PR);
						var OPEN_INT = parseFloat(jsonObj[index].OPEN_INT);
						var CHG_IN_OI = parseFloat(jsonObj[index].CHG_IN_OI);
						var EXPIRY_DT = jsonObj[index].EXPIRY_DT;
						EXPIRY_DT = EXPIRY_DT.split('-');
						var insertExpireMonth = null;
						for (let i = 0; i < monthToDb.length; i++) {
							if(EXPIRY_DT[1].trim() === monthToDb[i]){
								insertExpireMonth = i;
							}
							
						}
						//var insertExpireYear = convertToYYYY(EXPIRY_DT[2])
						var insertExpireDate = EXPIRY_DT[2]+'-'+insertExpireMonth+'-'+EXPIRY_DT[0];
						
						var TIMESTAMP = jsonObj[index].EXPIRY_DT;
						TIMESTAMP = TIMESTAMP.split('-');
						var insertTimestampMonth = null;
						for (let i = 0; i < monthToDb.length; i++) {
							if(TIMESTAMP[1].trim() === monthToDb[i]){
								insertTimestampMonth = i;
							}
							
						}
						//var insertTimestampYear = convertToYYYY(TIMESTAMP[2])
						var insertTimestampDate = TIMESTAMP[2]+'-'+insertTimestampMonth+'-'+TIMESTAMP[0];
						bulkArr.push([jsonObj[index].INSTRUMENT,
							jsonObj[index].SYMBOL,
							new Date(insertExpireDate),
							STRIKE_PR,
							jsonObj[index].OPTION_TYP,
							OPEN,
							HIGH,
							LOW,
							CLOSE,
							SETTLE_PR,
							CONTRACTS,
							VAL_INLAKH,
							OPEN_INT,
							CHG_IN_OI,
							new Date(insertTimestampDate)]);
						
					}
					next(bulkArr);
				});
		})
		.then(function (next, bulkArr) {
			var imageFullPathName = __dirname+'/extract/'+'/fo' + date + month[currentMonth] + year + 'bhav.csv'
			fs.unlink(imageFullPathName, function(err){
			if (err) {
				if (err.code != 'ENOENT') {
				// handle actual errors here
				console.error("Error in call to fs.unlink", err);
				}else{
					console.log("File does not exist");
					// else there was no file, handle that if you need to
			
				}
			}else{
					// else delete success, handle that if you need to
					console.log("csv file delete succesfull!!!")
			}
			});
			next(bulkArr);
		})
		.then(function (next, bulkArr) {
			var imageFullPathName = __dirname+'/zip/'+'/fo' + date + month[currentMonth] + year + 'bhav.csv.zip'
			fs.unlink(imageFullPathName, function(err){
			if (err) {
				if (err.code != 'ENOENT') {
				// handle actual errors here
				console.error("Error in call to fs.unlink", err);
				}else{
					console.log("File does not exist");
					// else there was no file, handle that if you need to
			
				}
			}else{
					// else delete success, handle that if you need to
					console.log("zip file delete succesfull!!!")
			}
			});
			next(bulkArr);
		})
		.then(function (next, bulkArr) {
				userModel.bulkInsertBhavCopy(bulkArr).then(function(success){
					deferred.resolve(success);
				},function(error){
					console.error(error);
					deferred.reject("error occured");
				})
		});
	// so that this example works in browser and node.js
	}('undefined' !== typeof exports && exports || new Function('return this')()));
 return deferred.promise;
}

function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}

exports.getBhavCopy = function(){
    var deferred = Q.defer();
	userModel.getBhavCopy().then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

function convertToYYYY(yy) {
	var yyyy  = (yy < 90) ? '20' + yy : '19' + yy;
	return yyyy;
}

exports.populateContractTables = function(){
    var deferred = Q.defer();
	(function (exports) {
		'use strict';
	   
		var Sequence = exports.Sequence || require('sequence').Sequence
		  , sequence = Sequence.create()
		  , err
		  ;
	   
		sequence
		  .then(function (next) {
			//validate if data exist and get bhav copy data
				userModel.getBhavCopy().then(function(success){
					if(success && success.length){
						next();
					}else{
						console.log("Database empty")
						deferred.reject("Database empty")
					}
				},function(error){
					console.error(error);
					deferred.reject("error occured");
				})		
		  })
		  .then(function (next) {
				userModel.getContractCopy().then(function(success){
					console.log("fetching done!");
					next(success);
				},function(error){
					console.error(error);
					deferred.reject("error occured while fetching");
				});	
		  })
		  .then(function (next,success) {
				var bulkArr = [];
				var monthToDb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
				try{
					for (let i = 0; i < success.length; i++) {
						var contract = success[i];
						var bulkContractArray = [];
						for (let j = 0; j < contract.length; j++) {
							var insertExpireMonth = null;
							if(contract[j].edate){
								var EDATE = contract[j].edate;
								EDATE = EDATE.split('-');
								for (let k = 0; k < monthToDb.length; k++) {
									if(EDATE[1].trim() === monthToDb[k]){
										insertExpireMonth = k;
									}
								}
								var insertExpireDate = EDATE[2]+'-'+insertExpireMonth+'-'+EDATE[0];
								bulkContractArray.push([
									contract[j].symbol,
									new Date(insertExpireDate),
									contract[j].id]);
							}
						}
						bulkArr.push(bulkContractArray);
					}
				}catch(e){	
					console.log(e);
					deferred.reject(e);
				}
				
				userModel.InsertBulkContractCopy(bulkArr).then(function(result){
					deferred.resolve(result);
				},function(error){
					console.error(error);
					deferred.reject("error occured while inserting");
				});	
	 	 });
	   
	  // so that this example works in browser and node.js
	}('undefined' !== typeof exports && exports || new Function('return this')()));
	  
	return deferred.promise;
}

exports.getContracts = function(){
	var deferred = Q.defer();
	userModel.getContracts().then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

exports.getChart = function(reqObject){
	var deferred = Q.defer();
	//form dynamic quary
	var query = "select *   FROM bhavcopycore as BCC,";
	if(reqObject.contractType === 'CE'){
		query = query + "bhavcall BC WHERE BC.id = BCC.id AND BCC.option_typ = ? AND BC.symbol = ? AND BC.id = ?"
	}else if(reqObject.contractType === 'PE'){
		query = query + "bhavput BP WHERE BP.id = BCC.id AND BCC.option_typ = ? AND BP.symbol = ? AND BP.id = ?"
	}else{
		query = query + "bhavfuture BF WHERE BF.id = BCC.id AND BCC.option_typ = ? AND BF.symbol = ? AND BF.id = ?"
	}
	var values = [];
	values.push(reqObject.contractType); values.push(reqObject.symbol); values.push(reqObject.id);
	userModel.getChart(query,values).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}
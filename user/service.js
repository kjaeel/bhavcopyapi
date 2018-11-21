var Q = require('q');
var userModel = require('./model')
var fs = require('fs');
var request = require('request');
var  config = require('../config')

exports.fetchDailyBhavCopy = function(day){
	var deferred = Q.defer();
	var request = require('request');
	var fs = require('fs');
	var today = new Date(2018,10,day);
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
							if(EXPIRY_DT[1].toUpperCase().trim() === monthToDb[i].toUpperCase()){
								insertExpireMonth = i;
							}
							
						}
						//var insertExpireYear = convertToYYYY(EXPIRY_DT[2])
						var insertExpireDate = new Date(EXPIRY_DT[2],insertExpireMonth,EXPIRY_DT[0]);
						var TIMESTAMP = jsonObj[index].TIMESTAMP;
						TIMESTAMP = TIMESTAMP.split('-');
						var insertTimestampMonth = null;
						for (let a = 0; a < monthToDb.length; a++) {
							if(TIMESTAMP[1].toUpperCase().trim() === monthToDb[a].toUpperCase()){
								insertTimestampMonth = a;
							}
							
						}
						//var insertTimestampYear = convertToYYYY(TIMESTAMP[2])
						var insertTimestampDate = new Date(TIMESTAMP[2],insertTimestampMonth,TIMESTAMP[0]);
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
									if(EDATE[1].toUpperCase().trim() === monthToDb[k].toUpperCase()){
										insertExpireMonth = k;
									}
								}
								var insertExpireDate = new Date( EDATE[2],insertExpireMonth,EDATE[0]);
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

exports.getContracts = function(contractId){
	var deferred = Q.defer();
	var sql = null;
	if(contractId == "CE"){
		sql = "SELECT DISTINCT symbol,edate from bhavcall;"
	}
	if(contractId == "PE"){
		sql = "SELECT DISTINCT symbol,edate from bhavput;"
	}
	if(contractId == "XX"){
		sql = "SELECT DISTINCT symbol,edate from bhavfuture;"
	}
	userModel.getContracts(sql).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

exports.getChart = function(reqObject){
	var deferred = Q.defer();
	var query = 'select *  FROM bhavcopycore WHERE symbol = ? and expiry_dt = ? and strike_pr = ? and option_typ = ?'
	var values = [];
	var contractSymbol = reqObject.symbol.split('-');
	//select *  FROM bhavcopycore WHERE symbol = "BANKNIFTY" and expiry_dt = date and strike_pr = 22900 and option_typ = "PE"
	//BANKNIFTY-01-Oct-2018-22800-CE
	var bhavSymbol = contractSymbol[0];
	var day = contractSymbol[1];
	var month = contractSymbol[2];
	var monthToDb = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	for (let k = 0; k < monthToDb.length; k++) {
		if(month === monthToDb[k]){
			month = k;
		}
	}
	var year = contractSymbol[3];
	var date = new Date(year,month,day);
	var strike_pr = contractSymbol[4];
	var option_typ = contractSymbol[5];
	values.push(bhavSymbol); values.push(date); values.push(strike_pr); values.push(option_typ);
	(function (exports) {
		'use strict';
	   
		var Sequence = exports.Sequence || require('sequence').Sequence
		  , sequence = Sequence.create()
		  , err
		  ;
	   
		sequence
		  .then(function (next) {
			userModel.getChart(query,values).then(function(success){
				
				next(success);
			},function(error){
				console.error(error);
				deferred.reject("error occured");
			})
		  })
		  .then(function (next, success) {
			userModel.getVolumeAndPrClose(values).then(function(data){
				next(success,data); 
			},function(err){
				console.error(error);
				deferred.reject("error occured");
			})
		  })
		  .then(function (next, success, data) {
				userModel.getAvg(values).then(function(avg){
					next(success,data,avg);
				},function(error){
					console.error(error);
					deferred.reject("error occured");
				});
		  })
		  .then(function (next, success, data, avg) {
			//final data
			console.log("Final data formation")
			var high = [];
			var low = [];
			var sum = 0;
			for (let i = 0; i < success.length; i++) {
				high.push(success[i].high);
				low.push(success[i].low);
			}
			for (let i = 0; i < success.length; i++) {
				sum =sum + success[i].close;
				success[i]['pr_close'] = data.prClose;// yester day's close fix this
				//fall = close - pr-close	
				var fall = success[i].close - data.prClose; // change this
				success[i]['fall'] = fall; 
				success[i]['average1'] = avg.avg1.toFixed(2);
				success[i]['average3'] = avg.avg3.toFixed(2); // change this
				success[i]['high-52'] = Math.max(...high); 
				success[i]['low-52'] = Math.min(...low);	
			}
			deferred.resolve(success);
		  });
	   
	  // so that this example works in browser and node.js
	  }('undefined' !== typeof exports && exports || new Function('return this')()));
    return deferred.promise;
}

exports.getMacd = function(reqObject){
	var deferred = Q.defer();
	var macd = reqObject.average1 - reqObject.average3;
	deferred.resolve({"macd" : macd});
    return deferred.promise;
}

exports.getStochastic = function(success){
	var deferred = Q.defer();
	var high = [];
	var low = [];
	var resObj = [];
	for (let i = 0; i < success.length; i++) {
		high.push(success[i].high);
		low.push(success[i].low);
	}
	var stochasticCounter = 0;
	for (let i = 0; i < success.length; i++) {
		var highestHigh = Math.max(...high); 
		var lowestLow = Math.min(...low);
	
		if((highestHigh - lowestLow) > 0 && success.length >= 6 && stochasticCounter <= 6){
			var stochastic = ((success[i].close - lowestLow)/(highestHigh - lowestLow)*100)
			resObj.push({ "stochastic": stochastic.toFixed(2), "timestamp" : success[i].timestamp });
			stochasticCounter++;
		}else{
			resObj.push({ "stochastic": 0, "timestamp" : success[i].timestamp });
		}
		
	}
	deferred.resolve(resObj);
    return deferred.promise;
}
exports.savePortfolio = function(reqObject){
	var deferred = Q.defer();
	var query = "INSERT INTO portfolio (symbol, edate, user_id) VALUES (?,?,?)"
	userModel.savePortfolio(query,reqObject).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

exports.getPortfolio = function(user_id){
	var deferred = Q.defer();
	userModel.getPortfolio(user_id).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

exports.updatePortfolio = function(reqObject){
	var deferred = Q.defer();
	var values = [];
	var query = "UPDATE portfolio set target = ? ";
	values.push(reqObject.target);
	if(reqObject.pdate){
		query = query + ",pdate = ?";
		values.push(new Date(reqObject.pdate));
	}
	if(reqObject.qty){
		query = query + ",qty = ?";
		values.push(reqObject.qty);
	}
	if(reqObject.prate){
		query = query + ",prate = ?";
		values.push(reqObject.prate);
	}
	if(reqObject.owner){
		query = query + ",owner = ?";
		values.push(reqObject.owner);
	}
	query = query + " where user_id = ? and  symbol = ?"
	values.push(reqObject.user_id);
	values.push(reqObject.symbol);
	userModel.updatePortfolio(query,values).then(function(success){
		deferred.resolve(success);
	},function(error){
		console.error(error);
		deferred.reject("error occured");
	})
    return deferred.promise;
}

function yesterday() {
	var d = new Date();
	let yesterday = d.setDate(d.getDate() - 1);
	return yesterday;
}
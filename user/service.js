var Q = require('q');
var userModel = require('./model')
var fs = require('fs');
var request = require('request');

exports.fetchDailyBhavCopy = function(){
	var deferred = Q.defer();
	var request = require('request');
	var fs = require('fs');
	var today = new Date(2018,09,05);
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
				var url ='https://www.nseindia.com/content/historical/DERIVATIVES/'+ year + '/' + month[currentMonth] + '/fo' + date + month[currentMonth] + year + 'bhav.csv.zip'
				console.log(url);
				const req = request
				.get(url)
				.on('response', function (res) {
					if (res.statusCode === 200) {
						req.pipe(fs.createWriteStream(__dirname+'\\zip\\fo' + date + month[currentMonth] + year + 'bhav.csv.zip'))
						req.on('close', function () {
							 	next();
						 });
					}else{
						console.log("URL not found.")
						deferred.reject("Invalid URL.");
					}
				})
				// request(url, function (error, response, body) {
				// 	console.log('error:', error); // Print the error if one occurred
				// 	console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
				// 	console.log('body:', body); // Print the HTML for the Google homepage.
				// 	if(response.statusCode === 404){
				// 		deferred.reject("error occured.");
				// 	}
				//   })
				// .pipe(fs.createWriteStream(__dirname+'/zip/fo' + date + month[currentMonth] + year + 'bhav.csv.zip'))
				// .on('close', function () {
				// 	next();
				// });
			}catch(error){
				console.log(error);
				deferred.reject("error occured before extract.");
			}
			
		})
		.then(function (next) {
			//csv extract
			var extract = require('extract-zip')
			extract(__dirname+'/zip/fo' + date + month[currentMonth] + year + 'bhav.csv.zip', {dir: __dirname+'/extract/'}, function (err) {
			//var source = __dirname+"\\zip\\fo05OCT2018bhav.csv.zip"
			//var target = __dirname+"\\extract\\"
			//extract(source, {dir: target}, function (err) {
					// extraction is complete. make sure to handle the err
				if(err){
					console.log(err);
					console.log("source ============= ",source);
					console.log("target ============= ",target);
					deferred.reject("error occured while extract.");
				}else{
					//console.log("_dirname============= ",__dirname);
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

						bulkArr.push([jsonObj[index].INSTRUMENT,
							jsonObj[index].SYMBOL,
							jsonObj[index].EXPIRY_DT,
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
							jsonObj[index].TIMESTAMP]);
						
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


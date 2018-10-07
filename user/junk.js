// var request = require('request');
// var fs = require('fs');
// request('https://www.nseindia.com/content/historical/EQUITIES/2018/OCT/cm03OCT2018bhav.csv.zip')
//   .pipe(fs.createWriteStream('../bhavcopy.zip'))
//   .on('close', function () {
//     console.log('File written!');
//   });

// var extract = require('extract-zip')
// extract('../bhavcopy.zip', {dir: "C:\\Users\\Admin\\Desktop\\workspace\\bhavcopyapi\\public"}, function (err) {
//  // extraction is complete. make sure to handle the err
//  console.log(err);
// console.log("Extract complete");
// })
var forEachAsync = require('forEachAsync').forEachAsync
var initialIndex = 0;
var conditionIndex = 1000;
var bulkArr = [];
const csvFilePath='C:\\Users\\Admin\\Desktop\\workspace\\bhavcopyapi\\public\\fo05OCT2018bhav.csv'
const csv=require('csvtojson')
csv()
.fromFile(csvFilePath)
.then((jsonObj)=>{
    var loopAsyncArray = [];
    for (let index = 0; index < 50; index++) {
        loopAsyncArray.push(index);
    }

  // waits for one request to finish before beginning the next
  forEachAsync(loopAsyncArray, function (next, element, index, loopAsyncArray) {
    for (let index = initialIndex; index < conditionIndex; index++) {
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
    //console.log("converted array ----> ",bulkArr);
    console.log("converted array length----> ",bulkArr[0]);
    // var mysql      = require('mysql');
    // var  config = require('../config')

    // var connection = mysql.createConnection(config.mysql);
    

    // connection.connect(function(err) {
    // if (err) {
    //     console.error('error connecting: ' + err.stack);
    //     return;
    // }
    
    // console.log('mysql connection successfull connected as id ' + connection.threadId);
    // });

    // var sql = "INSERT INTO bhavcopycore (INSTRUMENT,SYMBOL,EXPIRY_DT,STRIKE_PR,OPTION_TYP,OPEN,HIGH,LOW,CLOSE,SETTLE_PR	CONTRACTS,VAL_INLAKH,OPEN_INT,CHG_IN_OI,TIMESTAMP) VALUES ?";
   
    // connection.query(sql, [bulkArr], function(err) {
    //     if (err){
    //         console.log(err);
    //         connection.end(function(err) {
    //             // The connection is terminated now
    //             console.log("Connection is terminated now.");
    //         }); 
    //     }else{
    //         console.log("its done!!!")
    //         connection.end(function(err) {
    //             // The connection is terminated now
    //             console.log("Connection is terminated now.");
    //         }); 
    //     }
        
    // });
    var mysql = require('mysql');

    var con = mysql.createConnection({
    host: "localhost",
    user : 'root',
    password : 'password',
    database : 'bhavcopy' 
    });

    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:
        var sql = "INSERT INTO bhavcopy.bhavcopycore (INSTRUMENT,SYMBOL,EXPIRY_DT,STRIKE_PR,OPTION_TYP,OPEN,HIGH,LOW,CLOSE,SETTLE_PR,CONTRACTS,VAL_INLAKH,OPEN_INT,CHG_IN_OI,TIMESTAMP) VALUES ?";
        //Make an array of values:
        var values = bulkArr;
        //Execute the SQL statement, with the value array:
        con.query(sql,[values], function (err, result) {
            if (err){
                console.log(err);
                con.end(function(err) {
                    //             // The connection is terminated now
                                console.log("Connection is terminated now.");
                                next()
                }); 
            }else{
                console.log("Number of records inserted: " + result.affectedRows);
                con.end(function(err) {
                    //             // The connection is terminated now
                                console.log("Connection is terminated now.");
                                initialIndex = conditionIndex;
                                conditionIndex = conditionIndex+1000;
                                next();
                }); 
            }
            
        });
    });
  
  }).then(function () {
    console.log('All requests have finished');
  });
})


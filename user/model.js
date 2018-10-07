 var Q = require('q');
 var  config = require('../config')
 var mysql = require('mysql');
 var connection = mysql.createConnection(config.mysql);

exports.bulkInsertBhavCopy = function(bulkArr){
    var deferred = Q.defer();
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:
        var sql = "INSERT INTO bhavcopy.bhavcopycore (INSTRUMENT,SYMBOL,EXPIRY_DT,STRIKE_PR,OPTION_TYP,OPEN,HIGH,LOW,CLOSE,SETTLE_PR,CONTRACTS,VAL_INLAKH,OPEN_INT,CHG_IN_OI,TIMESTAMP) VALUES ?";
        //Make an array of values:
        var values = bulkArr;
        //Execute the SQL statement, with the value array:
        connection.query(sql,[values], function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                             // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.reject("error occured");
                }); 
            }else{
                console.log("Number of records inserted: " + result.affectedRows);
                connection.end(function(err) {
                            // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.resolve("Data Imported.")
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}


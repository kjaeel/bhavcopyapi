 var Q = require('q');
 var  config = require('../config')
 var mysql = require('mysql');

exports.bulkInsertBhavCopy = function(bulkArr){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
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


exports.getBhavCopy = function(){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:
        var sql = "select * from bhavcopycore LIMIT 10;";

        //Execute the SQL statement, with the value array:
        connection.query(sql, function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                             // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.reject("error occured");
                }); 
            }else{
                //console.log("Number of records inserted: " + result.affectedRows);
                connection.end(function(err) {
                            // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.resolve(result)
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}

exports.deleteBhavCopy = function(date){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:
        var sql = "delete * from bhavcopycore where timestamp ="+date+";";

        //Execute the SQL statement, with the value array:
        connection.query(sql, function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                             // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.reject("error occured");
                }); 
            }else{
                //console.log("Number of records inserted: " + result.affectedRows);
                connection.end(function(err) {
                            // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.resolve(result)
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}

exports.getContractCopy = function(){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var finalResult = [];
        var queries = [];
        queries.push("SELECT CONCAT(`symbol`,'-', DATE_FORMAT(`expiry_dt`, '%d-%b-%Y'),'-',`strike_pr`,'-',`option_typ`) as symbol , DATE_FORMAT(`expiry_dt`, '%d-%b-%Y') as edate , id FROM bhavcopycore WHERE `option_typ` = 'CE';");
        queries.push("SELECT CONCAT(`symbol`,'-', DATE_FORMAT(`expiry_dt`, '%d-%b-%Y'),'-',`strike_pr`,'-',`option_typ`) as symbol , DATE_FORMAT(`expiry_dt`, '%d-%b-%Y') as edate , id FROM bhavcopycore WHERE `option_typ` = 'PE';");
        queries.push("SELECT CONCAT(`symbol`,'-', DATE_FORMAT(`expiry_dt`, '%d-%b-%Y'),'-',`strike_pr`,'-',`option_typ`) as symbol , DATE_FORMAT(`expiry_dt`, '%d-%b-%Y') as edate , id FROM bhavcopycore WHERE `option_typ` <> 'CE' and `option_typ` <> 'PE';");			
        //Make SQL statement:
        //Execute the SQL statement, with the value array:
        var forEachAsync = require('forEachAsync').forEachAsync;
        forEachAsync(queries, function (forEachNext, query, index, queries) {
            connection.query(query, function (err, result) {
                if (err){
                    console.log(err);
                    connection.end(function(err) {
                                 // The connection is terminated now
                                console.log("Connection is terminated now.");
                                deferred.reject(err);
                    }); 
                }else{
                    finalResult.push(result);
                    forEachNext();
                }
            }); 
        }).then(function () {
            console.log('All requests have finished');
            connection.end(function(err) {
                if(err) console.log(err);
                // The connection is terminated now
                console.log("Connection is terminated now.");
                deferred.resolve(finalResult);
            }); 
        });
    });
    return deferred.promise;
}

exports.InsertBulkContractCopy = function(bulkData){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log(" bulk contract copy Connected!");
        var queries = [];
        queries.push("INSERT INTO bhavcall (symbol, edate, id) VALUES ?");
        queries.push("INSERT INTO bhavput (symbol, edate, id) VALUES ?");
        queries.push("INSERT INTO bhavfuture (symbol, edate, id) VALUES ?");			
        //Make SQL statement:
        //Execute the SQL statement, with the value array:
        var forEachAsync = require('forEachAsync').forEachAsync;
        forEachAsync(queries, function (forEachNext, query, index, queries) {
            //Execute the SQL statement, with the value array:
            connection.query(query,[bulkData[index]], function (err, result) {
                if (err){
                    console.log(err);
                    connection.end(function(err) {
                                 // The connection is terminated now
                                console.log("Connection is terminated now.");
                                deferred.reject("error occured");
                    }); 
                }else{
                    console.log("Number of records inserted: " + result.affectedRows);
                    forEachNext(); 
                }
            }); 
        }).then(function () {
            console.log('All requests have finished');
            connection.end(function(err) {
                if(err) console.log(err);
                // The connection is terminated now
                console.log("Connection is terminated now.");
                deferred.resolve("Data Imported");
            }); 
        });
    });
    return deferred.promise;
}
//SELECT * from bhavcopycore as BC,bhavput as BP WHERE BC.id = BP.id and BP.id = 700
exports.getContracts = function(){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var finalResult = [];
        var queries = [];
        queries.push("SELECT id,symbol,edate from bhavcall;");
        queries.push("SELECT id,symbol,edate from bhavput;");
        queries.push("SELECT id,symbol,edate from bhavfuture;");			
        //Make SQL statement:
        //Execute the SQL statement, with the value array:
        var forEachAsync = require('forEachAsync').forEachAsync;
        forEachAsync(queries, function (forEachNext, query, index, queries) {
            connection.query(query, function (err, result) {
                if (err){
                    console.log(err);
                    connection.end(function(err) {
                                 // The connection is terminated now
                                console.log("Connection is terminated now.");
                                deferred.reject(err);
                    }); 
                }else{
                    finalResult.push(result);
                    forEachNext();
                }
            }); 
        }).then(function () {
            console.log('All requests have finished');
            connection.end(function(err) {
                if(err) console.log(err);
                // The connection is terminated now
                console.log("Connection is terminated now.");
                deferred.resolve(finalResult);
            }); 
        });
    });
    return deferred.promise;
}


exports.getChart = function(sql,values){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        connection.query(sql,values, function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                             // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.reject("error occured");
                }); 
            }else{
                //console.log("Number of records inserted: " + result.affectedRows);
                connection.end(function(err) {
                            // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.resolve(result)
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}

exports.savePortfolio = function(query,reqObject){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        //Make SQL statement:
        

        connection.query(query,[reqObject.symbol,new Date(reqObject.edate),reqObject.user_id], function (err, result) {
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
                    if(err) console.log(err);
                    // The connection is terminated now
                    console.log("Connection is terminated now.");
                    deferred.resolve("Data Imported");
                }); 
            }
        });
    });
    return deferred.promise;
}

exports.getPortfolio = function(user_id){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:
        var sql = "select * from portfolio where user_id = ?;";

        //Execute the SQL statement, with the value array:
        connection.query(sql,[user_id], function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                             // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.reject("error occured");
                }); 
            }else{
                //console.log("Number of records inserted: " + result.affectedRows);
                connection.end(function(err) {
                            // The connection is terminated now
                            console.log("Connection is terminated now.");
                            deferred.resolve(result)
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}

exports.updatePortfolio = function(query,values){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);

    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        //Make SQL statement:
        var sql = query;

        //Execute the SQL statement, with the value array:
        connection.query(sql,values, function (err, result) {
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
                            deferred.resolve({"affectedRows": result.affectedRows})
                            //next();
                }); 
            }
        });
    });
    return deferred.promise;
}
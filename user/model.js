 var Q = require('q');
 var  config = require('../config')
 var mysql = require('mysql');
 var sma = require('sma');

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
exports.getContracts = function(sql){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

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
    // var deferred = Q.defer();
    // var connection = mysql.createConnection(config.mysql);
    // connection.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Connected!");
    //     var finalResult = [];
    //     var queries = [];
    //     queries.push("SELECT DISTINCT id,symbol,edate from bhavcall;");
    //     queries.push("SELECT DISTINCT id,symbol,edate from bhavput;");
    //     queries.push("SELECT DISTINCT id,symbol,edate from bhavfuture;");			
    //     //Make SQL statement:
    //     //Execute the SQL statement, with the value array:
    //     var forEachAsync = require('forEachAsync').forEachAsync;
    //     forEachAsync(queries, function (forEachNext, query, index, queries) {
    //         connection.query(query, function (err, result) {
    //             if (err){
    //                 console.log(err);
    //                 connection.end(function(err) {
    //                              // The connection is terminated now
    //                             console.log("Connection is terminated now.");
    //                             deferred.reject(err);
    //                 }); 
    //             }else{
    //                 finalResult.push(result);
    //                 forEachNext();
    //             }
    //         }); 
    //     }).then(function () {
    //         console.log('All requests have finished');
    //         connection.end(function(err) {
    //             if(err) console.log(err);
    //             // The connection is terminated now
    //             console.log("Connection is terminated now.");
    //             deferred.resolve(finalResult);
    //         }); 
    //     });
    // });
    // return deferred.promise;


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

exports.getVolumeAndPrClose = function(values){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
       // var prClose = "select DISTINCT `timestamp`, close,symbol,`expiry_dt` from bhavcopycore where `symbol` = ? and `expiry_dt` = date(?) AND `strike_pr` = ? and `option_typ` = ?  AND date(`timestamp`) = (select max(date(`timestamp`)) from bhavcopycore where date(`timestamp`) < date(now()) );"
        var sql  = "SELECT COUNT(symbol) as volume FROM `bhavcall` WHERE 1;"//SELECT COUNT(symbol) FROM `bhavfuture` WHERE 1;SELECT COUNT(symbol) FROM `bhavput` WHERE 1;"+prClose;
        connection.query(sql,values, function (err, result) {
            if (err){
                console.log(err);
            }else{
                var sqlFuture  = "SELECT COUNT(symbol) as volume FROM `bhavfuture` WHERE 1";
                connection.query(sqlFuture,values, function (err, future) {
                    if (err){
                        console.log(err);
                    }else{
                        var sqlPut  = "SELECT COUNT(symbol) as volume FROM `bhavput` WHERE 1;";
                        connection.query(sqlPut,values, function (err, put) {
                            if (err){
                                console.log(err);
                            }else{
                                var sqlPrClose = "select DISTINCT `timestamp`, close,symbol,`expiry_dt` from bhavcopycore where `symbol` = ? and `expiry_dt` = date(?) AND `strike_pr` = ? and `option_typ` = ?  AND date(`timestamp`) = (select max(date(`timestamp`)) from bhavcopycore where date(`timestamp`) < date(now()) );"
                                connection.query(sqlPrClose,values, function (err, prClose) {
                                    if (err){
                                        console.log(err);
                                        connection.end(function(err) {
                                                    // The connection is terminated now
                                                    console.log("Connection is terminated now.");
                                                    deferred.reject("error occured");
                                        }); 
                                    }else{
                                        var volume = future[0].volume + put[0].volume + result[0].volume
                                        var pr_close = null;
                                        if(prClose && prClose.length){
                                            pr_close = prClose[0].close;
                                        }else{
                                            pr_close = 0;
                                        }
                                        var resObj = {
                                            volume : volume,
                                            prClose : pr_close
                                        }
                                        connection.end(function(err) {
                                                    // The connection is terminated now
                                                    console.log("Connection is terminated now.");
                                                    deferred.resolve(resObj);
                                                    //next();
                                        }); 
                                    }
                                });
                               // next(future,put);
                            }
                        });
                        //next(future)
                    }
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

exports.getAvg = function(values){
    var deferred = Q.defer();
    var connection = mysql.createConnection(config.mysql);
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
       // var prClose = "select DISTINCT `timestamp`, close,symbol,`expiry_dt` from bhavcopycore where `symbol` = ? and `expiry_dt` = date(?) AND `strike_pr` = ? and `option_typ` = ?  AND date(`timestamp`) = (select max(date(`timestamp`)) from bhavcopycore where date(`timestamp`) < date(now()) );"
        var sql  = 'SELECT close FROM `bhavcopycore` WHERE symbol = ? and expiry_dt = ? and `strike_pr` = ? and `option_typ` = ? and timestamp < Date(Now())';
        
        connection.query(sql,[values[0],new Date(values[1]),Number(values[2]),values[3]], function (err, result) {
            if (err){
                console.log(err);
                connection.end(function(err) {
                    // The connection is terminated now
                   console.log("Connection is terminated now.");
                   deferred.reject("error occured");
                });
            }else{    
                var avgArr1 = []
                var avgArr3 = []
                var avgSum1 = 0;
                var avgSum3 = 0;
                if(result && result.length){
                    for (let i = 0; i < result.length; i++) {
                        avgArr1.push(result[i].close)// result.slice(-5);
                        avgArr3.push(result[i].close)
                    }
                    avgArr1 = sma(avgArr1, 5);
                    avgArr3 = sma(avgArr3,15);
                    // avgArr1 = avgArr1.slice(-5);
                    // avgArr3 = avgArr3.slice(-15);
                    // if(avgArr1.length >= 5){
                    //     for (let i = 0; i < avgArr1.length; i++) {
                    //         avgSum1 =  avgSum1 + avgArr1[i];
                    //     }
                    // }
                    // if(avgArr3.length >=15){
                    //     for (let i = 0; i < avgArr3.length; i++) {
                    //         avgSum3 =  avgSum3 + avgArr3[i];
                    //     }
                    // }
                    //var avg1 = avgSum1/5;
                    //var avg3 = avgSum3/15;
                    connection.end(function(err) {
                        // The connection is terminated now
                        console.log("Connection is terminated now.");
                        deferred.resolve({'avg1' : avgArr1 , 'avg3' : avgArr3 });
                        //next();
                    });
                }else{
                    connection.end(function(err) {
                        // The connection is terminated now
                        console.log("Connection is terminated now.");
                        deferred.resolve({'avg1' : 0 , 'avg3' : 0 });
                        //next();
                    });
                }
                
            }
        });
    });
    return deferred.promise;
}

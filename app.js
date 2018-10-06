var  config = require('./config')
var express = require('express');
var bodyParser = require('body-parser');
var mysql      = require('mysql');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Allow', 'POST GET DELETE PUT HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.setHeader('Access-Control-Expose-Headers', 'X-Requested-With, Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json;charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('BigNodeI5', true);
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

var connection = mysql.createConnection(config.mysql);
 

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('mysql connection successfull connected as id ' + connection.threadId);
});

connection.query('SELECT count(id) as final from bhavcopycore', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].final);
});
 
connection.end(function(err) {
  // The connection is terminated now
  console.log("Connection is terminated now.");
}); 

//var userRoutes = require('./user/routes.js');


//app.use('/homeautomation/user/', userRoutes);


app.listen(config.port, config.ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', config.ip, config.port, config.env)
})

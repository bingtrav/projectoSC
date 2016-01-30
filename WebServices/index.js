var express    = require("express");
 var mysql      = require('mysql');
 var connection = mysql.createConnection({
   host     : 'localhost',
   user     : 'root',
   password : '',
   database : 'DEV_DB'
 });
 var app = express();
 
 connection.connect(function(err){
 if(!err) {
     console.log("Database is connected ... \n\n");  
 } else {
     console.log("Error connecting database ... \n\n");  
 }
 });
 


app.put("/registrar", function(req,res){



});





 app.get("/login",function(req,res){
  var email = 'a@a.com';
  var contrasena = '123';
  var strQuery = 'SELECT ID from Usuario where emailverificado = 1 and activo = 1 and email = "'+email+'" and contrasena = "'+contrasena+ '"';
 connection.query(strQuery, function(err, rows, fields) {
 connection.end();
 console.log(rows);
   if (!err)
     console.log('The solution is: ', rows);
   else
     console.log('Error while performing Query.', err);
   });
 });
 
 app.listen(3000);
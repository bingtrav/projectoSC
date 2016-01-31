var express = require("express");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'dev.clcii76ge9zg.us-west-2.rds.amazonaws.com',
    user: 'Dev',
    password: 'ericsalas',
    database: 'DEV_DB',
port: 3306
});
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies

connection.connect(function(err) {
    if (!err) {
        console.log("Database is connected ... \n\n");
    } else {
        console.log("Error connecting database ... \n\n");
    }
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
});


app.get("/", function(req,res){

res.send("Holis you bitch!");

});


app.post("/registrar", function(req, res) {
    var strQuery = 'Select ID from Usuario where Email = "' + req.body.email + '" and activo = 1 and emailverificado = 1';
    connection.query(strQuery, function(err, rows) {
        if (!err) {
            if (rows.length === 0) {
                var strQuery = 'INSERT into Usuario(Nombre, Email, EmailVerificado, Contrasena, Telefono1, Activo, Tipo) values ("' + req.body.nombre + '" , "' + req.body.email + '" , 1, "' + req.body.contrasena + '" , "' + req.body.telefono + '" , 1, 1' + ')';
                connection.query(strQuery, function(err) {
                    if (!err)
                        res.sendStatus(201);
                    else
                        res.status(500).send(err);
                });
            } else {
                res.sendStatus(203);
            }
        } else {
            res.status(500).send(err);
        }
    });
});

app.get("/obtenerUsuario", function(req,res){
var strQuery = 'Select nombre, email, tipo, telefono1 from Usuario where ID=' +req.query.id+ ' and activo = 1';
connection.query(strQuery, function(err,rows){
if(!err){
  res.json(rows[0]);
}else{
     res.status(500).send(err);
}
});
});

app.get("/login", function(req, res) {
    var strQuery = 'SELECT ID from Usuario where emailverificado = 1 and activo = 1 and email = "' + req.query.email + '" and contrasena = "' + req.query.contrasena + '"';
    connection.query(strQuery, function(err, rows) {
        if (!err){
          console.log(rows.length);
            if(rows.length === 1){
res.status(200).send(rows[0].ID+"");
            }else{
               res.sendStatus(203);
            }}
        else{
            res.status(500).send(err);}
    });
});


app.listen(3000);

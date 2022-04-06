var express = require("express");
const res = require("express/lib/response");
var app = express();
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./dbb/people.db');
db.run('CREATE TABLE IF NOT EXISTS people(id INTEGER PRIMARY KEY AUTOINCREMENT, nameP TEXT, mailP TEXT, jobP TEXT)');

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use((req, res, next) => {
    console.log(`Request_Endpoint: ${req.method} ${req.url}`);
    next();
  });

app.get("/youtube", (req, res, next) => {
    res.render("youtube.ejs")
});

app.get("/flickr", (req, res, next) => {
    res.render("flickr.ejs")
});

app.get("/giphy", (req, res, next) => {
    res.render("giphy.ejs")
});

app.get("/", (req, res, next) => {
    res.render("home.ejs")
});

app.get("/dbb", (req, res, next) => {
    res.render("dbb.ejs")
});

const getPeopleData= () =>{
    return new Promise( (resolve,reject)=>{
        db.all('SELECT * FROM people',function(err,rows){
            if (err) {
                return console.log(err.message);
            }
            resolve(rows)
        })
    })
}

app.get("/dbb/peopleview", (req, res) => {
    let promise =getPeopleData().then(data =>{
        res.render("peopleview.ejs",{data:data})
    })
    
});

app.post('/dbb/add', function(req,res){
    console.log(req.body)
    db.serialize(()=>{
      db.run('INSERT INTO people(nameP,mailP,jobP) VALUES(?,?,?)', [req.body.nameP, req.body.mailP, req.body.jobP], function(err) {
        if (err) {
          return console.log(err.message);
        }
        console.log("New people has been added");
        res.send(
            "<div>New people has been added into the database with name = "+req.body.nameP+ ", mail = "+req.body.mailP + " and job = " + req.body.jobP+ "</div>"+
            "<a href='/dbb'><button class='btn btn-light'> BACK TO DBB ADD </button></a>"+
            "<a href='/dbb/peopleview'><button class='btn btn-success'> VIEW PEOPLE IN DATABASE </button></a>"
            );
      });
  });
});

app.listen(8080, () => {
 console.log("Server running on port 8080");
});


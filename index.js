var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
////////////////////////////////////////////////////////////////////////
//database management
////////////////////////////////////////////////////////////////////////

var pg = require('pg'); 


// var conString = "postgres://qbksgvencpezex:m9RwaSrL_DMY7C9Zg9b7tYDGOb@ec2-54-163-240-204.compute-1.amazonaws.com:5432/d79rur5f0g55f2";

// var client = new pg.Client(conString);


//=================================================================
//
//=================================================================
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname));

app.get('/', function(request, response) {

    response.sendfile('view.html');
    var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    var resDate = js_yyyy_mm_dd_hh_mm_ss();
    console.log(resDate);
    var query = "INSERT INTO david( ip, date,num,  other) VALUES ( '" + ip + "','" + resDate + "', '1', '');";
    var pg_client = new pg.Client({
        user: "qbksgvencpezex",
        password: "m9RwaSrL_DMY7C9Zg9b7tYDGOb",
        database: "d79rur5f0g55f2",
        port: 5432,
        host: "ec2-54-163-240-204.compute-1.amazonaws.com",
        ssl: true
    });
    pg_client.connect();
    pg_client.query(query, function(err, result) {

        if (err) {
            return console.error('error running query', err);
        } else {
            console.log("input success!");
        }
        pg_client.end();
    });

});

app.post('/getdata', function(request, response) {
    var results = [];
    var pg_client = new pg.Client({
        user: "qbksgvencpezex",
        password: "m9RwaSrL_DMY7C9Zg9b7tYDGOb",
        database: "d79rur5f0g55f2",
        port: 5432,
        host: "ec2-54-163-240-204.compute-1.amazonaws.com",
        ssl: true
    });
    pg_client.connect();
    var query = pg_client.query("SELECT * FROM david;");

    // Stream results back one row at a time
    query.on('row', function(row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function() {
        pg_client.end();
        console.log('get data success!');
        return response.json(results);
    });

});
app.post('/sendMessage', function(request, response) {
    console.log('request=>', request.body);
    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: 'gmail.user@gmail.com',
    //         pass: 'yourpass'
    //     }
    // });

    // // setup email data with unicode symbols
    // var mailOptions = {
    //     from: '"Fred Foo 👻" <foo@blurdybloop.com>', // sender address
    //     to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
    //     subject: 'Hello ✔', // Subject line
    //     text: 'Hello world ?', // plain text body
    //     html: '<b>Hello world ?</b>' // html body
    // };

    // // send mail with defined transport object
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         return console.log(error);
    //     }
    //     console.log('Message %s sent: %s', info.messageId, info.response);
    // });
    response.json({ result: 'success' });
});
app.post('/deleteItem', function(request, response) {
    console.log(request.body.idm);//request.body.idm
    var pg_client = new pg.Client({
        user: "qbksgvencpezex",
        password: "m9RwaSrL_DMY7C9Zg9b7tYDGOb",
        database: "d79rur5f0g55f2",
        port: 5432,
        host: "ec2-54-163-240-204.compute-1.amazonaws.com",
        ssl: true
    });
    pg_client.connect();
    var query = "DELETE FROM david WHERE id = "+request.body.idm +";";
    pg_client.query(query, function(err, result) {

        if (err) {
            return console.error('error running query', err);
        } else {
            console.log("deleteitem success!");
        }
        pg_client.end();
        return response.json({ result: 'success' });
    });

});
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


function js_yyyy_mm_dd_hh_mm_ss () {
  now = new Date();
  year = "" + now.getFullYear();
  month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
  day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
  hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
  minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
  second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
  return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
}
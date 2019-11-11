var bodyParser = require('body-parser')
var express = require('express');
var app = express();
var homeRouter = require('./routes/home');
var authRouter = require('./routes/auth');
var worklist = require('./routes/worklist');
var comunity = require('./routes/comunity');
var session = require('express-session');

app.use(express.static(__dirname + '/public'));
app.use('/auth',express.static(__dirname + '/public'));
app.use('/worklist',express.static(__dirname + '/public'));
app.use('/comunity',express.static(__dirname + '/public'));
app.use('/comunity/read',express.static(__dirname + '/public'));

app.use(session({
	secret: 'secret',
	resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/', homeRouter);
app.use('/auth', authRouter);
app.use('/worklist', worklist);
app.use('/comunity', comunity);

app.listen(80);

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



//app.use('/join_process', authRouter);

/*
var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    console.log(pathname);
    if(pathname === '/'){
      page.home(request, response);
    } else if(pathname === '/login'){
      page.login(request, response)
    } else if(pathname === '/join'){
      page.join(request, response)
    } else if(pathname === '/join_process'){
      page.join_process(request, response)

    }

      else{
        response.writeHead(404);
        response.end('Not found');
      }
});
*/
app.listen(80);

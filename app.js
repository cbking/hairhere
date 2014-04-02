
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var user = require('./routes/user');
var http = require('http');
var path = require('path');
var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon('public/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('this is a secret to sign and using cookies'));
// upon every request cookieSession() assigns a cookie--creating a session store in (req.session) or parses a cookie--accessing an already existing session (in req.session)
app.use(express.session({
	key: 'hairHereSID',// sets the cookies-we-assigns' key/name to hairHereSID (sessionID), by default cookieSession() assigns the cookies' names as connect.sid
	cookie: { httpOnly: false }// allows the client to be able to view their cookie data with document.cookie, if httpOnly: true, the client could not view their cookie data with document.cookie; I enable this for development purposes.
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// routes
app.get('/', routes.index);
app.post('/stylists', routes.postStylist);
app.get('/:a', routes.getA);

http.createServer(app).listen(app.get('port'), function(){
  console.log('HairHere server listening on port ' + app.get('port'));
});
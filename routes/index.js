
/*
 * GET home page.
 */

var nano = require('nano')('https://app22740206.heroku:rWVgTUcdXc4iyK7fEtCDN0Fh@app22740206.heroku.cloudant.com');
var hairhere = nano.db.use('hairhere');
var rtg   = require("url").parse('redis://redistogo:33adf787555065edbd7b94bf10d848f6@pearlfish.redistogo.com:10342/');
var redis = require("redis").createClient(rtg.port, rtg.hostname);
redis.auth("33adf787555065edbd7b94bf10d848f6");


// var client = redis.creatClient(10342, "pearlfish.redistogo.com"); 
// client.auth("9efv34fcfdfdfdf", function() {console.log("Connected!");});
// var redis_client = redis.createClient();
//var redis = require("redis").createClient();


exports.index = function(req, res){
  console.log(req.session);        
  console.log(req.cookies);
  console.log(req.signedCookies);
  res.render('landingPage', { title: 'HairHere: Find a Stylist Near You' });
};

//var stylists = {};

exports.postStylist = function(req, res) {
  //nano.db.create('example');
  console.log('This is the username %s', req.body.username);
  console.log('This is the password %s', req.body.password);
  hairhere.insert({ username: {username : req.body.username, password : req.body.password}}, function(err, body, header) {
    if (err) {
      console.log('[example.insert]', err.message);
      return;
    }
    console.log(header);
    console.log(body);
    redis.set(req.body.username, body.id, function (err, res) {
      if (err) {
        console.log('Redis key value sync failed', err);
      } else {
        redis.exists(req.body.username, function (err, resp) {console.log('Checking is redis exists has latency??');console.log(resp);})
      }
    });
});
  req.session.username = req.body.username;// stores a just reistered stylist's username in their session so we know who their web browser is for future connections
  console.log(req.session); //so you can see what it looks like
  res.writeHead(303, {'Location': '/' + req.body.username}); //Responds to the browser: "Perform GET /[username]", i.e. a redirect
  res.end();
};

exports.getA = function(req, res){
  switch(req.param('a')) {
    case 'about':
	    res.end('About Us');
	    break;
    case 'contact':
      res.end('Contact Us');
	    break;
    default:
      console.log('This is the paramater on the redirect %s',req.param('a'));
      //checks session to serve either dashBoard or viewerProfile
      redis.exists(req.param('a'), function (err, resp){
        console.log(resp);
        if (resp) {
          if (req.session.username == req.param('a')) res.end('Welcome ' + req.param('a') + ' to your dashboard');
          else res.end('Welcome to ' + req.param('a') + "'s profile.");
        }
        // if GET /nonExistingUserORroute respond 404
        else {
          res.statusCode = 404;
          res.end('Resource not found.');
        }
      });
  }
};
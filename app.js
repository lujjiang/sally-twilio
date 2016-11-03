/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
var twilio = require('twilio');
// Twilio Credentials
var config = JSON.parse(process.env.VCAP_SERVICES);
config['user-provided'].forEach(function(service){
   if (service.name == 'Twilio') {
     var accountSid = service.credentials.accountSID;
     var authToken = service.credentials.authToken;
   }
}); 
//var accountSid = 'ACbcebf97809d3a98688129a6fa7407a45'; 
//var authToken = 'd1ff7fd62b52bf6825c0e2df3bcb6cd5'; 
 
//require the Twilio module and create a REST client 
var client = require('twilio')(accountSid, authToken); 
app.get('/message',function(req, res){

	client.messages.create({ 
    		to: "+8618614093682", 
    		from: "+13372052748", 
    		body: "This is the ship that made the Kessel Run in fourteen parsecs?", 
	}, function(err, message) { 
   		if(err){
			console.log(err)
			res.send('Err');
		}
   		else{ 
   			console.log(message);
			res.send('Message send! ID: '+message.sid);
		} 
	});
});
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

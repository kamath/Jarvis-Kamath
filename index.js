var login = require("facebook-chat-api");
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { console.log(stdout) }
 
// Create simple echo bot 
login({email: "YOURFACEBOOKEMAIL", password: "YOURFACEBOOKPW"}, function callback (err, api) {
    if(err) return console.error(err);
 
    api.setOptions({listenEvents: true});
 
    var stopListening = api.listen(function(err, event) {
        if(err) return console.error(err);
 
        switch(event.type) {
          case "message":
            if(event.body === '/stop') {
              api.sendMessage("Goodbye...", event.threadID);
              return stopListening();
            }
            else if(event.body.toLowerCase().indexOf("music") > -1)
            {
            	api.sendMessage(event.body, event.threadID);
              exec(event.body.replace('music', './spotify'), function(error, stdout, stderr) { api.sendMessage(stdout, event.threadID) });
              exec(event.body.replace('Music', './spotify'), function(error, stdout, stderr) { api.sendMessage(stdout, event.threadID) });
            }
            else
            {
              exec(event.body, function(error, stdout, stderr) { api.sendMessage(stdout, event.threadID) });
            }
            api.markAsRead(event.threadID, function(err) {
              if(err) console.log(err);
            });
            break;
          case "event":
            console.log(event);
            break;
        }
    });
});
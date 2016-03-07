var login = require("facebook-chat-api");
var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
 
// Create simple echo bot 
login({email: "andy@hackgician.net", password: "mamama"}, function callback (err, api) {
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
            else if(event.body.indexOf('Spotify')) {
              api.sendMessage("TEST BOT: " + puts());
              exec("./"+event.body, puts);
              return stopListening();
            }
            else
            {
            	api.sendMessage("TEST BOT: " + puts());
                exec(event.body, puts);
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
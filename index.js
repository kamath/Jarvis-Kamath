//require modules such as the Facebook chat api
var login = require("facebook-chat-api");
var sys = require('sys')
var exec = require('child_process').exec;
var fs = require('fs');

//define a process that returns the JSON version of a string
function getStringLiteral(theFunction) {
    return JSON.stringify(theFunction.toString());
}

//login to facebook
login({
    email: "YOUREMAIL",
    password: "YOURPASSWORD"
}, function callback(err, api) {
    if (err) return console.error(err);

    api.setOptions({
        listenEvents: true
    });

    var stopListening = api.listen(function(err, event) {
        if (err) return console.error(err);
        switch (event.type) {
            //all your message interactions go here
            case "message":
                //stop listening if they say "/stop"
                if (event.body === '/stop') {
                    api.sendMessage("Goodbye...", event.threadID);
                    return stopListening();
                }

                //start music interactions
                else if (event.body.toLowerCase().indexOf("music") > -1) {
                    //send the user what you just sent them
                    api.sendMessage(event.body, event.threadID);
                    //execute the order in the terminal
                    exec(event.body.replace('music', './spotify'), function(error, stdout, stderr) {
                        finalmsg = stdout.replace('\\u001b', '')
                            //send the user confirmation
                        api.sendMessage(finalmsg, event.threadID)
                    });
                }

                //password interactions
                else if (event.body.toLowerCase().indexOf('pw') > -1) {
                    //get a saved password
                    if (event.body.toLowerCase().indexOf('get') > -1) {
                        fs.readFile('passwords.txt', 'utf8', function(err, data) {
                            if (err) throw err;
                            search = data.split(',');
                            found = false;
                            for (a = 0; a < search.length; a++) {
                            	//make sure the account of the user matches the account of the person saved
                                if (search[a].indexOf(event.body.split(' ')[2]) > -1 && search[a].split('"')[0] == event.threadID) {
                                    api.sendMessage(search[a].split('"')[2], event.threadID);
                                    found = true;
                                }
                            }
                            if (!found) {
                                api.sendMessage('Sorry, you haven\'t stored a password for that account.', event.threadID)
                            }
                        });
                    }
                    //enter in a new password
                    else {
                        place = event.body.split(' ')[1];
                        pw = event.body.split(' ')[2];
                        fs.appendFile('passwords.txt', event.threadID + '"' + place + '"' + pw + ',', (err) => {
                            if (err) throw err;
                            api.sendMessage('Password saved!', event.threadID);
                        });
                    }
                }
                //send an iMessage
                else if (event.body.toLowerCase().indexOf("msg") > -1) {
                    msg = event.body.replace('msg', '');
                    recipient = msg.split(" ")[0];
                    msg = msg.replace('recipient ', '');
                    exec('osascript sendMessage.applescript ' + recipient + ' "' + msg + '"', function(error, stdout, stderr) {
                        api.sendMessage("Message sent", event.threadID)
                    });
                }
                //show list of commands
                else if (event.body.toLowerCase().indexOf('command') > -1) {
                    api.sendMessage('music play/pause\nmusic vol up/down\nmusic play list [playlist]\nmusic play [author/song]\nmusic next/prev\npw [place] [password]\npw get [place]\nmsg [recipient] [message]\n[any mac terminal command]', event.threadID)
                }
                //otherwise just execute the command lol
                else {
                    exec(event.body, function(error, stdout, stderr) {
                        tosend = getStringLiteral(stdout)
                        console.log(tosend)
                        api.sendMessage(tosend + "", event.threadID)
                    });
                }
                //mark message as read
                api.markAsRead(event.threadID, function(err) {
                    if (err) console.log(err);
                });
                break;
            case "event":
                console.log(event);
                break;
        }
    });
});

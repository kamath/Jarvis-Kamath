var login = require("facebook-chat-api");
var sys = require('sys')
var exec = require('child_process').exec;

function getStringLiteral(theFunction) {
	return JSON.stringify(theFunction.toString());
}

login({
	email: "andy@hackgician.net",
	password: "mamama"
}, function callback(err, api) {
	if (err) return console.error(err);

	api.setOptions({
		listenEvents: true
	});

	var stopListening = api.listen(function(err, event) {
		if (err) return console.error(err);

		switch (event.type) {
			case "message":
				if (event.body === '/stop') {
					api.sendMessage("Goodbye...", event.threadID);
					return stopListening();
				} else if (event.body.toLowerCase().indexOf("music") > -1) {
					api.sendMessage(event.body, event.threadID);
					exec(event.body.replace('music', './spotify'), function(error, stdout, stderr) {
						api.sendMessage(getStringLiteral(stdout), event.threadID)
					});t
					exec(event.body.replace('Music', './spotify'), function(error, stdout, stderr) {
						api.sendMessage(getStringLiteral(stdout), event.threadID)
					});
				} else if (event.body.toLowerCase().indexOf("msg") > -1) {
					msg = event.body.replace('msg', '');
					recipient = msg.split(" ")[0];
					msg = msg.replace('recipient ', '');
					exec('osascript sendMessage.applescript ' + recipient + ' "' + msg + '"', function(error, stdout, stderr) {
						api.sendMessage("Message sent", event.threadID)
					});
				} else if (event.body.toLowerCase().indexOf('command') > -1) {
					api.sendMessage('music play/pause\nmusic vol up/down\nmusic play list [playlist]\nmusic play [author/song]\nmusic next/prev\nmsg [recipient] [message]\n[any mac terminal command]', event.threadID)
				} else {
					exec(event.body, function(error, stdout, stderr) {
						tosend = getStringLiteral(stdout)
						console.log(tosend)
						api.sendMessage(tosend+"", event.threadID)
					});
				}
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
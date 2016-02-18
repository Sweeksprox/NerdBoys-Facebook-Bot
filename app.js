// app.js

var login = require("facebook-chat-api");
var config = require("./config.js");
var commands = require("./bot_commands.js");

login({email: config.fbEmail, password: config.fbPass}, function callback (err, api) {
	if(err) return console.error(err);

	api.listen(function callback(err, message) {
		if (message.threadID == config.threadID) {

			// List all commands bot is capable of doing
			if (message.body == "!help") {
				commands.help(api);
			}

			// Send a cool skeleton to chat
			if (message.body == "!spook") {
				commands.spook(api);
			}

			// Renames the chat to [random word]Boys
			if (message.body == "!title") {
				commands.title(api);
			}

			// Tells chat who out of nerdboys.js is live
			if (message.body == "!stream") { 
				commands.stream(api);
			}
		}
	});
});
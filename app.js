// app.js

var login = require("facebook-chat-api");
var config = require("./config.js");

login({email: config.fbEmail, password: config.fbPass}, function callback (err, api) {
	if(err) return console.error(err);


	api.listen(function callback(err, message) {
		if (message.threadID == config.threadID) {

			// List all commands bot is capable of doing
			if (message.body == "!help") {
				var help = "Here is a list of commands you can use to control BotBoy:\n\n !title - Generates a new random title for boys chat. \n\n !spook - Makes a cool skeleton for everyone to enjoy."
				api.sendMessage(help, config.threadID);
			}

			// Send a cool skeleton to chat
			if (message.body == "!spook") {
				var spook = "▒▒▒░░░░░░░░░░▄▐░░░░\n▒░░░░░░▄▄▄░░▄██▄░░░\n░░░░░░▐▀█▀▌░░░░▀█▄░\n░░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░░▄▄▄██▀▀▀▀░░░░░\n░░░░█▀▄▄▄█░▀▀░░░░░░\n░░░░▌░▄▄▄▐▌▀▀▀░░░░░\n░▄░▐░░░▄▄░█░▀▀░░░░░\n░▀█▌░░░▄░▀█▀░▀░░░░░\n░░░░░░░░▄▄▐▌▄▄░░░░░\n░░░░░░░░▀███▀█░▄░░░\n░░░░░░░▐▌▀▄▀▄▀▐▄░░░\n░░░░░░░▐▀░░░░░░▐▌░░\n░░░░░░░█░░░░░░░░█░░\n░░░░░░▐▌░░░░░░░░░█░";
				api.sendMessage(spook, config.threadID);
			}

			// Renames the chat to [random word]Boys
			if (message.body == "!title") {
				api.setTitle(words() + "Boys", config.threadID, function (err, obj) {
					if (err) console.log(err);
				})
			}
		}
	});
});
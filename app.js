// app.js

var login = require("facebook-chat-api");
var config = require("./config_files/config.js");
var commands = require("./bot_commands.js");
var cronJobs = require("./cron_jobs.js");
var nerdFiles = require("./nerd_files.js");
var chat = require("./chat.js");

login({email: config.fbEmail, password: config.fbPass}, function callback (err, api) {
	if(err) return console.error(err);
	cronJobs.init(api);
	nerdFiles.init();
	chat.init(api);

	api.listen(function callback(err, message) {
		if (message.threadID == config.threadID) {

			// participate in good vibes (send thumbs up after 3 consecutive thumbs up)
			commands.goodVibes(message);

			// List all commands bot is capable of doing
			if (message.body == "!help") {
				commands.help();
			}

			// Send a cool skeleton to chat
			if (message.body == "!spook") {
				commands.spook();
			}

			// Tells chat who out of nerdboys.js is live
			if (message.body == "!streams") {
				commands.streams();
			}

			// Maps NerdBoy Twitch username to real name if available.
			if (message.body == "!nerds") {
				commands.nerds();
			}
		}
	});
});
// app.js

var login = require("facebook-chat-api");
var config = require("./config.js");
var commands = require("./bot_commands.js");
var cronJobs = require("./cron_jobs.js")

login({email: config.fbEmail, password: config.fbPass}, function callback (err, api) {
	if(err) return console.error(err);
	cronJobs.init(api);

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

			// Tells chat who out of nerdboys.js is live
			if (message.body == "!streams") {
				commands.streams(api);
			}

			// Maps NerdBoy Twitch username to real name if available.
			if (message.body == "!nerds") {
				commands.nerds(api);
			}
		}
	});
});
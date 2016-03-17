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
			commands.parseMessage(message);
		}
	});
});
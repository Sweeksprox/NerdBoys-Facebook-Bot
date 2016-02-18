// bot_commands.js

var nerdboys = require("./nerdboys.js");
var config = require("./config.js");
var words = require("random-words");

var commands = {};

commands.help = function (api) {
	var help = "Here is a list of commands you can use to control BotBoy: \n\n !spook - Makes a cool skeleton for everyone to enjoy. \n\n !stream - Lists which nerdBoys are live on Twitch and which are offline."
	api.sendMessage(help, config.threadID);
}

commands.spook = function (api) {
	var spook = "▒▒▒░░░░░░░░░░▄▐░░░░\n▒░░░░░░▄▄▄░░▄██▄░░░\n░░░░░░▐▀█▀▌░░░░▀█▄░\n░░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░░▄▄▄██▀▀▀▀░░░░░\n░░░░█▀▄▄▄█░▀▀░░░░░░\n░░░░▌░▄▄▄▐▌▀▀▀░░░░░\n░▄░▐░░░▄▄░█░▀▀░░░░░\n░▀█▌░░░▄░▀█▀░▀░░░░░\n░░░░░░░░▄▄▐▌▄▄░░░░░\n░░░░░░░░▀███▀█░▄░░░\n░░░░░░░▐▌▀▄▀▄▀▐▄░░░\n░░░░░░░▐▀░░░░░░▐▌░░\n░░░░░░░█░░░░░░░░█░░\n░░░░░░▐▌░░░░░░░░░█░";
	api.sendMessage(spook, config.threadID);
}

commands.stream = function (api) {
	var nerds = nerdboys.channels;
	var msg = "NerdBoy streaming status: \n\n";
	console.log(nerds.length)
	for (var i = 0; i < nerds.length; i++) {
		if (nerds[i].live) {
			msg += "ONLINE : " + nerds[i].name + "\n";
		} else {
			msg += "OFFLINE: " + nerds[i].name + "\n";
		}
	}

	api.sendMessage(msg, config.threadID);
}

module.exports = commands;
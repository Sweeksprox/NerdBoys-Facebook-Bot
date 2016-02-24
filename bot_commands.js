// bot_commands.js

var nerdboys = require("./nerdboys.js");
var config = require("./config.js");
var words = require("random-words");

var commands = {};

commands.help = function (api) {
	var help = "Here is a list of commands you can use to control BotBoy: \n\n !spook - Makes a cool skeleton for everyone to enjoy. \n\n !streams - Lists which NerdBoys are live. \n\n !nerds - Maps a real life name to a NerdBoy Twitch username"
	api.sendMessage(help, config.threadID);
}

commands.spook = function (api) {
	var spook = "▒▒▒░░░░░░░░░░▄▐░░░░\n▒░░░░░░▄▄▄░░▄██▄░░░\n░░░░░░▐▀█▀▌░░░░▀█▄░\n░░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░░▄▄▄██▀▀▀▀░░░░░\n░░░░█▀▄▄▄█░▀▀░░░░░░\n░░░░▌░▄▄▄▐▌▀▀▀░░░░░\n░▄░▐░░░▄▄░█░▀▀░░░░░\n░▀█▌░░░▄░▀█▀░▀░░░░░\n░░░░░░░░▄▄▐▌▄▄░░░░░\n░░░░░░░░▀███▀█░▄░░░\n░░░░░░░▐▌▀▄▀▄▀▐▄░░░\n░░░░░░░▐▀░░░░░░▐▌░░\n░░░░░░░█░░░░░░░░█░░\n░░░░░░▐▌░░░░░░░░░█░";
	api.sendMessage(spook, config.threadID);
}

commands.streams = function (api) {
	var nerds = nerdboys.channels;
	var msg = "These NerdBoys are live right now: \n\n";
	var noStreams = true;

	for (var i = 0; i < nerds.length; i++) {
		if (nerds[i].live) {
			noStreams = false;;
			msg += nerds[i].name.toUpperCase() + " [playing " + nerds[i].game + "]\n";
		}
	}

	if (noStreams) {
		api.sendMessage("no NERDS online, NERD.", config.threadID);
	} else {
		api.sendMessage(msg, config.threadID);
	}
	
}

commands.nerds = function (api) {
	var nerds = nerdboys.channels;
	var msg = ""

	for (var i = 0; i < nerds.length; i++) {
		if (nerds[i].irlName != null) {
			msg += nerds[i].name + " --> " + nerds[i].irlName + "\n\n";
		}
	}

	api.sendMessage(msg, config.threadID);
}

var vibeCount = 0;
var lastThumb = false;
var currentThumb = false;
commands.goodVibes = function (api, message) {
	if (message["attachments"].length > 0 && message["attachments"][0]["stickerID"] == "369239263222822") {
		vibeCount++;
		if (vibeCount >= 3) { 
			vibeCount = 0;
			api.sendMessage({sticker: 369239263222822}, config.threadID);
		}
	} else {
		vibeCount = 0;
	}
}



module.exports = commands;
// bot_commands.js

var nerdboys = require("./config_files/nerdboys.js");
var config = require("./config_files/config.js");
var words = require("random-words");
var chat = require("./chat.js");


exports.parseMessage = function (message){
	// participate in good vibes (send thumbs up after 3 consecutive thumbs up)
	goodVibes(message);

	// List all commands bot is capable of doing
	if (message.body == "!help") {
		help();
	}

	// Send a cool skeleton to chat
	if (message.body == "!spook") {
		spook();
	}

	// Tells chat who out of nerdboys.js is live
	if (message.body == "!streams") {
		streams();
	}

	// Maps NerdBoy Twitch username to real name if available.
	if (message.body == "!nerds") {
		nerds();
	}
}

function help () {
	var help = "Here is a list of commands you can use to control BotBoy: \n\n !spook - Makes a cool skeleton for everyone to enjoy. \n\n !streams - Lists which NerdBoys are live. \n\n !nerds - Maps a real life name to a NerdBoy Twitch username"
	chat.send(help);
}

function spook () {
	var spook = "▒▒▒░░░░░░░░░░▄▐░░░░\n▒░░░░░░▄▄▄░░▄██▄░░░\n░░░░░░▐▀█▀▌░░░░▀█▄░\n░░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░░▄▄▄██▀▀▀▀░░░░░\n░░░░█▀▄▄▄█░▀▀░░░░░░\n░░░░▌░▄▄▄▐▌▀▀▀░░░░░\n░▄░▐░░░▄▄░█░▀▀░░░░░\n░▀█▌░░░▄░▀█▀░▀░░░░░\n░░░░░░░░▄▄▐▌▄▄░░░░░\n░░░░░░░░▀███▀█░▄░░░\n░░░░░░░▐▌▀▄▀▄▀▐▄░░░\n░░░░░░░▐▀░░░░░░▐▌░░\n░░░░░░░█░░░░░░░░█░░\n░░░░░░▐▌░░░░░░░░░█░";
	chat.send(spook);
}

function streams () {
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
		chat.send("no NERDS online, NERD.");
	} else {
		chat.send(msg);
	}
	
}

function nerds () {
	var nerds = nerdboys.channels;
	var msg = ""

	for (var i = 0; i < nerds.length; i++) {
		if (nerds[i].irlName != null) {
			msg += nerds[i].name + " --> " + nerds[i].irlName + "\n\n";
		}
	}

	chat.send(msg);
}

var vibeCount = 0;
var lastThumb = false;
var currentThumb = false;
function goodVibes (message) {
	if (message["attachments"].length > 0 && message["attachments"][0]["stickerID"] == "369239263222822") {
		vibeCount++;
		if (vibeCount >= 3) { 
			vibeCount = 0;
			chat.send({sticker: 369239263222822});
		}
	} else {
		vibeCount = 0;
	}
}
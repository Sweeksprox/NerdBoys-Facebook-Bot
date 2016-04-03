// bot_commands.js

var nerdboys = require("./config_files/nerdboys.js");
var config = require("./config_files/config.js");
var words = require("random-words");
var chat = require("./chat.js");
var syllable = require('syllable');

exports.parseMessage = function (message){
	// participate in good vibes (send thumbs up after 3 consecutive thumbs up)
	goodVibes(message);
	checkHaiku(message);
	// lmao(message);

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
var thumbSize = 0;
var thumbs = ["369239263222822", "369239343222814", "369239383222810"];
function goodVibes (message) {
	var size;
	try {
		size = thumbs.indexOf(message["attachments"][0]["stickerID"]);
	}
	catch (err) {
		size = -1;
	}
	if (size >= 0) {
		vibeCount++;
		thumbSize += size + 1;
		if (vibeCount >= 3) { 
			var thumb = "";
			var trueThumb = true;
			switch (thumbSize) {
				case 3:
				case 4:
					thumb = "369239263222822";
					break;
				case 5:
				case 6:
				case 7:
					thumb = "369239343222814";
					break;
				case 8:
				case 9:
					thumb = "369239383222810";
					break;
				default:
					trueThumb = false;
			}
			vibeCount = 0;
			thumbSize = 0;
			if (trueThumb) {
				chat.send({sticker: thumb});
			}
		}
	}
	else {
		vibeCount = 0;
		thumbSize = 0;
	}
}

function checkHaiku (message) {
	// var syllables = syllable(message.body);
	var msg = "";
	var haikuArr = message.body.split(" ");
	var parsedHaiku = fiveSevenFive(haikuArr);
	if (parsedHaiku != null) {
		for (var i = 0; i < haikuArr.length; i++) {
			msg += haikuArr[i] + " ";
			if (i == parsedHaiku[0] || i == parsedHaiku[1] || i == parsedHaiku[2]) {
				msg += "\n"
			}
		}
		chat.send(msg);
	}	
}

function fiveSevenFive(haiku) {
	var sylArray = [0, 0, 0];
	var haikuIndex = [0, 0, 0];

	//does it stop counting after line breaks?
	//bednars HM HM HM HM tests made it go over 5,7,5 was this because line breaks

	for (var i = 0; i < haiku.length; i++) {
		if (sylArray[0] < 5) {
			sylArray[0] += syllable(haiku[i]);
			if (sylArray[0] == 5) haikuIndex[0] = i;
		} else if (sylArray[1] < 7) {
			sylArray[1] += syllable(haiku[i]);
			if (sylArray[1] == 7) haikuIndex[1] = i;
		} else {
			sylArray[2] += syllable(haiku[i]);
			if (sylArray[2] == 5) haikuIndex[2] = i;
		}
	}

	console.log(sylArray)

	if (sylArray[0] == 5 && sylArray[1] == 7 && sylArray[2] == 5) {
		return haikuIndex;
	} else {
		return null;
	}
}

function lmao (message) {
	var regex = /a+y+/ig
	if (message.body.match(regex)) {
		chat.send("lmao")
	}
}

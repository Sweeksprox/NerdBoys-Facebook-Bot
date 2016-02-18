// bot_commands.js

var commands = {};

commands.help = function (api) {
	var help = "Here is a list of commands you can use to control BotBoy:\n\n !title - Generates a new random title for boys chat. \n\n !spook - Makes a cool skeleton for everyone to enjoy."
	api.sendMessage(help, config.threadID);
}

commands.spook = function (api) {
	var spook = "▒▒▒░░░░░░░░░░▄▐░░░░\n▒░░░░░░▄▄▄░░▄██▄░░░\n░░░░░░▐▀█▀▌░░░░▀█▄░\n░░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░░▄▄▄██▀▀▀▀░░░░░\n░░░░█▀▄▄▄█░▀▀░░░░░░\n░░░░▌░▄▄▄▐▌▀▀▀░░░░░\n░▄░▐░░░▄▄░█░▀▀░░░░░\n░▀█▌░░░▄░▀█▀░▀░░░░░\n░░░░░░░░▄▄▐▌▄▄░░░░░\n░░░░░░░░▀███▀█░▄░░░\n░░░░░░░▐▌▀▄▀▄▀▐▄░░░\n░░░░░░░▐▀░░░░░░▐▌░░\n░░░░░░░█░░░░░░░░█░░\n░░░░░░▐▌░░░░░░░░░█░";
	api.sendMessage(spook, config.threadID);
}

commands.title = function (api, word) {
	api.setTitle(word + "Boys", config.threadID, function (err, obj) {
		if (err) console.log(err);
	});
}

module.commands = config;
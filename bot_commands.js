// bot_commands.js

var async = require("async");
var nerdboys = require("./nerdboys.js");
var config = require("./config.js");
var http = require("https");
var words = require("random-words");

var commands = {};

commands.help = function (api) {
	var help = "Here is a list of commands you can use to control BotBoy:\n\n !title - Generates a new random title for boys chat. \n\n !spook - Makes a cool skeleton for everyone to enjoy."
	api.sendMessage(help, config.threadID);
}

commands.spook = function (api) {
	var spook = "▒▒▒░░░░░░░░░░▄▐░░░░\n▒░░░░░░▄▄▄░░▄██▄░░░\n░░░░░░▐▀█▀▌░░░░▀█▄░\n░░░░░░▐█▄█▌░░░░░░▀█▄\n░░░░░░░▀▄▀░░░▄▄▄▄▄▀▀\n░░░░░▄▄▄██▀▀▀▀░░░░░\n░░░░█▀▄▄▄█░▀▀░░░░░░\n░░░░▌░▄▄▄▐▌▀▀▀░░░░░\n░▄░▐░░░▄▄░█░▀▀░░░░░\n░▀█▌░░░▄░▀█▀░▀░░░░░\n░░░░░░░░▄▄▐▌▄▄░░░░░\n░░░░░░░░▀███▀█░▄░░░\n░░░░░░░▐▌▀▄▀▄▀▐▄░░░\n░░░░░░░▐▀░░░░░░▐▌░░\n░░░░░░░█░░░░░░░░█░░\n░░░░░░▐▌░░░░░░░░░█░";
	api.sendMessage(spook, config.threadID);
}

commands.title = function (api) {
	api.setTitle(words + "Boys", config.threadID, function (err, obj) {
		if (err) console.log(err);
	});
}

commands.stream = function (api) {
	var msg = "These boys are live: \n\n";
	var live = [];
	var offline = [];

	async.eachSeries(nerdboys.channels, function iteratee(nerd, callback) {
		var req = http.request({
			host: 'api.twitch.tv',
			path: '/kraken/streams/'+nerd
		}, function (res) {
			var body = '';
			res.on('data', function (data) {
				body += data;
			});
			res.on('end', function () {
				var parsed = JSON.parse(body);
				if (parsed["stream"] != null) {
					live.push(nerd);
					// msg += nerd + "\n"; 
				} else {
					offline.push(nerd);
				}
				callback();
			});
		});
		req.end();

	}, function(err){
		if(err) {
			console.log(err);
		} else {
			for (var i = 0; i < live.length; i++) {
				msg += live[i] + "\n";
			}
			msg += "------------\nThese nerds are offline: \n\n"
			for (var i = 0; i < offline.length; i++) {
				msg += offline[i] + "\n";
			}
			api.sendMessage(msg, config.threadID);
		}
	});


}

module.exports = commands;
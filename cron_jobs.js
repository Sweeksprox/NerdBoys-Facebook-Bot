// cron_jobs.js

var words = require("random-words");
var cronJob = require('cron').CronJob;
var config = require("./config_files/config.js");
var async = require("async");
var nerdboys = require("./config_files/nerdboys.js");
var request = require("request");
var chat = require("./chat.js");
var fs = require('fs');
var login = require("facebook-chat-api");
var commands = require("./bot_commands.js");

var nerds = nerdboys.channels.sort(sortNerds);
var nerdURL = "https://api.twitch.tv/kraken/streams?channel=" + getNerdString(nerds);



exports.init = function () {

	// Every day at 4 AM reconnect Facebook chat
	new cronJob('00 00 4 * * *', function() {
		chat.getapi().logout(function(err) {
			login({email: config.fbEmail, password: config.fbPass}, function callback (err, api) {
				if(err) return console.error(err);
				chat.setapi(api);

				api.listen(function callback(err, message) {
					if (message.threadID == config.threadID) {
						commands.parseMessage(message);
					}
				});
			});
		});
	}, null, true, config.timeZone);

	// Every day at 11am change the chat title
	new cronJob('00 00 11 * * *', function() {
		var word = words();
		var title = word.charAt(0).toUpperCase() + word.slice(1) + "Boys";
		var msg = title.toUpperCase().split('').join(' ');
		/*
		var msgSplit = word.split();
		var msg = "";
		for (i = 0; i < msgSplit.length; i++) {
			msg += msgSplit[i].toUpperCase() + " ";
		}
		*/
		chat.getapi().setTitle(title, config.threadID, function (err, obj) {
			if (err) console.log(err);
		});
		chat.send(msg);
	}, null, true, config.timeZone);



	// Every minute check if any nerdBoy is live on Twitch
	new cronJob('0 */1 * * * *', function() {
		request(nerdURL, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var parsed = JSON.parse(body);
				var streams = parsed["streams"].sort(sortStreams);
				var index = 0;
				var msg = "";

				for (var i = 0; i < nerds.length; i++) {
					if (streams[index] && nerds[i].name == streams[index]["channel"]["name"]) { // online
						if (!nerds[i].live) { // going online
							var playing = streams[index]["game"];
							nerds[i].live = true;
							nerds[i].game = playing;
							msg += "Hey, boys! " + nerds[i].name.toUpperCase() + " has just gone live! This nerd is currently playing " + playing.toUpperCase();
						} else if (parseInt(nerds[i].viewerCount) < parseInt(streams[index]["viewers"])) { // update max viewer count
							nerds[i].viewerCount = parseInt(streams[index]["viewers"]);
						}
						index++;
					} else if (nerds[i].live) { // going offline
						nerds[i].live = false;
						checkStats(nerds[i]);
					}
				}

				if (msg.length > 0) chat.send(msg)
			}
		});
	}, null, true, config.timeZone);
}





function checkStats (nerd) { //check stats of channel at the end of a stream

	request('https://api.twitch.tv/kraken/channels/' + nerd.name.toLowerCase(), function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var msg = "Show's over! Thanks for streaming " + nerd.name.toUpperCase() + "!\n";
			msg += "You had around " + nerd.viewerCount + " people hanging around in chat this stream!\n";
			nerd.viewerCount = 0;

			var parsed = JSON.parse(body);
			var views = parseInt(parsed["views"]);
			var followers = parseInt(parsed["followers"]);


			fs.readFile("./nerds/" + nerd.name + '.txt', function(err, data) {
				var stats = data.toString('utf8').split(" ");

				var oldViews = parseInt(stats[0]);
				var oldFollowers = parseInt(stats[1]);



				if (oldViews < views) {
					msg += "You gained " + (views-oldViews) + " more views this stream!\n";
				}

				if (oldFollowers < followers) {
					msg += "You gained " + (followers-oldFollowers) + " followers this stream!\n";
				}

				fs.writeFile("./nerds/" + nerd.name + '.txt', views + " " + followers, function(err) {
					if (err) console.log(err);
					else chat.send(msg);
				});
			});

		}
	});
}

function getNerdString (nerds) {
	var streams = "";
	for (var i = 0; i < nerds.length; i++) {
		streams += nerds[i].name.toLowerCase() + ","
	}
	streams = streams.slice(0, streams.length-1)
	return streams;
}

function sortStreams(a,b) {
  if (a.channel.name < b.channel.name)
    return -1;
  else if (a.channel.name > b.channel.name)
    return 1;
  else 
    return 0;
}

function sortNerds(a,b) {
  if (a.name < b.name)
    return -1;
  else if (a.name > b.name)
    return 1;
  else 
    return 0;
}

// cron_jobs.js

var words = require("random-words");
var cronJob = require('cron').CronJob;
var config = require("./config.js");
var async = require("async");
var nerdboys = require("./nerdboys.js");
var request = require("request");

var fs = require('fs');


exports.init = function (api) {

	// Every day at 11am change the chat title
	new cronJob('00 00 11 * * *', function() {
		var word = words();
		word = word.charAt(0).toUpperCase() + word.slice(1) + "Boys";
		api.setTitle(word, config.threadID, function (err, obj) {
			if (err) console.log(err);
		});
	}, null, true, config.timeZone);


	// Every 5 minutes check if any nerdBoy is live on Twitch
	new cronJob('0 */5 * * * *', function() {
		var live;
		async.eachSeries(nerdboys.channels, function iteratee(nerd, callback) {
			console.log("working on this boy... " + nerd.name)
			live = false;
			request('https://api.twitch.tv/kraken/streams/' + nerd.name.toLowerCase(), function (error, response, body) {
				console.log("beginning of request")
				if (!error && response.statusCode == 200) {
					console.log("no error and status code 200")
					var parsed = JSON.parse(body);
					console.log("parsed body")

					if (parsed["stream"] != null) { // is online
						console.log("stream is live")
						live = true
						var playing = parsed["stream"]["game"];
						nerd.game = playing;

						if (nerd.live != live) { // going online
							console.log("stream is going from offline to live")
							nerd.live = live;

							console.log("stream is live, send message");
							api.sendMessage("Hey, boys! " + nerd.name.toUpperCase() + " has just gone live! This nerd is currently playing " + playing.toUpperCase(), config.threadID);
							callback();
						} else { // remains online
							if (parseInt(nerd.viewerCount) < parseInt(parsed["stream"]["viewers"])) {
								nerd.viewerCount = parseInt(parsed["stream"]["viewers"]);
							}
							callback();
						}
						
					} else { // is offline
						if (nerd.live != live) { //going offline
							nerd.live = live;
							checkStats(nerd, parsed, api);
							callback();

						} else { //remains offline
							callback();
						}						
					}

				}
			});
		});
	}, null, true, config.timeZone);
}

function checkStats (nerd, parsed, api) { //check stats of channel at the end of a stream

	request('https://api.twitch.tv/kraken/channels/' + nerd.name.toLowerCase(), function (error, response, body) {
		
		if (!error && response.statusCode == 200) {
			var msg = "Show's over! Thanks for streaming " + nerd.name.toUpperCase() + "!\n";
			msg += "You had around " + nerd.viewerCount + " people hanging around in chat this stream!\n";
			nerd.viewerCount = 0;

			var parsed = JSON.parse(body);
			var views = parseInt(parsed["views"]);
			var followers = parseInt(parsed["followers"]);


			fs.readFile("./nerds/" + nerd.name + '.txt', function(err, data) {
				console.log(data.toString('utf8'));
				var stats = data.toString('utf8').split(" ");

				var oldViews = parseInt(stats[0]);
				var oldFollowers = parseInt(stats[1]);



				if (oldViews < views) {
					msg += "You gained " + (views-oldViews) + " more views this stream!\n";
					views = oldViews;
				}

				if (oldFollowers < followers) {
					msg += "You gained " + (followers-oldFollowers) + " followers this stream!\n";
					followers = oldFollowers;
				}

				fs.writeFile("./nerds/" + nerd.name + '.txt', views + " " + followers, function(err) {
					if (err) console.log(err);
					else api.sendMessage(msg, config.threadID);
				});
			});

		}
	});
}
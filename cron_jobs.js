// cron_jobs.js

var words = require("random-words");
var cronJob = require('cron').CronJob;
var config = require("./config.js");
var async = require("async");
var nerdboys = require("./nerdboys.js");
var http = require("https");


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
			live = false;
			var req = http.request({
				host: 'api.twitch.tv',
				path: '/kraken/streams/'+nerd.name.toLowerCase()
			}, function (res) {
				var body = '';
				res.on('data', function (data) {
					body += data;
				});
				res.on('end', function () {
					var parsed = JSON.parse(body);
					if (parsed["stream"] != null) {
						live = true
						var playing = parsed["stream"]["game"];
						nerd.game = playing;
					}
					if (nerd.live != live) {
						nerd.live = live;
						if (live) {
							api.sendMessage("Hey, boys! " + nerd.name.toUpperCase() + " has just gone live! This nerd is currently playing " + playing.toUpperCase() + ". Check out the stream here: twitch.tv/" + nerd.name.toLowerCase(), config.threadID);
						}
					}
				});
			});
			req.end();
			callback();
		});
	}, null, true, config.timeZone);
}
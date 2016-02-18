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
		api.setTitle(words() + "Boys", config.threadID, function (err, obj) {
			if (err) console.log(err);
		});
	}, null, true, config.timeZone);

	// Every 5 minutes check if any nerdBoy is live on Twitch
	new cronJob('*/5 * * * * *', function() {
		var live = false;
		async.eachSeries(nerdboys.channels, function iteratee(nerd, callback) {
			var req = http.request({
				host: 'api.twitch.tv',
				path: '/kraken/streams/'+nerd.name
			}, function (res) {
				var body = '';
				res.on('data', function (data) {
					body += data;
				});
				res.on('end', function () {
					var parsed = JSON.parse(body);
					if (parsed["stream"] != null) {
						live = true
					}
					if (nerd.live != live) {
						nerd.live = live;
						if (live) {
							api.sendMessage("Hey boys! " + nerd.name + " has just gone live!", config.threadID);
						}
					}
					callback();
				});
			});
			req.end();
		});
	}, null, true, config.timeZone);
}
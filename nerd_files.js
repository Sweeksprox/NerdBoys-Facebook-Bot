// nerd_files.js

var nerds = require("./config_files/nerdboys.js").channels;
var fs = require("fs");

exports.init = function () {
	for (var i = 0; i < nerds.length; i++) {
		if (!fs.existsSync("./nerds/" + nerds[i].name + '.txt')) {
			fs.writeFile("./nerds/" + nerds[i].name + '.txt', "0 0", function (err) {
				if (err) console.log(err);
			});
		}


	}
}
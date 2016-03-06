// chat.js

var config = require("./config_files/config.js");
var api;

exports.init = function (facebookAPI) {
	api = facebookAPI;
}

exports.send = function(message) {
	api.sendMessage(message, config.threadID);
}
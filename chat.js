// chat.js

var config = require("./config_files/config.js");
var chat = {api: null}

exports.init = function (api) {
	chat.api = api;
}

exports.send = function(message) {
	chat.api.sendMessage(message, config.threadID);
}

exports.getapi = function() {
	return chat.api
}

exports.setapi = function(api) {
	chat.api = api;
}


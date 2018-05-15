"use strict";

var calc = require("./../calc.js");

var irc = require("irc");

var configuration = {
	channels: ["#proglangdesign"],
	server: "irc.freenode.net",
	name: "calcbot"
};

var bot = new irc.Client(configuration.server, configuration.name, {
	channels: configuration.channels
});

bot.addListener("message", function(from, to, text, message) {
	if (from != "calcbot" && text.substring(0, 5) == "calc=") {
		bot.say(configuration.channels[0], (() => {
			try {
				return calc.print(calc.calc(text));
			} catch(err) {
				console.log(err);
				return err.toString();
			}
		})());
	}
});
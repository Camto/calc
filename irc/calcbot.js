"use strict";

var calc = require("./../calc/calc");

var irc = require("irc");

var config = {
	channels: ["#tst"],
	server: "irc.freenode.net",
	name: "calcbot"
};

var bot = new irc.Client(config.server, config.name, {
	channels: config.channels
});

bot.addListener("message", function(from, to, text, message) {
	if (from != "calcbot" && text.substring(0, 5) == "calc=") {
		bot.say(config.channels[0], (() => {
			try {
				return calc.print(calc.calc(text));
			} catch(err) {
				console.log(calc.err_to_str(err));
				return calc.err_to_str(err);
			}
		})().replace("\t", "    "));
	}
});
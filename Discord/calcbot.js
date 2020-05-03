"use strict";

var calc = require("./../calc/calc");
var auth = require("./auth.json");
var discord = require("discord.js");

var client = new discord.Client();

client.on("ready", () => {
	console.log(`${client.user.tag} is logged in!`);
	client.user.setActivity("calc= h");
});

client.on("message", msg => {
	if(
		msg.author.username != "calcbot" &&
		msg.content.substring(0, 5) == "calc="
	) {
		var result = (() => {
			try {
				return calc.print(calc.calc(msg.content));
			} catch(err) {
				console.log(calc.err_to_str(err));
				return calc.err_to_str(err);
			}
		})();
		
		msg.channel.send(result);
	}
});

client.login(auth.token);
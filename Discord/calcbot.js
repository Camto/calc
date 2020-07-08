"use strict";

var calc = require("./../calc/calc");
var discord = require("discord.js");

var client = new discord.Client();

client.on("ready", () => {
	console.log(`${client.user.tag} is logged in!`);
	client.user.setActivity("calc= h");
});

client.on("message", msg => {
	if(msg.content == "calcbotact") {
		client.user.setActivity("calc= h");
		console.log('Reset activity to "calc= h".');
	}
	
	if(
		!msg.author.bot &&
		msg.content.substring(0, 5) == "calc="
	) {
		console.log("Got request.")
		
		var result = (() => {
			try {
				return calc.print(calc.calc(msg.content), 10000);
			} catch(err) {
				console.log(`Ran program
  ${msg.content}
with error
  ${calc.err_to_str(err)}`);
				return calc.err_to_str(err);
			}
		})();
		
		msg.channel.send(result);
	}
});

client.login(process.env.TOKEN);
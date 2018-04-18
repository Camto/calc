var calc = require("./../calc.js");

var Discord = require("discord.io");
var logger = require("winston");
var auth = require("./auth.json");

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
	colorize: true
});
logger.level = "debug";

var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on("ready", function (evt) {
	logger.info(`${bot.username} is logged in!`);
});
bot.on("message", function(user, user_id, channel_id, message, event) {
	if (user != "calcbot" && message.substring(0, 5) == "calc=") {
		bot.sendMessage({
			to: channel_id,
			message: (() => {
				try {
					return calc.print(calc.calc(message));
				} catch(err) {
					console.log(err);
					return err;
				}
			})()
		});
	 }
});
"use strict";

var fs = require("fs");
var calc = require("./../calc/calc");

var args = process.argv.slice(2);

// Running exprs directly from the command line can be added later.
if(args.length >= 1) {
	var prog = fs.readFileSync(args[0]);
	var result;
	var result = (() => {
		try {
			return calc.print(calc.calc("calc= " + prog));
		} catch(err) {
			console.log(`Ran program
${prog}
with error`);
			return calc.err_to_str(err);
		}
	})();
	console.log(result);
} else {
	console.log("calc=Error: did not provide file to read.");
}
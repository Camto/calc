"use strict";

try {
	var lex = require("./calc/lex");
	var parse = require("./calc/parse");
	var run = require("./calc/run");
} catch(err) {}

function calc(code_, max_time) {
	if(code_.substr(0, 5) != "calc=") {
		throw "There is no `calc=`.";
	}
	var code = code_.substr(5, code_.length);
	var tokens = lex(code);
	var ast = parse(tokens);
	try {
		return run(ast, max_time);
	} catch(err) {
		throw "calc=" + (!(err instanceof Error)
			? err
			: err.stack.split("\n").slice(0, 2).join("\n"));
	}
}

function print(value) {
	if(value instanceof Array) {
		var result = "calc=";
		for(let cou = 0; cou < value.length; cou++) {
			result += print(value[cou]);
			if(cou < value.length - 1) {
				result += " ";
			}
		}
		return result;
	} else {
		
		switch(value.type) {
			case "string":
			case "symbol":
			case "operator":
				return value.data;
				break;
			case "number":
				return Math.floor(value.data * 100000) / 100000
			case "list":
				var list = "[";
				for(let cou = 0; cou < value.data.length; cou++) {
					list += print(value.data[cou]);
					if(cou < value.data.length - 1) {
						list += ", ";
					}
				}
				list += "]";
				return list;
				break;
			case "function":
				return `{${value.args.join(" ")} -> <function definition>}`
				break;
		}
		
	}
}

try {
	module.exports = {calc, print};
} catch(err) {
	console.log("`module.exports` is not supported.");
}
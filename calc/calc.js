"use strict";

var lex = require("./lex");
var parse = require("./parse");
var run = require("./run");
var print = require("./print");

function calc(code_, max_time) {
	if(code_.substr(0, 5) != "calc=") {
		throw "Error: there is no \"calc=\".";
	}
	var code = code_.substr(5, code_.length);
	try {
		var tokens = lex(code);
		var ast = parse(tokens);
		return run(ast, max_time, calc);
	} catch(err) {
		throw "calc=" + err_to_str(err);
	}
}

var err_to_str = err => !(err instanceof Error)
	? err
	: "\n" + err.stack.split("\n").slice(0, 2).join("\n\t");

module.exports = {calc, print, err_to_str};
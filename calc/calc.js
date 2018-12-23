"use strict";

var lex = require("./lex");
var parse = require("./parse");
var run = require("./run");
var print = require("./print");

function calc(code_, max_time) {
	if(code_.substr(0, 5) != "calc=") {
		throw "There is no \"calc=\".";
	}
	var code = code_.substr(5, code_.length);
	var tokens = lex(code);
	var ast = parse(tokens);
	try {
		return run(ast, max_time);
	} catch(err) {
		throw "calc=" + err_to_string(err);
	}
}

var err_to_string = err => !(err instanceof Error)
	? err
	: "\n" + err.stack.split("\n").slice(0, 2).join("\n\t");

module.exports = {calc, print, err_to_string};
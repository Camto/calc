"use strict";

var run_part = require("./run part");	
var standard_library = require("./standard library");

function run(ast, max_time = Infinity, calc) {
	var stack = [];
	
	var end_time = (new Date).getTime() + max_time;
	
	var operators = standard_library.operators(stack);
	var built_ins = standard_library.built_ins(stack, calc, operators, end_time);
	
	var variables = {};
	for(let cou = 0; cou < ast.variables.length; cou++) {
		run_part.run_block(ast.variables[cou].data, stack, [variables], built_ins, operators, end_time);
		variables[ast.variables[cou].name] = stack.pop();
	}
	
	run_part.run_block(ast.data, stack, [variables], built_ins, operators, end_time);
	
	return stack;
}

module.exports = run;
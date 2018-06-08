"use strict";

try {
	var run_part = require("./run part");
	Object.assign(global, run_part);
	
	var standard_library = require("./standard library");
	Object.assign(global, standard_library);
} catch(err) {}

function run(ast, max_time = Infinity) {
	var stack = [];
	
	var end_time = (new Date).getTime() + max_time;
	
	var operators = operators_template(stack);
	var built_ins = built_ins_template(stack, operators, end_time);
	
	var variables = {};
	for(let cou = 0; cou < ast.variables.length; cou++) {
		run_block(ast.variables[cou].data, stack, [variables], built_ins, operators, end_time);
		variables[ast.variables[cou].name] = stack.pop();
	}
	
	run_block(ast.data, stack, [variables], built_ins, operators, end_time);
	
	return stack;
}

try {
	module.exports = run;
} catch(err) {}
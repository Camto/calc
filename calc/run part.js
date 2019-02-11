"use strict";

var types = require("./types");
var variable_manipulation = require("./variable manipulation");

function run_function(func, stack, built_ins, operators, end_time) {
	if(Date.now() > end_time) {
		throw "Error: code took too long to run, stopped.";
	}
	if(!func.is_ref || [types.func, types.op].includes(func.type)) {
		switch(func.type) {
			case types.func:
				var args = {};
				var variables = {};
				var scopes = func.scopes.concat(args, variables);
				
				for(let cou = 0; cou < func.args.length; cou++) {
					args[func.args[func.args.length - cou - 1]] = stack.pop();
				}
				
				for(let cou = 0; cou < func.variables.length; cou++) {
					run_block(func.variables[cou].data, stack, scopes, built_ins, operators, end_time);
					variables[func.variables[cou].name] = stack.pop();
				}
				
				run_block(func.data, stack, scopes, built_ins, operators, end_time);
				break;
			case types.sym:
				built_ins[func.data](scopes);
				break;
			case types.op:
				operators[func.data]();
				break;
		}
	} else {
		stack.push({data: JSON.parse(JSON.stringify(func.data)), type: func.type});
	}
}

function run_block(block, stack, scopes, built_ins, operators, end_time) {
	if(Date.now() > end_time) {
		throw "Error: code took too long to run, stopped.";
	}
	for(let instruccion_pointer = 0; instruccion_pointer < block.length; instruccion_pointer++) {
		if(Date.now() > end_time) {
			throw "Error: code took too long to run, stopped.";
		}
		
		switch(block[instruccion_pointer].type) {
			case types.sym:
				if(variable_manipulation.get_variable(block[instruccion_pointer].data, scopes)) {
					switch(variable_manipulation.get_variable(block[instruccion_pointer].data, scopes).type) {
						case types.func:
							run_function(variable_manipulation.get_variable(block[instruccion_pointer].data, scopes), stack, built_ins, operators, end_time);
							break;
						case types.sym:
							built_ins[variable_manipulation.get_variable(block[instruccion_pointer].data, scopes).data](scopes);
							break;
						case types.op:
							operators[variable_manipulation.get_variable(block[instruccion_pointer].data, scopes).data]();
							break;
						default:
							stack.push(JSON.parse(JSON.stringify(variable_manipulation.get_variable(block[instruccion_pointer].data, scopes))));
							break;
					}
				} else if(built_ins[block[instruccion_pointer].data]) {
					built_ins[block[instruccion_pointer].data](scopes);
				} else {
					throw `Symbol "${block[instruccion_pointer].data}" found in main expression without being a built-in function.`;
				}
				break;
			case types.num:
			case types.str:
				stack.push(block[instruccion_pointer]);
				break;
			case types.list:
				var list = [];
				for(let cou = 0; cou < block[instruccion_pointer].data; cou++) {
					list.push(stack.pop());
				}
				stack.push(types.new_list(list.reverse()));
				break;
			case types.func:
				var scoped_function = block[instruccion_pointer];
				scoped_function.scopes = scopes;
				stack.push(scoped_function);
				break;
			case types.op:
				if(block[instruccion_pointer].data != "$") {
					operators[block[instruccion_pointer].data]();
				} else {
					instruccion_pointer++;
					switch(block[instruccion_pointer].type) {
						case types.sym:
							if(variable_manipulation.get_variable(block[instruccion_pointer].data, scopes)) {
								var passed_function = variable_manipulation.get_variable(block[instruccion_pointer].data, scopes);
								passed_function.name = block[instruccion_pointer].data;
								passed_function.is_ref = true;
								stack.push(passed_function);
							} else {
								stack.push(block[instruccion_pointer]);
							}
							break;
						case types.op:
							stack.push(block[instruccion_pointer]);
							break;
						default:
							var reference = block[instruccion_pointer];
							reference.is_ref = true;
							stack.push(reference);
							break;
					}
				}
				break;
		}
	}
}

module.exports = {run_function, run_block};
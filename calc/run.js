"use strict";

try {
	var run_function = require("./run_function");
	
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
		for(let instruccion_pointer = 0; instruccion_pointer < ast.variables[cou].data.length; instruccion_pointer++) {
			if(Date.now() > end_time) {
				throw "Error: code took too long to run, stopped.";
			}
			
			switch(ast.variables[cou].data[instruccion_pointer].type) {
				case "symbol":
					if(variables[ast.variables[cou].data[instruccion_pointer].data]) {
						switch(variables[ast.variables[cou].data[instruccion_pointer].data].type) {
							case "function":
								run_function(variables[ast.variables[cou].data[instruccion_pointer].data], stack, built_ins, operators, end_time);
								break;
							case "symbol":
								built_ins[variables[ast.variables[cou].data[instruccion_pointer].data].data]();
								break;
							case "operator":
								operators[variables[ast.variables[cou].data[instruccion_pointer].data].data]();
								break;
							default:
								stack.push(variables[ast.variables[cou].data[instruccion_pointer].data]);
								break;
						}
					} else if(built_ins[ast.variables[cou].data[instruccion_pointer].data]) {
						built_ins[ast.variables[cou].data[instruccion_pointer].data]();
					} else {
						throw `Symbol \`${ast.variables[cou].data[instruccion_pointer].data}\` found in main expression without being a built-in function.`;
					}
					break;
				case "number":
				case "string":
					stack.push(ast.variables[cou].data[instruccion_pointer]);
					break;
				case "list":
					var list = [];
					for(let cou = 0; cou < ast.variables[cou].data[instruccion_pointer].data; cou++) {
						list.push(stack.pop());
					}
					stack.push({data: list.reverse(), type: "list"});
					break;
				case "function":
					var scoped_function = ast.variables[cou].data[instruccion_pointer];
					scoped_function.scopes = [variables];
					stack.push(scoped_function);
					break;
				case "operator":
					if(ast.variables[cou].data[instruccion_pointer].data != "$") {
						operators[ast.variables[cou].data[instruccion_pointer].data]();
					} else {
						instruccion_pointer++;
						switch(ast.variables[cou].data[instruccion_pointer].type) {
							case "symbol":
								if(variables[ast.variables[cou].data[instruccion_pointer].data]) {
									var reference = variables[ast.variables[cou].data[instruccion_pointer].data];
									reference.name = ast.variables[cou].data[instruccion_pointer].data;
									reference.scopes = [variables];
									reference.is_ref = true;
									stack.push(reference);
								} else {
									stack.push(ast.variables[cou].data[instruccion_pointer]);
								}
								break;
							case "operator":
								stack.push(ast.variables[cou].data[instruccion_pointer]);
								break;
							default:
								var reference = ast.variables[cou].data[instruccion_pointer];
								reference.is_ref = true;
								stack.push(reference);
								break;
						}
					}
					break;
			}
		}
		variables[ast.variables[cou].name] = stack.pop();
	}
	
	for(let instruccion_pointer = 0; instruccion_pointer < ast.data.length; instruccion_pointer++) {
			if(Date.now() > end_time) {
				throw "Error: code took too long to run, stopped.";
			}
			
			switch(ast.data[instruccion_pointer].type) {
				case "symbol":
					if(variables[ast.data[instruccion_pointer].data]) {
						switch(variables[ast.data[instruccion_pointer].data].type) {
							case "function":
								run_function(variables[ast.data[instruccion_pointer].data], stack, built_ins, operators, end_time);
								break;
							case "symbol":
								built_ins[variables[ast.data[instruccion_pointer].data].data]();
								break;
							case "operator":
								operators[variables[ast.data[instruccion_pointer].data].data]();
								break;
							default:
								stack.push(variables[ast.data[instruccion_pointer].data]);
								break;
						}
					} else if(built_ins[ast.data[instruccion_pointer].data]) {
						built_ins[ast.data[instruccion_pointer].data]();
					} else {
						throw `Symbol \`${ast.data[instruccion_pointer].data}\` found in main expression without being a built-in function.`;
					}
					break;
				case "number":
				case "string":
					stack.push(ast.data[instruccion_pointer]);
					break;
				case "list":
					var list = [];
					for(let cou = 0; cou < ast.data[instruccion_pointer].data; cou++) {
						list.push(stack.pop());
					}
					stack.push({data: list.reverse(), type: "list"});
					break;
				case "function":
					var scoped_function = ast.data[instruccion_pointer];
					scoped_function.scopes = [variables];
					stack.push(scoped_function);
					break;
				case "operator":
					if(ast.data[instruccion_pointer].data != "$") {
						operators[ast.data[instruccion_pointer].data]();
					} else {
						instruccion_pointer++;
						switch(ast.data[instruccion_pointer].type) {
							case "symbol":
								if(variables[ast.data[instruccion_pointer].data]) {
									var passed_function = variables[ast.data[instruccion_pointer].data];
									passed_function.name = ast.data[instruccion_pointer].data;
									passed_function.scopes = [variables];
									passed_function.is_ref = true;
									stack.push(passed_function);
								} else {
									stack.push(ast.data[instruccion_pointer]);
								}
								break;
							case "operator":
								stack.push(ast.data[instruccion_pointer]);
								break;
							default:
								var reference = ast.data[instruccion_pointer];
								reference.scopes = [variables];
								reference.is_ref = true;
								stack.push(reference);
								break;
						}
					}
					break;
			}
		}
	
	return stack;
}

try {
	module.exports = run;
} catch(err) {}
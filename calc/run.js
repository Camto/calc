"use strict";

try {
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

function run_function(func, stack, built_ins, operators, end_time) {
	if(!func.is_ref || /function|operator/.test(func.type)) {
		switch(func.type) {
			case "function":
				var args = {};
				var variables = {};
				var scopes = func.scopes.concat(args, variables);
				
				for(let cou = 0; cou < func.args.length; cou++) {
					args[func.args[func.args.length - cou - 1]] = stack.pop();
				}
				
				for(let cou = 0; cou < func.variables.length; cou++) {
					for(let instruccion_pointer = 0; instruccion_pointer < func.variables[cou].data.length; instruccion_pointer++) {
						if(Date.now() > end_time) {
							throw "Error: code took too long to run, stopped.";
						}
						
						switch(func.variables[cou].data[instruccion_pointer].type) {
							case "symbol":
								if(get_variable(func.variables[cou].data[instruccion_pointer].data, scopes)) {
									switch(get_variable(func.variables[cou].data[instruccion_pointer].data).type) {
										case "function":
											run_function(get_variable(func.variables[cou].data[instruccion_pointer].data, scopes), stack, built_ins, operators, end_time);
											break;
										case "symbol":
											built_ins[get_variable(func.variables[cou].data[instruccion_pointer].data, scopes).data]();
											break;
										case "operator":
											operators[get_variable(func.variables[cou].data[instruccion_pointer].data, scopes).data]();
											break;
										default:
											stack.push(get_variable(func.variables[cou].data[instruccion_pointer].data, scopes));
											break;
									}
								} else if(built_ins[func.variables[cou].data[instruccion_pointer].data]) {
									built_ins[func.variables[cou].data[instruccion_pointer].data]();
								} else {
									throw `Symbol \`${func.variables[cou].data[instruccion_pointer].data}\` found in main expression without being a built-in function.`;
								}
								break;
							case "number":
							case "string":
								stack.push(func.variables[cou].data[instruccion_pointer]);
								break;
							case "list":
								var list = [];
								for(let cou = 0; cou < func.variables[cou].data[instruccion_pointer].data; cou++) {
									list.push(stack.pop());
								}
								stack.push({data: list.reverse(), type: "list"});
								break;
							case "function":
								var scoped_function = func.variables[cou].data[instruccion_pointer];
								scoped_function.scopes = func.scopes.concat(args, variables);
								stack.push(scoped_function);
								break;
							case "operator":
								if(func.variables[cou].data[instruccion_pointer].data != "$") {
									operators[func.variables[cou].data[instruccion_pointer].data]();
								} else {
									instruccion_pointer++;
									switch(func.variables[cou].data[instruccion_pointer].type) {
										case "symbol":
											if(variables[func.variables[cou].data[instruccion_pointer].data]) {
												var reference = variables[func.variables[cou].data[instruccion_pointer].data];
												reference.name = func.variables[cou].data[instruccion_pointer].data;
												reference.scopes = func.scopes.concat(args, variables);
												reference.is_ref = true;
												stack.push(reference);
											} else {
												stack.push(func.variables[cou].data[instruccion_pointer]);
											}
											break;
										case "operator":
											stack.push(func.variables[cou].data[instruccion_pointer]);
											break;
										default:
											var reference = func.variables[cou].data[instruccion_pointer];
											reference.is_ref = true;
											stack.push(reference);
											break;
									}
								}
								break;
						}
					}
					variables[func.variables[cou].name] = stack.pop();
				}
				
				var code = func.data;
				for(let code_pointer = 0; code_pointer < code.length; code_pointer++) {
					if(Date.now() > end_time) {
						throw "Error: code took too long to run, stopped.";
					}
					
					switch(code[code_pointer].type) {
						case "symbol":
							if(!built_ins[code[code_pointer].data]) {
								if(get_variable(code[code_pointer].data, scopes)) {
									switch(get_variable(code[code_pointer].data, scopes).type) {
										case "function":
											run_function(get_variable(code[code_pointer].data, scopes), stack, built_ins, operators, end_time);
											break;
										case "symbol":
											built_ins[get_variable(code[code_pointer].data, scopes).data]();
											break;
										case "operator":
											operators[get_variable(code[code_pointer].data, scopes).data]();
											break;
										default:
											stack.push(get_variable(code[code_pointer].data, scopes));
											break;
									}
								} else {
									throw `Symbol \`${code[code_pointer].data}\` found in function without being a built-in function or a function parameter.`;
								}
							} else {
								built_ins[code[code_pointer].data]();
							}
							break;
						case "number":
						case "string":
							stack.push(code[code_pointer]);
							break;
						case "function":
							var scoped_function = code[code_pointer];
							scoped_function.scopes = func.scopes.concat(args, variables);
							stack.push(scoped_function);
							break;
						case "list":
							var list = [];
							for(let cou = 0; cou < code[code_pointer].data; cou++) {
								list.push(stack.pop());
							}
							stack.push({data: list.reverse(), type: "list"});
							break;
						case "operator":
							if(code[code_pointer].data != "$") {
								operators[code[code_pointer].data]();
							} else {
								code_pointer++;
								if(!args[code[code_pointer].data]) {
									stack.push(code[code_pointer]);
								} else {
									stack.push(args[code[code_pointer].data]);
								}
							}
							break;
					}
				}
				break;
			case "symbol":
				built_ins[func.data]();
				break;
			case "operator":
				operators[func.data]();
				break;
		}
	} else {
		stack.push({data: JSON.parse(JSON.stringify(func.data)), type: func.type});
	}
}

function get_variable(name, scopes) {
	for(let cou = scopes.length - 1; cou >= 0; cou--) {
		if(scopes[cou][name]) {
			return scopes[cou][name];
		}
	}
	return undefined;
}

// Taken from https://stackoverflow.com/questions/14743536/multiple-key-names-same-pair-value .
function expand(obj) {
	var keys = Object.keys(obj);
	for(let cou = 0; cou < keys.length; cou++) {
		var key = keys[cou];
		var subkeys = key.split(/,\s?/);
		var target = obj[key];
		delete obj[key];
		subkeys.forEach(key => {
			obj[key] = target;
			obj[key.replace("_", "")] = target;
			obj[key.replace(/(_\w)/g, m => m[1].toUpperCase())] = target;
		});
	}
	return obj;
}

// Taken from https://gist.github.com/nicbell/6081098 .
Object.compare = function(obj1, obj2) {
	for(var p in obj1) {
		if(obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
			return false;
		}
		switch(typeof (obj1[p])) {
			case "object":
				if(!Object.compare(obj1[p], obj2[p])) {
					return false;
				}
				break;
			case "function":
				if(typeof (obj2[p]) == "undefined" || (p != "compare" && obj1[p].toString() != obj2[p].toString())) {
					return false;
				}
				break;
			default:
				if(obj1[p] != obj2[p]) {
					return false;
				}
				break;
		}
	}
	for(var p in obj2) {
		if(typeof (obj1[p]) == "undefined") {
			return false;
		}
	}
	return true;
};

try {
	module.exports = run;
} catch(err) {}
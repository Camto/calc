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

function run_block(block, scope) {
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
}

try {
	module.exports = {run_function};
} catch(err) {}
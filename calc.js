"use strict";

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

function lex(code) {
	var pointer = 0;
	var tokens = [];
	
	var expect = {
		
		symbol() {
			var end = pointer + 1;
			while(/[A-Za-z_0-9]/.test(code[end]) && end < code.length) {
				end++;
			}
			var symbol = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: symbol, type: "symbol"};
		},
		
		number() {
			var end = pointer + 1;
			while(/[0-9]/.test(code[end]) && end < code.length) {
				end++;
			}
			if(code[end] == "." && code[end + 1] != ".") {
				end++;
				while(/[0-9]/.test(code[end]) && end < code.length) {
					end++;
				}
			}
			var number = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: parseFloat(number), type: "number"};
		},
		
		string() {
			pointer++;
			
			var string = "";
			var escaped = false;
			while(code[pointer] != '"' || escaped) {
				if(!escaped) {
					if(code[pointer] != "\\") {
						string += code[pointer];
					} else {
						escaped = true;
					}
				} else {
					escaped = false;
					switch(code[pointer]) {
						case "n":
							string += "\n";
							break;
						case "t":
							string += "\t";
						default:
							string += code[pointer];
					}
				}
				pointer++;
			}
			
			pointer++;
			return {data: string, type: "string"};
		},
		
		operator() {
			var end = pointer;
			switch(code[end]) {
				case "-":
					if(code[end + 1] == ">") {end++;}
					break;
				case ".":
					if(code[end + 1] == ".") {end++;}
					break;
				case "<":
				case ">":
				case "!":
					if(code[end + 1] == "=") {end++;}
					break;
			}
			end++;
			var operator = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: operator, type: "operator"};
		}
		
	};
	
	while(pointer < code.length) {
		if(/[A-Za-z_]/.test(code[pointer])) {
			tokens.push(expect.symbol());
		} else if(/\d/.test(code[pointer])) {
			tokens.push(expect.number());
		} else if(code[pointer] == "-") {
			if(/\d/.test(code[pointer + 1])) {
				tokens.push(expect.number());
			} else {
				tokens.push(expect.operator());
			}
		} else if(code[pointer] == '"') {
			tokens.push(expect.string());
		} else if(/\[|,|\]|{|}|\$|;|\+|\*|\/|\^|\.|=|<|>|&|\||!/.test(code[pointer])) {
			tokens.push(expect.operator());
		} else {
			pointer++;
		}
	}
	
	return tokens;
}

function parse(tokens) {
	var token_pointer = 0;
	
	function parse_function() {
		token_pointer++;
		var args = [];
		
		var has_arrow = false;
		var end = token_pointer;
		var function_depth = 0;
		while(tokens[end].data != "}" && end < tokens.length) {
			if(tokens[end].type == "operator") {
				if(tokens[end].data == "->" && !function_depth) {
					has_arrow = true;
				} else if(tokens[end].data == "{") {
					function_depth++;
				} else if(tokens[end].data == "}") {
					function_depth--;
				}
			}
			end++;
		}
		
		if(has_arrow) {
			while(!(tokens[token_pointer].data == "->" && tokens[token_pointer].type == "operator") && token_pointer < tokens.length) {
				if(tokens[token_pointer].type == "symbol") {
					args.push(tokens[token_pointer].data);
				} else {
					throw `Parameter name \`${tokens[token_pointer].data}\` is of type \`${tokens[token_pointer].type}\` when it should be of type \`symbol\`.`;
				}
				token_pointer++;
			}
			token_pointer++;
		}
		
		var raw_variables = [];
		var variable = [];
		while(tokens[token_pointer].data != "}" && token_pointer < tokens.length) {
			if(/symbol|number|string/.test(tokens[token_pointer].type)) {
				variable.push(tokens[token_pointer]);
				token_pointer++;
			} else if(tokens[token_pointer].data != "{" && tokens[token_pointer].data != "[") {
				if(tokens[token_pointer].data == ";") {
					raw_variables.push(variable);
					variable = [];
				} else {
					variable.push(tokens[token_pointer]);
				}
				token_pointer++;
			} else {
				if(tokens[token_pointer].data == "{") {
					variable.push(parse_function());
				} else {
					variable.push(...parse_list());
				}
			}
		}
		var code = variable;
		var variables = raw_variables.map(raw_variable => {
			if(raw_variable.length < 2) {
				throw "Error: variable definition too short.";
			}
			if(raw_variable[1].data != "=" || raw_variable[1].type != "operator") {
				throw "Error: variable definition has no `=`.";
			}
			if(raw_variable[0].type != "symbol") {
				throw `Error: variable name is a \`${raw_variable[0].type}\` when it should be a \`symbol\`.`;
			}
			return {name: raw_variable[0].data, data: raw_variable.slice(2)};
		});
		token_pointer++;
		
		return {args, variables, data: code, type: "function"};
	}

	function parse_list() {
		token_pointer++;
		
		var code = [];
		var length = 0;
		while(tokens[token_pointer].data != "]" && token_pointer < tokens.length) {
			if(tokens[token_pointer].data == ",") {
				length++;
				token_pointer++;
			} else if(/symbol|number|string/.test(tokens[token_pointer].type)) {
				code.push(tokens[token_pointer]);
				token_pointer++;
			} else if(tokens[token_pointer].data != "{" && tokens[token_pointer].data != "[") {
				if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
					variable.push(tokens[token_pointer]);
				} else {
					throw `Unexpected context operator \`${tokens[token_pointer].data}\`.`;
				}
				token_pointer++;
			} else {
				if(tokens[token_pointer].data == "{") {
					code.push(parse_function());
				} else {
					code.push(...parse_list());
				}
			}
		}
		if(code.length || length > 0) {
			length++;
		}
		token_pointer++;
		
		return [...code, {data: length, type: "list"}];
	}
	
	var raw_variables = [];
	var variable = [];
	while(token_pointer < tokens.length) {
		if(/symbol|number|string/.test(tokens[token_pointer].type)) {
			variable.push(tokens[token_pointer]);
			token_pointer++;
		} else if(tokens[token_pointer].data != "{" && tokens[token_pointer].data != "[") {
			if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
				if(tokens[token_pointer].data == ";") {
					raw_variables.push(variable);
					variable = [];
				} else {
					variable.push(tokens[token_pointer]);
				}
			} else {
				throw `Unexpected context operator \`${tokens[token_pointer].data}\`.`;
			}
			token_pointer++;
		} else {
			if(tokens[token_pointer].data == "{") {
				variable.push(parse_function());
			} else {
				variable.push(...parse_list());
			}
		}
	}
	var ast = variable;
	var variables = raw_variables.map(raw_variable => {
		if(raw_variable.length < 2) {
			throw "Error: variable definition too short.";
		}
		if(raw_variable[1].data != "=" || raw_variable[1].type != "operator") {
			throw "Error: variable definition has no `=`.";
		}
		if(raw_variable[0].type != "symbol") {
			throw `Error: variable name is a \`${raw_variable[0].type}\` when it should be a \`symbol\`.`;
		}
		return {name: raw_variable[0].data, data: raw_variable.slice(2)};
	});
	
	return {variables, data: ast};
}

function run(ast, max_time = Infinity) {
	var stack = [];
	
	function run_function(func) {
		if(!func.is_ref || /function|operator/.test(func.type)) {
			switch(func.type) {
				case "function":
					var args = {};
					
					for(let cou = 0; cou < func.args.length; cou++) {
						args[func.args[func.args.length - cou - 1]] = stack.pop();
					}
					
					var code = func.data;
					for(let code_pointer = 0; code_pointer < code.length; code_pointer++) {
						if((new Date).getTime() - start_time > max_time) {
							throw "Error: code took too long to run, stopped.";
						}
						
						switch(code[code_pointer].type) {
							case "symbol":
								if(!built_ins[code[code_pointer].data]) {
									if(args[code[code_pointer].data]) {
										switch(args[code[code_pointer].data].type) {
											case "function":
												run_function(args[code[code_pointer].data]);
												break;
											case "symbol":
												built_ins[args[code[code_pointer].data].data]();
												break;
											case "operator":
												operators[args[code[code_pointer].data].data]();
												break;
											default:
												stack.push(args[code[code_pointer].data]);
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
							case "function":
								stack.push(code[code_pointer]);
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

	var built_ins = expand({
		
		// Help functions.
		
		"help, h"() {
			stack.push({data: `
Demos!
    • Fibonacci: \`calc= [1, 1] {i -> i (i last (i 1 backn) +) +} 7 iter last\`
    • Factorial: \`calc= 1 5 .. $* 1 fold\``, type: "string"});
		},
		"page, p, help_page, hp, h_page, help_p"() {
			
		},
		"tut, tutorial"() {
			
		},
		"adv_tut, adv_tutorial, advanced_tutorial, advanced_tut"() {
			
		},
		
		// Basic functions.
		
		"type, typeof, instance, instanceof"() {
			stack.push({data: stack.pop().type, type: "string"});
		},
		"true, t, yes, on"() {
			stack.push({data: 1, type: "number"});
		},
		"false, f, no, off"() {
			stack.push({data: 0, type: "number"});
		},
		
		// Stack functions.
		
		"dup, duplicate"() {
			stack.push(stack[stack.length - 1]);
		},
		swap() {
			var first = stack.pop();
			var second = stack.pop();
			stack.push(first);
			stack.push(second);
		},
		"swapn, stack_reversen, stack_invertn"() {
			var n = stack.pop().data;
			stack = stack.concat(stack.splice(stack.length - n, n).reverse());
		},
		"stack_pop, drop"() {
			stack.pop();
		},
		"stack_popn, dropn"() {
			var n = stack.pop().data;
			for(let cou = 0; cou < n; cou++) {
				stack.pop();
			}
		},
		"rot, rotate"() {
			var first = stack.pop();
			var second = stack.pop();
			var third = stack.pop();
			stack.push(first);
			stack.push(third);
			stack.push(second);
		},
		"anti_rot, anti_rotate, reverse_rot, reverse_rotate, counter_rot, counter_rotate"() {
			var first = stack.pop();
			var second = stack.pop();
			var third = stack.pop();
			stack.push(second);
			stack.push(first);
			stack.push(third);
		},
		"roll, rotn, rotaten"() {
			var n = stack.pop().data;
			
			if(n > 0) {
				var rolled = stack.pop();
				stack.splice(stack.length - n + 1, 0, rolled);
			} else {
				var rolled = stack[stack.length + n];
				stack.splice(stack.length + n, 1);
				stack.push(rolled);
			}
		},
		"anti_roll, reverse_roll, counter_roll, anti_rotn, anti_rotaten, reverse_rotn, reverse_rotaten, counter_rotn, counter_rotaten"() {
			var n = stack.pop().data;
			
			if(n > 0) {
				var rolled = stack[stack.length - n];
				stack.splice(stack.length - n, 1);
				stack.push(rolled);
			} else {
				var rolled = stack.pop();
				stack.splice(stack.length + n + 1, 0, rolled);
			}
		},
		nip() {
			var first = stack.pop();
			var second = stack.pop();
			stack.push(first);
		},
		tuck() {
			var first = stack.pop();
			var second = stack.pop();
			stack.push(first);
			stack.push(second);
			stack.push(first);
		},
		over() {
			var first = stack.pop();
			var second = stack.pop();
			stack.push(second);
			stack.push(first);
			stack.push(second);
		},
		"stack_first, stack_cat, stack_top, stack_head"() {
			stack = stack[0];
		},
		"stack_last, stack_bottom, stack_butt"() {
			stack = stack[stack.length - 1];
		},
		"stack_frontn, stack_index, stack_front_index, stack_middlen, stack_middle_index"() {
			var index = stack.pop().data;
			stack = stack[index];
		},
		"stack_lastn, stack_backn, stack_anti_index, stack_reverse_index, stack_back_index"() {
			var index = stack.pop().data;
			stack = stack[stack.length - index - 1];
		},
		"stack_front, stack_init"() {
			stack = stack.slice(0, -1);
		},
		"stack_back, stack_cdr, stack_tail, stack_rest"() {
			stack = stack.slice(1);
		},
		"stack_body, stack_middle"() {
			stack = stack.slice(1, -1);
		},
		"stack_reverse, stack_invert"() {
			stack.reverse();
		},
		
		// List functions.
		
		"map, apply, apply_to"() {
			var mapper = stack.pop();
			var list = stack.pop().data;
			
			var mapped = list.map(item => {
				stack.push(item);
				run_function(mapper);
				return stack.pop();
			});
			
			stack.push({data: mapped, type: "list"});
		},
		"reduce, fold, foldl, fold_left"() {
			var accumulator = stack.pop();
			var reducer = stack.pop();
			var list = stack.pop().data;
			stack.push(accumulator);
			
			for(let cou = 0; cou < list.length; cou++) {
				stack.push(list[cou]);
				run_function(reducer);
			}
		},
		"anti_reduce, anti_fold, foldr, fold_right"() {
			var accumulator = stack.pop();
			var reducer = stack.pop();
			var list = stack.pop().data;
			stack.push(accumulator);
			
			for(let cou = list.length - 1; cou > -1; cou--) {
				stack.push(list[cou]);
				run_function(reducer);
			}
		},
		filter() {
			var filter = stack.pop();
			var list = stack.pop().data;
			
			var filtered = list.filter(item => {
				stack.push(item);
				run_function(filter);
				return stack.pop().data;
			});
			
			stack.push({data: filtered, type: "list"});
		},
		"size, length"() {
			stack.push({data: stack.pop().data.length, type: "number"});
		},
		"first, cat, top, head, pop"() {
			var list = stack.pop().data;
			stack.push(list[0]);
		},
		"last, bottom, butt"() {
			var list = stack.pop().data;
			stack.push(list[list.length - 1]);
		},
		"frontn, index, front_index, middlen, middle_index"() {
			var index = stack.pop().data;
			var list = stack.pop().data;
			stack.push(list[index]);
		},
		"lastn, backn, anti_index, reverse_index, back_index"() {
			var index = stack.pop().data;
			var list = stack.pop().data;
			stack.push(list[list.length - index - 1]);
		},
		"front, init, list_drop"() {
			stack.push({
				data: stack.pop().data.slice(0, -1),
				type: "list"
			});
		},
		"back, cdr, tail, rest"() {
			stack.push({
				data: stack.pop().data.slice(1),
				type: "list"
			});
		},
		"body, middle"() {
			stack.push({
				data: stack.pop().data.slice(1, -1),
				type: "list"
			});
		},
		"reverse, invert"() {
			var list = stack.pop().data;
			stack.push({data: list.reverse(), type: "list"});
		},
		"reversen, invertn, list_swapn"() {
			var list = stack.pop().data;
			var n = list.pop().data;
			list = list.concat(list.splice(list.length - n, n).reverse());
			stack.push({data: list, type: "list"});
		},
		"popn, list_dropn"() {
			var n = stack.pop().data;
			var list = stack.pop().data;
			for(let cou = 0; cou < n; cou++) {
				list.pop();
			}
			stack.push({data: list, type: "list"});
		},
		"extr, extract, expl, explode, spr, spread"() {
			var list = stack.pop().data;
			for(let cou = 0; cou < list.length; cou++) {
				stack.push(list[cou]);
			}
		},
		"group, as_list"() {
			var n = stack.pop().data;
			
			var list = [];
			for(let cou = 0; cou < n; cou++) {
				list.unshift(stack.pop());
			}
			stack.push({data: list, type: "list"});
		},
		"copy_group, copy_as_list"() {
			var n = stack.pop().data;
			
			var list = [];
			for(let cou = 0; cou < n; cou++) {
				list.unshift(stack[stack.length - 1 - cou]);
			}
			stack.push({data: list, type: "list"});
		},
		group_all() {
			var list = stack.slice();
			stack = [];
			stack.push({data: list, type: "list"});
		},
		copy_group_all() {
			var list = stack.slice();
			stack.push({data: list, type: "list"});
		},
		"list_dup, list_duplicate"() {
			var list = stack.pop().data;
			list.push(list[list.length - 1]);
			stack.push({data: list, type: "list"});
		},
		list_swap() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			list.push(second);
			stack.push({data: list, type: "list"});
		},
		"list_rot, list_rotate"() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			var third = list.pop();
			list.push(first);
			list.push(third);
			list.push(second);
			stack.push({data: list, type: "list"});
		},
		"list_anti_rot, list_anti_rotate, list_reverse_rot, list_reverse_rotate, list_counter_rot, list_counter_rotate"() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			var third = list.pop();
			list.push(second);
			list.push(first);
			list.push(third);
			stack.push({data: list, type: "list"});
		},
		"list_roll, list_rotn, list_rotaten"() {
			var n = stack.pop().data;
			var list = stack.pop().data;
			
			if(n > 0) {
				var rolled = list.pop();
				list.splice(list.length - n + 1, 0, rolled);
			} else {
				var rolled = list[list.length + n];
				list.splice(list.length + n, 1);
				list.push(rolled);
			}
			
			stack.push({data: list, type: "list"});
		},
		"list_anti_roll, list_reverse_roll, list_counter_roll, list_anti_rotn, list_anti_rotaten, list_reverse_rotn, list_reverse_rotaten, list_counter_rotn, list_counter_rotaten"() {
			var n = stack.pop().data;
			var list = stack.pop().data;
			
			if(n > 0) {
				var rolled = list[list.length - n];
				list.splice(list.length - n, 1);
				list.push(rolled);
			} else {
				var rolled = list.pop();
				list.splice(list.length + n + 1, 0, rolled);
			}
			
			stack.push({data: list, type: "list"});
		},
		list_nip() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			stack.push({data: list, type: "list"});
		},
		list_tuck() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			list.push(second);
			list.push(first);
			stack.push({data: list, type: "list"});
		},
		list_over() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(second);
			list.push(first);
			list.push(second);
			stack.push({data: list, type: "list"});
		},
		
		// Math functions.
		
		pi() {
			stack.push({data: Math.PI, type: "number"});
		},
		e() {
			stack.push({data: Math.E, type: "number"});
		},
		"abs, absolute, positive"() {
			stack.push({data: Math.abs(stack.pop().data), type: "number"});
		},
		"round, trunc, truncate"() {
			stack.push({data: Math.round(stack.pop().data), type: "number"});
		},
		"ceil, ceiling, roof"() {
			stack.push({data: Math.ceil(stack.pop().data), type: "number"});
		},
		floor() {
			stack.push({data: Math.floor(stack.pop().data), type: "number"});
		},
		"max, maximum, biggest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push({data: Math.max(left, right), type: "number"});
		},
		"main, minimum, smallest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push({data: Math.min(left, right), type: "number"});
		},
		"rand, random"() {
			var min = stack.pop().data;
			var max = stack.pop().data;
			stack.push({data: (Math.random() * (max - min)) + min, type: "number"});
		},
		"cos, cosine"() {
			stack.push({data: Math.cos(stack.pop().data), type: "number"});
		},
		"sin, sine"() {
			stack.push({data: Math.sin(stack.pop().data), type: "number"});
		},
		"tan, tangent"() {
			stack.push({data: Math.tan(stack.pop().data), type: "number"});
		},
		"sqrt, square_root"() {
			stack.push({data: Math.sqrt(stack.pop().data), type: "number"});
		},
		"cbrt, cube_root"() {
			stack.push({data: Math.cbrt(stack.pop().data), type: "number"});
		},
		root() {
			var num = stack.pop().data;
			var exp = stack.pop().data;
			stack.push({data: num ** (1 / exp), type: "number"});
		},
		"log, logarithm"() {
			var num = stack.pop().data;
			var base = stack.pop().data;
			stack.push({data: Math.log(num) / Math.log(base), type: "number"});
		},
		
		// Function functions.
		
		"call, run, do, apply, get"() {
			run_function(stack.pop());
		},
		"iter, iterate, iterative, loop, loopn"() {
			var iter_cou = stack.pop().data;
			var iterator = stack.pop();
			
			for(let cou = 0; cou < iter_cou; cou++) {
				run_function(iterator);
			}
		},
		"id, identity, nop, noop"() {}
		
	});

	var operators = {
		
		"+"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data + right.data,
						type: "number"
					});
					break;
				case "stringstring":
					stack.push({
						data: left.data + right.data,
						type: "string"
					});
					break;
				case "listnumber":
				case "liststring":
					stack.push({
						data: [...left.data, right],
						type: "list"
					});
					break;
				case "numberlist":
				case "stringlist":
					stack.push({
						data: [left, ...right.data],
						type: "list"
					});
					break;
				case "listlist":
					stack.push({
						data: [...left.data, ...right.data],
						type: "list"
					});
					break;
			}
		},
		"-"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data - right.data,
						type: "number"
					});
					break;
			}
		},
		"*"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data * right.data,
						type: "number"
					});
					break;
			}
		},
		"/"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data / right.data,
						type: "number"
					});
					break;
			}
		},
		"^"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data ** right.data,
						type: "number"
					});
					break;
			}
		},
		".."() {
			var end = Math.floor(stack.pop().data);
			var beginning = Math.floor(stack.pop().data);
			
			var gets_bigger;
			if(beginning < end) {
				gets_bigger = true;
			} else {
				gets_bigger = false;
			}
			
			var list = [];
			for(let cou = (gets_bigger ? beginning : end); cou < (gets_bigger ? end + 1 : beginning + 1); cou++) {
				list.push({data: cou, type: "number"});
			}
			stack.push({
				data: (gets_bigger ? list : list.reverse()),
				type: "list"
			});
		},
		"&"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data && right.data,
						type: "number"
					});
					break;
			}
		},
		"|"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "number":
					stack.push({
						data: left.data || right.data,
						type: "number"
					});
					break;
			}
		},
		"!"() {
			var bool = stack.pop();
			switch(bool.type) {
				case "number":
					stack.push({
						data: !bool.data | 0,
						type: "number"
					});
					break;
			}
		},
		"="() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
				case "stringstring":
					stack.push({
						data: left.data == right.data | 0,
						type: "number"
					});
					break;
				case "listlist":
					stack.push({
						data: Object.compare(left.data, right.data) | 0,
						type: "number"
					});
					break;
			}
		},
		"<"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data < right.data | 0,
						type: "number"
					});
					break;
				case "stringstring":
				case "listlist":
					stack.push({
						data: left.data.length < right.data.length | 0,
						type: "number"
					});
					break;
			}
		},
		">"() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data > right.data | 0,
						type: "number"
					});
					break;
				case "stringstring":
				case "listlist":
					stack.push({
						data: left.data.length > right.data.length | 0,
						type: "number"
					});
					break;
			}
		},
		"<="() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data <= right.data | 0,
						type: "number"
					});
					break;
				case "stringstring":
				case "listlist":
					stack.push({
						data: left.data.length <= right.data.length | 0,
						type: "number"
					});
					break;
			}
		},
		">="() {
			var right = stack.pop();
			var left = stack.pop();
			switch(left.type + right.type) {
				case "numbernumber":
					stack.push({
						data: left.data >= right.data | 0,
						type: "number"
					});
					break;
				case "stringstring":
				case "listlist":
					stack.push({
						data: left.data.length >= right.data.length | 0,
						type: "number"
					});
					break;
			}
		}
		
	};
	
	var start_time = (new Date).getTime();
	
	var variables = {};
	for(let cou = 0; cou < ast.variables.length; cou++) {
		for(let instruccion_pointer = 0; instruccion_pointer < ast.variables[cou].data.length; instruccion_pointer++) {
			if((new Date).getTime() - start_time > max_time) {
				throw "Error: code took too long to run, stopped.";
			}
			
			switch(ast.variables[cou].data[instruccion_pointer].type) {
				case "symbol":
					if(variables[ast.variables[cou].data[instruccion_pointer].data]) {
						switch(variables[ast.variables[cou].data[instruccion_pointer].data].type) {
							case "function":
								run_function(variables[ast.variables[cou].data[instruccion_pointer].data]);
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
					scoped_function.scopes = variables;
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
									reference.scopes = variables;
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
			if((new Date).getTime() - start_time > max_time) {
				throw "Error: code took too long to run, stopped.";
			}
			
			switch(ast.data[instruccion_pointer].type) {
				case "symbol":
					if(variables[ast.data[instruccion_pointer].data]) {
						switch(variables[ast.data[instruccion_pointer].data].type) {
							case "function":
								run_function(variables[ast.data[instruccion_pointer].data]);
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
					scoped_function.scopes = variables;
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
									passed_function.scopes = variables;
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
								reference.scopes = variables;
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
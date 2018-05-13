function calc(code_) {
	if(code_.substr(0, 5) != "calc=") {
		throw "There is no `calc=`.";
	}
	var code = code_.substr(5, code_.length);
	var tokens = lex(code);
	var ast = parse(tokens);
	return run(ast);
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
			var number = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: parseFloat(number), type: "number"};
		},
		
		string() {
			pointer++;
			
			string = "";
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
		} else if(/\[|,|\]|{|}|\$|\+|\*|\/|\^|\.|=|<|>|&|\||!/.test(code[pointer])) {
			tokens.push(expect.operator());
		} else {
			pointer++;
		}
	}
	
	return tokens;
}

function parse(tokens) {
	var token_pointer = 0;
	var ast = [];
	
	function parse_function() {
		token_pointer++;
		var args = [];
		while(tokens[token_pointer].data != "->" && token_pointer < tokens.length) {
			if(tokens[token_pointer].type == "symbol") {
				args.push(tokens[token_pointer].data);
			} else {
				throw `Parameter name \`${tokens[token_pointer].data}\` is of type \`${tokens[token_pointer].type}\` when it should be of type \`symbol\`.`;
			}
			token_pointer++;
		}
		token_pointer++;
		
		var code = [];
		while(tokens[token_pointer].data != "}" && token_pointer < tokens.length) {
			if(/symbol|number|string/.test(tokens[token_pointer].type)) {
				code.push(tokens[token_pointer]);
				token_pointer++;
			} else if(tokens[token_pointer].data != "{" && tokens[token_pointer].data != "[") {
				if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
					code.push(tokens[token_pointer]);
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
		token_pointer++;
		
		return {args, data: code, type: "function"};
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
					ast.push(tokens[token_pointer]);
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
	
	while(token_pointer < tokens.length) {
		if(/symbol|number|string/.test(tokens[token_pointer].type)) {
			ast.push(tokens[token_pointer]);
			token_pointer++;
		} else if(tokens[token_pointer].data != "{" && tokens[token_pointer].data != "[") {
			if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
				ast.push(tokens[token_pointer]);
			} else {
				throw `Unexpected context operator \`${tokens[token_pointer].data}\`.`;
			}
			token_pointer++;
		} else {
			if(tokens[token_pointer].data == "{") {
				ast.push(parse_function());
			} else {
				ast.push(...parse_list());
			}
		}
	}
	
	return ast;
}

function run(ast) {
	var instruccion_pointer;
	var stack = [];
	/*stack.push = function(i) {
		console.log(i)
		return Array.prototype.push.apply(this,arguments);
	};*/
	
	function run_function(func) {
		switch(func.type) {
			case "function":
				var args = {};
				for(let cou = 0; cou < func.args.length; cou++) {
					args[func.args[func.args.length - cou - 1]] = stack.pop();
				}
				var code = func.data;
				for(let code_pointer = 0; code_pointer < code.length; code_pointer++) {
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
	}

	var built_ins = expand({
		
		"help, h"() {
			stack.push({data: `
Demos!
    • Fibonacci: \`calc= [1, 1] {i -> i (i last (i 1 backn) +) +} 7 iter last\`
    • Factorial: \`calc= 1 5 .. $* 1 fold\`
`, type: "string"});
		},
		"page, p, help_page, hp"() {
			
		},
		"type, typeof, instance, instanceof"() {
			stack.push({data: stack.pop().type, type: "string"});
		},
		"iter, iterate, iterative"() {
			var iter_cou = stack.pop().data;
			var iterator = stack.pop();
			
			for(let cou = 0; cou < iter_cou; cou++) {
				run_function(iterator);
			}
		},
		"true, t, yes, y, on"() {
			stack.push({data: 1, type: "number"});
		},
		"false, f, no, n, off"() {
			stack.push({data: 0, type: "number"});
		},
		
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
			var list = list.pop().data;
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
		
		"call, run, do"() {
			run_function(stack.pop());
		}
		
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
						data: left.data**right.data,
						type: "number"
					});
					break;
			}
		},
		".."() {
			var end = stack.pop().data;
			var beginning = stack.pop().data;
			
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
			}
		}
		
	};
	
	for(instruccion_pointer = 0; instruccion_pointer < ast.length; instruccion_pointer++) {
		switch(ast[instruccion_pointer].type) {
			case "symbol":
				if(built_ins[ast[instruccion_pointer].data]) {
					built_ins[ast[instruccion_pointer].data]();
				} else {
					throw `Symbol \`${ast[instruccion_pointer].data}\` found in main expression without being a built-in function.`;
				}
				break;
			case "number":
			case "string":
				stack.push(ast[instruccion_pointer]);
				break;
			case "list":
				var list = [];
				for(let cou = 0; cou < ast[instruccion_pointer].data; cou++) {
					list.push(stack.pop());
				}
				stack.push({data: list.reverse(), type: "list"});
				break;
			case "function":
				stack.push(ast[instruccion_pointer]);
				break;
			case "operator":
				if(ast[instruccion_pointer].data != "$") {
					operators[ast[instruccion_pointer].data]();
				} else {
					instruccion_pointer++;
					stack.push(ast[instruccion_pointer]);
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
			case "number":
			case "string":
			case "symbol":
			case "operator":
				return value.data;
				break;
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
				return ["{", ...value.args, " -> <function definition>}"].join("");
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
	for (let cou = 0; cou < keys.length; cou++) {
		var key = keys[cou];
		var subkeys = key.split(/,\s?/);
		var target = obj[key];
		delete obj[key];
		subkeys.forEach(function(key) {obj[key] = target;});
	}
	return obj;
}

Array.prototype.rotate = function(n) {
	for (var cou = 0; cou < n; cou++) {
		this.push(this.shift());
	}
	return this;
}
require=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = {
	help: aliases => `

	HELP MENU

Usage: "calc= help"

Aliases: ${aliases}.

It shows the main calc= menu.
`,
	page: aliases => `

	BUILT-IN/OPERATOR DOCUMENTATION

Usage: "calc= page" or "calc= $command page", where "command" is the name of a built-in or an operator.

Aliases: ${aliases}.

Examples:
	* "calc= $+ page"
	* "calc= $page page"

Without any arguments, it shows how to use the documentation. With a symbol or operator, it shows the help page of the built-in or operator.
`,
	tut: aliases => `

	BASIC TUTORIAL

Usage: "calc= tut" or "calc= n tut", where "n" is the tutorial page number.

Aliases: ${aliases}.

It shows the basic tutorial page.
`,
	adv_tut: aliases => `

	ADVANCED TUTORIAL

Usage: "calc= adv_tut" or "calc= n adv_tut", where "n" is the tutorial page number.

Aliases: ${aliases}.

It shows the advanced tutorial page.
`,
	type: aliases => `

	TYPE

Usage: "calc= value type", where "value" is any value.

Aliases: ${aliases}.

Examples:
	* "calc= 1 type" -> "calc=number"
	* "calc= {} type" -> "calc=function"

Returns the type of any given value. These can be: number, string, list, function, symbol, or operator.
`,
	"true": aliases => `

	TRUE

Usage: "calc= true".

Aliases: ${aliases}.

Examples:
	* "calc= true" -> "calc=1"

Returns the simplest truthy value, 1.
`,
	"false": aliases => `

	FALSE

Usage: "calc= false".

Aliases: ${aliases}.

Examples:
	* "calc= false" -> "calc=0"

Returns the simplest falsy value, 0.
`,
	"if": aliases => `

	IF/ELSE STATEMENT

Usage: "calc= bool if_true if_false if", where "bool" is a truthy of falsy value, "if_true" is the branch for if the condition is true, and "if_false" is the alternate branch.

Aliases: ${aliases}.

Examples:
	* "calc= 3 true {1+} {1-} if" -> "calc=4"
	* "calc= 3 0 {1+} {1-} if" -> "calc=2"
	* "calc= "oigb" $5 $3 if" -> "calc=5"
	* "calc= false $5 $3 if" -> "calc=3"

If the condition is true, it executes the first branch, if not, then it executes the other branch. 

For different types, there are different ways to test if it is truthy:
	* Numbers that are 0 are falsy others are truthy.
	* String and Lists are treated as a number of their length, emptiness being 0, or falsy.
	* Functions, symbols, and operators are all truthy.
`,
	dup: aliases => `

	DUPLICATE

Usage: "calc= a dup", where "a" is any value.

Aliases: ${aliases}.

Examples:
	* "calc= 5 dup" -> "calc=5 5"
	* "calc= "str" "str" dup" -> "calc=str str"

It duplicates the top value of the stack. You can use dup to use some value without discarding it.
`,
	swap: aliases => `

	SWAP

Usage: "calc= a b swap", where "a" and "b" can be any value.

Aliases: ${aliases}.

Examples:
	* "calc= 2 5 swap" -> "calc=5 2"
	* "calc= "gh" [1, 2, 3] swap" -> "calc=[1, 2, 3] gh"

It swaps the top 2 values of the stack. This means you can use a value underneath another.
`,
	stack_reversen: aliases => `

	REVERSE TOP N ITEMS

${built_in_warning}

Usage: "calc= n ... m num stack_reversen", where "num" is the amount of items you want to reverse and "n ... m" are the items.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'd 'y 'f 4 stack_reversen" -> "calc=f y d a"
	* "calc= 10 6 .. expl 1 5 .. expl 10 stack_reversen" -> "calc= 5 4 3 2 1 6 7 8 9 10"

It reverses the top num items of the stack.
`,
	drop: aliases => `

	DROP

Usage: "calc= a drop", where "a" is any value.

Aliases: ${aliases}.

Examples:
	* "calc= 1 2 3 drop" -> "calc=1 2"
	* "calc= 'a 'b [] drop" -> "calc=a b"

It removes the top item of the stack.
`,
	dropn: aliases => `

	DROP N ITEMS

${built_in_warning}

Usage: "calc= n ... m num dropn", where "num" is the amount of items you want to drop and "n ... m" are the items.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c 'd 2 dropn" -> "calc=a b"
	* "calc= 10 1 .. expl 5 dropn" -> "calc=10 9 8 7 6"

It drops the top num items of the stack. It should be called with a known, fixed number or you could remove the wrong items, which would cause very strange bugs.
`,
	rot: aliases => `

	ROTATE

Usage: "calc= a b c rot", where "a", "b", and "c" can be any value.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c rot" -> "calc=c a b"
	* "calc= "as" [] 1 rot" -> "calc=1 as []"

It rotates the top three items of the stack to the right. To do this with more items you would use roll, but it is not recommended.
`,
	unrot: aliases => `

	ROTATE BACKWARD

Usage: "calc= a b c unrot", where "a", "b", and "c" can be any value.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c unrot" -> "calc=b c a"
	* "calc= "as" [] 1 unrot" -> "calc=[] 1 as"

It rotates the top three items of the stack to the left. To do this with more items you would use unroll, but it is not recommended.
`,
	roll: aliases => `

	ROLL

${built_in_warning}

Usage: "calc= n ... m num roll", where "num" is the amount of items you want to roll and "n ... m" are the items.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c 'd 'e 'f 4 roll" -> "calc=a b f c d e"
	* "calc= 1 5 .. {n -> 1 n .. expl n roll n group} map" -> "calc=[[1], [2, 1], [3, 1, 2], [4, 1, 2, 3], [5, 1, 2, 3, 4]]"

It rotates the top num items of the stack to the left. If you want to roll 2 or 3 three items, please check out swap and rot.
`,
	unroll: aliases => `

	ROLL BACKWARD

${built_in_warning}

Usage: "calc= n ... m num unroll", where "num" is the amount of items you want to roll backward and "n ... m" are the items.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c 'd 'e 'f 4 unroll" -> "calc=a b d e f c"
	* "calc= 1 5 .. {n -> 1 n .. expl n unroll n group} map" -> "calc=[[1], [2, 1], [2, 3, 1], [2, 3, 4, 1], [2, 3, 4, 5, 1]]"

It rotates the top num items of the stack to the right. If you want to roll backward 2 or 3 three items, please check out swap and unrot.
`,
	nip: aliases => `

	NIP UNDER

Usage: "calc= a b nip", where "a" and "b" can be any value.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c nip" -> "calc=a c"
	* "calc= 6 1 78 2 nip" -> "calc=6 1 2"

It removes the item under the top one. Equivalent to "swap drop".
`,
	tuck: aliases => `

	TUCK UNDER

Usage: "calc= a b nip", where "a" and "b" can be any value.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b 'c tuck" -> "calc=a c b c"
	* "calc= 1 [2] tuck" -> "calc=[2] 1 [2]"

It puts the top item of the stack underneath the next. Equivalent to "dup rot" or "swap over".
`,
	over: aliases => `

	DUPLICATE OVER

Usage: "calc= a b over", where "a" and "b" can be any value.

Aliases: ${aliases}.

Examples:
	* "calc= 'a 'b over" -> "calc=a b a"
	* "calc= 4 98 2 over" -> "calc=4 98 2 98"

It puts a duplicate of the second item from the top of the stack on top of the stack. Equivalent to "swap dup rot" or "swap tuck".
`,
/*
	map
	fold
	foldr
	filter
	length
	head
	snd
	last
	back_snd
	nth
	back_nth
	init
	tail
	body
	reverse
	reversen
	popn
	expl
	group
	copy_group
	group_all
	copy_group_all
	list_dup
	list_swap
	list_rot
	list_unrot
	list_roll
	list_reverse_roll
	list_nip
	list_tuck
	list_over
	pi
	e
	abs
	round
	ceil
	floor
	max
	main
	sgn
	rand
	cos
	sin
	tan
	sqrt
	cbrt
	root
	log
	call
	iter
	id
	dot
	set
	inc
	dec*/
};

var built_in_warning = "!WARNING: This function is discouraged from being used, the only reason it is here is for the few cases in which it is necessary!";
},{}],2:[function(require,module,exports){
"use strict";

var types = require("./types");

function lex(code) {
	var pointer = 0;
	var tokens = [];
	
	var expect = {
		
		sym() {
			var end = pointer + 1;
			while(/[A-Za-z_0-9]/.test(code[end]) && end < code.length) {
				end++;
			}
			var sym = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: sym, type: types.sym};
		},
		
		num() {
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
			var num = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: parseFloat(num), type: types.num};
		},
		
		str() {
			pointer++;
			
			var str = "";
			var escaped = false;
			while(code[pointer] != '"' || escaped) {
				if(!escaped) {
					if(code[pointer] != "\\") {
						str += code[pointer];
					} else {
						escaped = true;
					}
				} else {
					escaped = false;
					switch(code[pointer]) {
						case "n":
							str += "\n";
							break;
						case "t":
							str += "\t";
						default:
							str += code[pointer];
					}
				}
				pointer++;
			}
			
			pointer++;
			return {data: str, type: types.str};
		},
		
		char() {
			pointer += 2;
			return {data: code[pointer - 1], type: types.str}
		},
		
		op() {
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
			var op = code.substr(pointer, end - pointer);
			pointer = end;
			return {data: op, type: types.op};
		}
		
	};
	
	while(pointer < code.length) {
		if(/[A-Za-z_]/.test(code[pointer])) {
			tokens.push(expect.sym());
		} else if(/\d/.test(code[pointer])) {
			tokens.push(expect.num());
		} else if(code[pointer] == "-") {
			if(/\d/.test(code[pointer + 1])) {
				tokens.push(expect.num());
			} else {
				tokens.push(expect.op());
			}
		} else if(code[pointer] == '"') {
			tokens.push(expect.str());
		} else if(code[pointer] == "'") {
			tokens.push(expect.char());
		} else if(/\[|,|\]|{|}|\$|;|\+|\*|\/|\^|\.|=|<|>|&|\||!/.test(code[pointer])) {
			tokens.push(expect.op());
		} else {
			pointer++;
		}
	}
	
	return tokens;
}

module.exports = lex;
},{"./types":8}],3:[function(require,module,exports){
"use strict";

var types = require("./types");

function parse(tokens) {
	var token_pointer = 0;
	
	function parse_function() {
		token_pointer++;
		var args = [];
		
		var has_arrow = false;
		var end = token_pointer;
		var function_depth = 0;
		while(!is_op(tokens[end], "}") && end < tokens.length) {
			if(is_op(tokens[end], "->") && !function_depth) {
				has_arrow = true;
			} else if(is_op(tokens[end], "{")) {
				function_depth++;
			} else if(is_op(tokens[end], "}")) {
				function_depth--;
			}
			end++;
		}
		
		if(has_arrow) {
			while(!is_op(tokens[token_pointer], "->") && token_pointer < tokens.length) {
				if(tokens[token_pointer].type == types.sym) {
					args.push(tokens[token_pointer].data);
				} else {
					throw `Parameter name "${tokens[token_pointer].data}" is a ${types.type_to_str(tokens[token_pointer].type)} when it should be a symbol.`;
				}
				token_pointer++;
			}
			token_pointer++;
		}
		
		var raw_variables = [];
		var variable = [];
		while(!is_op(tokens[token_pointer], "}") && token_pointer < tokens.length) {
			if([types.sym, types.num, types.str].includes(tokens[token_pointer].type)) {
				variable.push(tokens[token_pointer]);
				token_pointer++;
			} else if(!is_op(tokens[token_pointer], "{") && !is_op(tokens[token_pointer], "[")) {
				if(is_op(tokens[token_pointer], ";")) {
					raw_variables.push(variable);
					variable = [];
				} else {
					variable.push(tokens[token_pointer]);
				}
				token_pointer++;
			} else {
				if(is_op(tokens[token_pointer], "{")) {
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
			if(!is_op(raw_variable[1], "=")) {
				throw "Error: variable definition has no \"=\".";
			}
			if(raw_variable[0].type != types.sym) {
				throw `Error: variable name is a ${types.type_to_str(raw_variable[0].type)} when it should be a symbol.`;
			}
			return {name: raw_variable[0].data, data: raw_variable.slice(2)};
		});
		token_pointer++;
		
		return {args, variables, data: code, type: types.func};
	}

	function parse_list() {
		token_pointer++;
		
		var code = [];
		var length = 0;
		while(!is_op(tokens[token_pointer], "]") && token_pointer < tokens.length) {
			if(is_op(tokens[token_pointer], ",")) {
				length++;
				token_pointer++;
			} else if([types.sym, types.num, types.str].includes(tokens[token_pointer].type)) {
				code.push(tokens[token_pointer]);
				token_pointer++;
			} else if(!is_op(tokens[token_pointer], "{") && !is_op(tokens[token_pointer], "[")) {
				if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
					variable.push(tokens[token_pointer]);
				} else {
					throw `Unexpected context operator "${tokens[token_pointer].data}".`;
				}
				token_pointer++;
			} else {
				if(is_op(tokens[token_pointer], "{")) {
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
		
		return [...code, {data: length, type: types.list}];
	}
	
	var raw_variables = [];
	var variable = [];
	while(token_pointer < tokens.length) {
		if([types.sym, types.num, types.str].includes(tokens[token_pointer].type)) {
			variable.push(tokens[token_pointer]);
			token_pointer++;
		} else if(!is_op(tokens[token_pointer], "{") && !is_op(tokens[token_pointer], "[")) {
			if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
				if(is_op(tokens[token_pointer], ";")) {
					raw_variables.push(variable);
					variable = [];
				} else {
					variable.push(tokens[token_pointer]);
				}
			} else {
				throw `Unexpected context operator "${tokens[token_pointer].data}".`;
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
		if(!is_op(raw_variable[1], "=")) {
			throw "Error: variable definition has no \"=\".";
		}
		if(raw_variable[0].type != types.sym) {
			throw `Error: variable name is a ${types.type_to_str(raw_variable[0].type)} when it should be a symbol.`;
		}
		return {name: raw_variable[0].data, data: raw_variable.slice(2)};
	});
	
	return {variables, data: ast};
}

var is_op = (token, op) => token.data == op && token.type == types.op;

module.exports = parse;
},{"./types":8}],4:[function(require,module,exports){
var types = require("./types");

module.exports = function print(value) {
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
			case types.str:
			case types.sym:
			case types.op:
				return value.data;
				break;
			case types.num:
				return Math.floor(value.data * 100000) / 100000;
			case types.list:
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
			case types.func:
				return `{${value.args.join(" ")} -> <function definition>}`;
				break;
		}
		
	}
}
},{"./types":8}],5:[function(require,module,exports){
"use strict";

var types = require("./types");
var variable_manipulation = require("./variable manipulation");

function run_function(func, stack, built_ins, operators, end_time) {
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
				stack.push({data: list.reverse(), type: types.list});
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
},{"./types":8,"./variable manipulation":9}],6:[function(require,module,exports){
"use strict";

var run_part = require("./run part");	
var standard_library = require("./standard library");

function run(ast, max_time = Infinity) {
	var stack = [];
	
	var end_time = (new Date).getTime() + max_time;
	
	var operators = standard_library.operators(stack);
	var built_ins = standard_library.built_ins(stack, operators, end_time);
	
	var variables = {};
	for(let cou = 0; cou < ast.variables.length; cou++) {
		run_part.run_block(ast.variables[cou].data, stack, [variables], built_ins, operators, end_time);
		variables[ast.variables[cou].name] = stack.pop();
	}
	
	run_part.run_block(ast.data, stack, [variables], built_ins, operators, end_time);
	
	return stack;
}

module.exports = run;
},{"./run part":5,"./standard library":7}],7:[function(require,module,exports){
"use strict";

var types = require("./types");
var print = require("./print");
var run_part = require("./run part");
var variable_manipulation = require("./variable manipulation");
var help_pages = require("./help pages");

// Generate built-ins based on a stack, operators, and an end time.

function built_ins(stack, operators, end_time) {
	var made_built_ins = expand({
		
		// Help functions.
		
		"help, h"() {
			stack.push({data: `

	CALC=

Welcome to calc=, the stack language for chats! For a basic tutorial, type "calc= tut". If you already know stack based programming, use "calc= adv_tut".

Demos:
	* Fibonacci: "calc= fib = {n -> 0 1 {x y -> y x y +} n iter drop} ; 0 9 .. $fib map"
	* Factorial: "calc= 1 5 .. 1 $* fold"
`, type: types.str});
		},
		"page, help_page, hp, h_page, help_p"() {
			if(stack.length == 0) {
				stack.push({data: "Help page usage not done yet.", type: types.str});
			} else {
				var page = stack.pop();
				if(page.type == types.sym) {
					var found = made_built_ins[page.data];
					if(found) {
						stack.push({data: help_pages[found.main_alias](found.aliases.join(", ")), type: types.str});
					} else {
						stack.push({data: `Error: "${page.data}" is not a built-in.`, type: types.str});
					}
				} else if(page.type == types.op) {
					
				} else {
					stack.push({data: `Error: cannot get help page for value "${print(page)}" of type ${types.type_to_str(page.type)}.`, type: types.str});
				}
			}
		},
		"tut, tutorial"() {
			if(stack.length == 0) {
				stack.push({data: tut_pages[0], type: types.str});
			} else {
				var page = stack.pop().data;
				if(page < tut_pages.length) {
					stack.push({data: tut_pages[page], type: types.str});
				} else {
					stack.push({data: `Error: tutorial page ${page} does not exist.`, type: types.str});
				}
			}
		},
		"adv_tut, adv_tutorial, advanced_tutorial, advanced_tut"() {
			if(stack.length == 0) {
				stack.push({data: adv_tut_pages[0], type: types.str});
			} else {
				var page = stack.pop().data;
				if(page < adv_tut_pages.length) {
					stack.push({data: adv_tut_pages[page], type: types.str});
				} else {
					stack.push({data: `Error: advanced tutorial page ${page} does not exist.`, type: types.str});
				}
			}
		},
		
		// Basic functions.
		
		"type, typeof, instance, instanceof"() {
			stack.push({data: types.type_to_str(stack.pop().type), type: types.str});
		},
		"true, yes, on"() {
			stack.push({data: 1, type: types.num});
		},
		"false, no, off"() {
			stack.push({data: 0, type: types.num});
		},
		
		// Flow control.
		
		"if, iff"() {
			var if_false = stack.pop();
			var if_true = stack.pop();
			var cond = stack.pop();
			
			var is_true;
			switch(cond.type) {
				case types.num:
				case types.str:
					is_true = cond.data;
					break;
				case types.func:
				case types.sym:
					is_true = true;
					break;
				case types.list:
					is_true = cond.data.length;
					break;
			}
			if(is_true) {
				run_part.run_function(if_true, stack, made_built_ins, operators, end_time);
			} else {
				run_part.run_function(if_false, stack, made_built_ins, operators, end_time);
			}
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
		"stack_reversen, stack_invertn"() {
			var n = stack.pop().data;
			var reversed_vals = stack.splice(stack.length - n, n).reverse();
			stack.push.apply(stack, reversed_vals);
		},
		"drop, stack_pop"() {
			stack.pop();
		},
		"dropn, stack_popn"() {
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
		"unrot, unrotate, reverse_rot, reverse_rotate, counter_rot, counter_rotate"() {
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
		"unroll, unrotn, unrotaten, reverse_roll, counter_roll, reverse_rotn, reverse_rotaten, counter_rotn, counter_rotaten"() {
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
		
		// List functions.
		
		"map, apply, apply_to"() {
			var mapper = stack.pop();
			var list = stack.pop().data;
			
			var mapped = list.map(item => {
				stack.push(item);
				run_part.run_function(mapper, stack, made_built_ins, operators, end_time);
				return stack.pop();
			});
			
			stack.push({data: mapped, type: types.list});
		},
		"fold, foldl, reduce, fold_left"() {
			var reducer = stack.pop();
			var accumulator = stack.pop();
			var list = stack.pop().data;
			stack.push(accumulator);
			
			for(let cou = 0; cou < list.length; cou++) {
				stack.push(list[cou]);
				run_part.run_function(reducer, stack, made_built_ins, operators, end_time);
			}
		},
		"foldr, fold_right"() {
			var reducer = stack.pop();
			var accumulator = stack.pop();
			var list = stack.pop().data;
			stack.push(accumulator);
			
			for(let cou = list.length - 1; cou > -1; cou--) {
				stack.push(list[cou]);
				run_part.run_function(reducer, stack, made_built_ins, operators, end_time);
			}
		},
		filter() {
			var filter = stack.pop();
			var list = stack.pop().data;
			
			var filtered = list.filter(item => {
				stack.push(item);
				run_part.run_function(filter, stack, made_built_ins, operators, end_time);
				return stack.pop().data;
			});
			
			stack.push({data: filtered, type: types.list});
		},
		"length, size, len"() {
			stack.push({data: stack.pop().data.length, type: types.num});
		},
		"head, first, cat, top, pop, fst"() {
			var list = stack.pop().data;
			stack.push(list[0]);
		},
		"snd, second"() {
			var list = stack.pop().data;
			stack.push(list[1]);
		},
		"last, bottom"() {
			var list = stack.pop().data;
			stack.push(list[list.length - 1]);
		},
		"back_snd, back_second, before_last"() {
			var list = stack.pop().data;
			stack.push(list[list.length - 2]);
		},
		"nth, item, frontn, index, front_index, middlen, middle_index"() {
			var index = stack.pop().data;
			var list = stack.pop().data;
			stack.push(list[index]);
		},
		"back_nth, back_item, lastn, backn, back_index"() {
			var index = stack.pop().data;
			var list = stack.pop().data;
			stack.push(list[list.length - index - 1]);
		},
		"init, front, list_drop"() {
			stack.push({
				data: stack.pop().data.slice(0, -1),
				type: types.list
			});
		},
		"tail, back, cdr, rest"() {
			stack.push({
				data: stack.pop().data.slice(1),
				type: types.list
			});
		},
		"body, middle"() {
			stack.push({
				data: stack.pop().data.slice(1, -1),
				type: types.list
			});
		},
		"reverse, invert"() {
			var list = stack.pop().data;
			stack.push({data: list.reverse(), type: types.list});
		},
		"reversen, invertn"() {
			var list = stack.pop().data;
			var n = list.pop().data;
			list = list.concat(list.splice(list.length - n, n).reverse());
			stack.push({data: list, type: types.list});
		},
		"popn, list_dropn"() {
			var n = stack.pop().data;
			var list = stack.pop().data;
			for(let cou = 0; cou < n; cou++) {
				list.pop();
			}
			stack.push({data: list, type: types.list});
		},
		"expl, explode, extr, extract, spr, spread"() {
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
			stack.push({data: list, type: types.list});
		},
		"copy_group, copy_as_list"() {
			var n = stack.pop().data;
			
			var list = [];
			for(let cou = 0; cou < n; cou++) {
				list.unshift(stack[stack.length - 1 - cou]);
			}
			stack.push({data: list, type: types.list});
		},
		group_all() {
			var list = stack.slice();
			stack = [];
			stack.push({data: list, type: types.list});
		},
		copy_group_all() {
			var list = stack.slice();
			stack.push({data: list, type: types.list});
		},
		"list_dup, list_duplicate"() {
			var list = stack.pop().data;
			list.push(list[list.length - 1]);
			stack.push({data: list, type: types.list});
		},
		list_swap() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			list.push(second);
			stack.push({data: list, type: types.list});
		},
		"list_rot, list_rotate"() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			var third = list.pop();
			list.push(first);
			list.push(third);
			list.push(second);
			stack.push({data: list, type: types.list});
		},
		"list_unrot, list_unrotate, list_reverse_rot, list_reverse_rotate, list_counter_rot, list_counter_rotate"() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			var third = list.pop();
			list.push(second);
			list.push(first);
			list.push(third);
			stack.push({data: list, type: types.list});
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
			
			stack.push({data: list, type: types.list});
		},
		"list_reverse_roll, list_counter_roll, list_reverse_rotn, list_reverse_rotaten, list_counter_rotn, list_counter_rotaten"() {
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
			
			stack.push({data: list, type: types.list});
		},
		list_nip() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			stack.push({data: list, type: types.list});
		},
		list_tuck() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			list.push(second);
			list.push(first);
			stack.push({data: list, type: types.list});
		},
		list_over() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(second);
			list.push(first);
			list.push(second);
			stack.push({data: list, type: types.list});
		},
		
		// Math functions.
		
		pi() {
			stack.push({data: Math.PI, type: types.num});
		},
		e() {
			stack.push({data: Math.E, type: types.num});
		},
		"abs, absolute, positive"() {
			stack.push({data: Math.abs(stack.pop().data), type: types.num});
		},
		"round, trunc, truncate"() {
			stack.push({data: Math.round(stack.pop().data), type: types.num});
		},
		"ceil, ceiling, roof"() {
			stack.push({data: Math.ceil(stack.pop().data), type: types.num});
		},
		floor() {
			stack.push({data: Math.floor(stack.pop().data), type: types.num});
		},
		"max, maximum, biggest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push({data: Math.max(left, right), type: types.num});
		},
		"main, minimum, smallest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push({data: Math.min(left, right), type: types.num});
		},
		"sgn, sign"() {
			stack.push({data: Math.sign(stack.pop().data), type: types.num});
		},
		"rand, random"() {
			var min = stack.pop().data;
			var max = stack.pop().data;
			stack.push({data: (Math.random() * (max - min)) + min, type: types.num});
		},
		"cos, cosine"() {
			stack.push({data: Math.cos(stack.pop().data), type: types.num});
		},
		"sin, sine"() {
			stack.push({data: Math.sin(stack.pop().data), type: types.num});
		},
		"tan, tangent"() {
			stack.push({data: Math.tan(stack.pop().data), type: types.num});
		},
		"sqrt, square_root"() {
			stack.push({data: Math.sqrt(stack.pop().data), type: types.num});
		},
		"cbrt, cube_root"() {
			stack.push({data: Math.cbrt(stack.pop().data), type: types.num});
		},
		root() {
			var num = stack.pop().data;
			var exp = stack.pop().data;
			stack.push({data: num ** (1 / exp), type: types.num});
		},
		"log, logarithm"() {
			var num = stack.pop().data;
			var base = stack.pop().data;
			stack.push({data: Math.log(num) / Math.log(base), type: types.num});
		},
		
		// Function functions.
		
		"call, run, do, apply, get"() {
			run_part.run_function(stack.pop(), stack, made_built_ins, operators, end_time);
		},
		"iter, iterate, iterative, loop, loopn"() {
			var iter_cou = stack.pop().data;
			var iterator = stack.pop();
			
			for(let cou = 0; cou < iter_cou; cou++) {
				run_part.run_function(iterator, stack, made_built_ins, operators, end_time);
			}
		},
		"id, identity, nop, noop"() {},
		"dot, comp, compose"(scopes) {
			var second = stack.pop();
			var first = stack.pop();
			var run = {data: "run", type: types.sym};
			
			stack.push({
				args: [],
				data: [first, run, second, run],
				scopes,
				type: types.func,
				variables: []
			});
		},
		
		// Scope-needing functions.
		
		set(scopes) {
			var value = stack.pop();
			var name = stack.pop().name;
			variable_manipulation.set_variable(name, value, scopes);
		},
		"inc, increment"(scopes) {
			var name = stack.pop().name;
			var value = variable_manipulation.get_variable(name, scopes);
			value.data++;
			variable_manipulation.set_variable(name, value, scopes);
		},
		"dec, decrement"(scopes) {
			var name = stack.pop().name;
			var value = variable_manipulation.get_variable(name, scopes);
			value.data--;
			variable_manipulation.set_variable(name, value, scopes);
		}
	});
	
	return made_built_ins;
}

var tut_pages = [`

	INTRODUCTION (0)

calc= is a programming language for chats. Every program starts with "calc=" and then has a series of instruccions to follow. calc= is a stack based (or concatenative) language, which means all of it's computations will be done using a stack. You can push things on top, then pop them off to use them. Try the program "calc= 5 1 -", then proceed to the next page of the tutorial. To access a page use "calc= number tut", where you replace "number" by the page number. The next page of this tutorial is at "calc= 1 tut".
`,`

	FIRST EXAMPLE (1)

As you can see, "calc= 5 1 -" gives back "calc= 4". This is because "5" pushed a "5" on top of the stack, then "1" pushed a "1". Finally "-" popped the top two elements from the stack, "5" and "1", and subtracted them to form "4".
`];

var adv_tut_pages = [`

	WIP (0)

Advanced tutorial pages are still a work in progress.
`];

// Generate operators based on a stack.

function operators(stack) {
	return {
		
		"+"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(
				left.type == types.num && right.type == types.num ||
				left.type == types.str && right.type == types.str
			) {
				stack.push({
					data: left.data + right.data,
					type: left.type
				});
			} else if(left.type == types.list && right.type != types.list) {
				stack.push({
					data: [...left.data, right],
					type: types.list
				});
			} else if(left.type != types.list && right.type == types.list) {
				stack.push({
					data: [left, ...right.data],
					type: types.list
				});
			} else if(left.type == types.list && right.type == types.list) {
				stack.push({
					data: [...left.data, ...right.data],
					type: types.list
				});
			}
		},
		"-"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data - right.data,
					type: types.num
				});
			} else if(left.type == types.str && right.type == types.num) {
				var cut_string = right.data > 0
					? left.data.slice(0, -right.data)
					: right.data < 0
						? left.data.slice(-right.data)
						: left.data;
				stack.push({
					data: cut_string,
					type: types.str
				});
			}
		},
		"*"() {
			var right = stack.pop();
			var left = stack.pop();
			
			var cartesian_prod = (col, row) => col.reduce(
				(acc, i) => [...acc, ...row.map(j => [i, j])],
				[]
			);
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data * right.data,
					type: types.num
				});
			} else if(left.type == types.str && right.type == types.num) {
				stack.push({
					data: left.data.repeat(right.data),
					type: types.str
				});
			} else if(left.type == types.num && right.type == types.str) {
				stack.push({
					data: right.data.repeat(left.data),
					type: types.str
				});
			} else if(left.type == types.str && right.type == types.str) {
				var prod = cartesian_prod(left.data.split(""), right.data.split(""));
				stack.push({
					data: prod.map(pair => ({data: pair.join(""), type: types.str})),
					type: types.list
				});
			} else if(left.type == types.list && right.type == types.list) {
				var prod = cartesian_prod(left.data, right.data);
				stack.push({
					data: prod.map(pair => ({data: pair, type: types.list})),
					type: types.list
				});
			}
		},
		"/"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data / right.data,
					type: types.num
				});
			}
		},
		"^"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data ** right.data,
					type: types.num
				});
			}
		},
		".."() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				var beginning = Math.floor(left.data);
				var end = Math.floor(right.data);
			} else if(left.type == types.str && right.type == types.str) {
				if(left.data.length != 1 || right.data.length != 1) {
					throw `".." found the strings "${beginning}" of length ${beginning.length} and "${end}" of length ${end.length}. ".." expected both to be length 1 (characters).`;
				}
				
				var beginning = left.data.charCodeAt();
				var end = right.data.charCodeAt();
			} else {
				throw `".." expected two numbers or two strings, instead found a ${types.type_to_str(left.type)} "${print(left)}" and a ${types.type_to_str(right.type)} "${print(right)}".`
			}
			
			var gets_bigger = beginning < end;
			
			var list = [];
			for(let cou = (gets_bigger ? beginning : end); cou < (gets_bigger ? end + 1 : beginning + 1); cou++) {
				list.push({data: cou, type: types.num});
			}
			
			if(left.type == types.str) {
				list = list.map(n => ({data: String.fromCharCode(n.data), type: types.str}));
			}
			stack.push({
				data: (gets_bigger ? list : list.reverse()),
				type: types.list
			});
		},
		"&"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data && right.data,
					type: types.num
				});
			}
		},
		"|"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data || right.data,
					type: types.num
				});
			}
		},
		"!"() {
			var bool = stack.pop();
			if(bool.type == types.num) {
				stack.push({
					data: !bool.data | 0,
					type: types.num
				});
			}
		},
		"="() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(
				left.type == types.num && right.type == types.num ||
				left.type == types.str && right.type == types.str
			) {
				stack.push({
					data: left.data == right.data | 0,
					type: types.num
				});
			} else if(left.type == types.list && right.type == types.list) {
				stack.push({
					data: Object.compare(left.data, right.data) | 0,
					type: types.num
				});
			}
		},
		"!="() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(
				left.type == types.num && right.type == types.num ||
				left.type == types.str && right.type == types.str
			) {
				stack.push({
					data: left.data != right.data | 0,
					type: types.num
				});
			} else if(left.type == types.list && right.type == types.list) {
				stack.push({
					data: !Object.compare(left.data, right.data) | 0,
					type: types.num
				});
			}
		},
		"<"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data < right.data | 0,
					type: types.num
				});
			} else if(
				left.type == types.str && right.type == types.str ||
				left.type == types.list && right.type == types.list
			) {
				stack.push({
					data: left.data.length < right.data.length | 0,
					type: types.num
				});
			}
		},
		">"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data > right.data | 0,
					type: types.num
				});
			} else if(
				left.type == types.str && right.type == types.str ||
				left.type == types.list && right.type == types.list
			) {
				stack.push({
					data: left.data.length > right.data.length | 0,
					type: types.num
				});
			}
		},
		"<="() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data <= right.data | 0,
					type: types.num
				});
			} else if(
				left.type == types.str && right.type == types.str ||
				left.type == types.list && right.type == types.list
			) {
				stack.push({
					data: left.data.length <= right.data.length | 0,
					type: types.num
				});
			}
		},
		">="() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push({
					data: left.data >= right.data | 0,
					type: types.num
				});
			} else if(
				left.type == types.str && right.type == types.str ||
				left.type == types.list && right.type == types.list
			) {
				stack.push({
					data: left.data.length >= right.data.length | 0,
					type: types.num
				});
			}
		}
		
	};
}

// Taken from https://stackoverflow.com/questions/14743536/multiple-key-names-same-pair-value .
function expand(obj) {
	var keys = Object.keys(obj);
	for(let cou = 0; cou < keys.length; cou++) {
		var key = keys[cou];
		var subkeys = key.split(/,\s?/);
		var target = obj[key];
		target.main_alias = subkeys[0];
		target.aliases = subkeys;
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

module.exports = {built_ins, operators};
},{"./help pages":1,"./print":4,"./run part":5,"./types":8,"./variable manipulation":9}],8:[function(require,module,exports){
var types = {
	num: 0, str: 1, list: 2,
	func: 3, sym: 4, op: 5
};

function type_to_str(type) {
	switch(type) {
		case types.num:
			return "number";
		case types.str:
			return "string";
		case types.list:
			return "list";
		case types.func:
			return "function";
		case types.sym:
			return "symbol";
		case types.op:
			return "operator";
	}
}

module.exports = {...types, type_to_str};
},{}],9:[function(require,module,exports){
function get_variable(name, scopes) {
	for(let cou = scopes.length - 1; cou >= 0; cou--) {
		if(scopes[cou][name]) {
			return scopes[cou][name];
		}
	}
	return undefined;
}

function set_variable(name, value, scopes) {
	for(let cou = scopes.length - 1; cou >= 0; cou--) {
		if(scopes[cou][name]) {
			scopes[cou][name] = value;
			return scopes[cou][name];
		}
	}
	return undefined;
}

module.exports = {get_variable, set_variable};
},{}],"calc":[function(require,module,exports){
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
		throw "calc=" + err_to_str(err);
	}
}

var err_to_str = err => !(err instanceof Error)
	? err
	: "\n" + err.stack.split("\n").slice(0, 2).join("\n\t");

module.exports = {calc, print, err_to_str};
},{"./lex":2,"./parse":3,"./print":4,"./run":6}]},{},[]);

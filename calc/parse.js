"use strict";

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
		while(!is_op(tokens[token_pointer], "}") && token_pointer < tokens.length) {
			if(/symbol|number|string/.test(tokens[token_pointer].type)) {
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
		while(!is_op(tokens[token_pointer], "]") && token_pointer < tokens.length) {
			if(is_op(tokens[token_pointer], ",")) {
				length++;
				token_pointer++;
			} else if(/symbol|number|string/.test(tokens[token_pointer].type)) {
				code.push(tokens[token_pointer]);
				token_pointer++;
			} else if(!is_op(tokens[token_pointer], "{") && !is_op(tokens[token_pointer], "[")) {
				if(!/,|\]|}|->/.test(tokens[token_pointer].data)) {
					variable.push(tokens[token_pointer]);
				} else {
					throw `Unexpected context operator \`${tokens[token_pointer].data}\`.`;
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
		
		return [...code, {data: length, type: "list"}];
	}
	
	var raw_variables = [];
	var variable = [];
	while(token_pointer < tokens.length) {
		if(/symbol|number|string/.test(tokens[token_pointer].type)) {
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
		if(!is_op(raw_variable[1], "=")) {
			throw "Error: variable definition has no `=`.";
		}
		if(raw_variable[0].type != "symbol") {
			throw `Error: variable name is a \`${raw_variable[0].type}\` when it should be a \`symbol\`.`;
		}
		return {name: raw_variable[0].data, data: raw_variable.slice(2)};
	});
	
	return {variables, data: ast};
}

var is_op = (token, op) => token.data == op && token.type == "operator";

module.exports = parse;
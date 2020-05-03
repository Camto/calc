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
			return types.new_sym(sym);
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
			return types.new_num(parseFloat(num));
		},
		
		str() {
			pointer++;
			
			var str = "";
			var escaped = false;
			while((code[pointer] != '"' || escaped) && pointer < code.length) {
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
							break;
						default:
							str += code[pointer];
							break;
					}
				}
				pointer++;
			}
			
			if(code[pointer] != '"') {
				throw 'Error: found " to start a string, but none to finish it.';
			}
			
			pointer++;
			return types.new_str(str);
		},
		
		char() {
			pointer += 2;
			if(code[pointer - 1] == "\\") {
				pointer++;
				switch(code[pointer - 1]) {
					case "n":
						return types.new_str("\n");
					case "t":
						return types.new_str("\t");
					default:
						return types.new_str(code[pointer - 1]);
				}
			}
			return types.new_str(code[pointer - 1]);
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
			return types.new_op(op);
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
		} else if(/\[|,|\]|{|}|\$|;|\+|\*|\/|\^|%|\.|=|<|>|&|\||!/.test(code[pointer])) {
			tokens.push(expect.op());
		} else {
			pointer++;
		}
	}
	
	return tokens;
}

module.exports = lex;
"use strict";

var types = require("./types");

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
			return {data: symbol, type: types.sym};
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
			return {data: parseFloat(number), type: types.num};
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
			return {data: string, type: types.str};
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
			return {data: operator, type: types.op};
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

module.exports = lex;
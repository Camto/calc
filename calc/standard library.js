"use strict";

var run_part = require("./run part");
var variable_manipulation = require("./variable manipulation");

// Generate built-ins based on a stack, operators, and an end time.

function built_ins(stack, operators, end_time) {
	var made_built_ins = expand({
		
		// Help functions.
		
		"help, h"() {
			stack.push({data: `
Demos!
    • Fibonacci: \`calc= [1, 1] {i -> i (i last (i 1 backn) +) +} 7 iter last\`
    • Factorial: \`calc= 1 5 .. $* 1 fold\`
For a basic tutorial, type \`calc= tut\`. If you already know stack based programming, use \`calc= adv_tut\`.`, type: "string"});
		},
		"page, p, help_page, hp, h_page, help_p"() {
			stack.push({data: "The help pages are still a work in progress.", type: "string"});
		},
		"tut, tutorial"() {
			if(stack.length == 0) {
				stack.push({data: `

INTRODUCTION

calc= is a programming language made for doing maths in chats. Every program starts with \`calc=\` and has a series of instruccions to execute. Since calc= is stack based or concatenative, you put things on top of the stack, then remove them to do math. For example, \`calc= 3\` will result in \`3\`. You can do simple operations like \`calc= 3 4 +\`, which results in \`7\` because \`3\` and \`4\` get pushed onto the stack and \`+\` pops them off, adds them, and pushes the result back onto the stack, which is the result you see in the end. The basic operators are \`+\` (addition), \`-\` (subtraction), \`*\` (multiplication), and \`/\` (division). For example, the amount of seconds in a year would be \`calc= 365 24 60 60 * * *\`, to see how it works, just remember that the number get pushed onto the stack and \`*\` takes them off to put the result back. For different pages of this tutorial, use \`calc= 1 tut\`, \`calc= 2 tut\`, and so on.`, type: "string"});
			} else {
				
			}
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
				run_part.run_function(mapper, stack, made_built_ins, operators, end_time);
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
				run_part.run_function(reducer, stack, made_built_ins, operators, end_time);
			}
		},
		"anti_reduce, anti_fold, foldr, fold_right"() {
			var accumulator = stack.pop();
			var reducer = stack.pop();
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

// Generate operators based on a stack.

function operators(stack) {
	return {
		
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
				case "stringnumber":
					stack.push({
						data: left.data.repeat(right.data),
						type: "string"
					});
					break;
				case "numberstring":
					stack.push({
						data: right.data.repeat(left.data),
						type: "string"
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

module.exports = {built_ins, operators};
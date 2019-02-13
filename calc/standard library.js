"use strict";

var types = require("./types");
var print = require("./print");
var run_part = require("./run part");
var variable_manipulation = require("./variable manipulation");
var help = require("./help");

// Generate built-ins based on a stack, operators, and an end time.

function built_ins(stack, calc, operators, end_time) {
	var made_built_ins = expand({
		
		// Help functions.
		
		"help, h"() {
			stack.push(types.new_str(`

	CALC=

Welcome to calc=, the stack language for chats! For a basic tutorial, type "calc= tut". If you already know stack based programming, use "calc= adv_tut".

Demos:
	* Fibonacci: "calc= fib = {n -> 0 1 {x y -> y x y +} n iter drop} ; 0 9 .. $fib map"
	* Factorial: "calc= 1 5 .. 1 $* fold"
`));
		},
		"page, help_page, hp, h_page, help_p, doc, docs, documentation"() {
			if(stack.length == 0) {
				stack.push(types.new_str(`

	HELP PAGES

This is the help page index!

To find the help page of a built-in or an operator, just run this command: "calc= $thing page", where "thing" is the name of the built-in or the operator.

The built-ins are classified in these categories:
	* Help functions.
		* help - Help menu.
		* page - Built-in/operator documentation.
		* tut - Basic tutorial.
		* adv_tut - Advanced tutorial.

	* Basic functions.
		* type - Get type.
		* true
		* false
		* num_to_str - Convert number to string.
		* str_to_num - Convert string to number.
		* eval - Evaluate calc= program.

	* Flow control.
		* if - If/else statement.

	* Stack functions.
		* dup - Duplicate.
		* swap
		* stack_reverse_n - Reverse top n items.
		* drop
		* drop_n - Drop n items.
		* rot - Rotate.
		* unrot - Rotate backward.
		* roll - Roll.
		* unroll - Roll backward.
		* nip - Nip under.
		* tuck - Tuck under.
		* over - Duplicate over.

	* List functions.
		* map - Map over list.
		* fold - Fold list to the left.
		* foldr - Fold list to the right.
		* filter - Filter list with predicate.
		* length - Length of.
		* head - First item.
		* snd - Second item.
		* last - Last item.
		* back_snd - Before last item.
		* nth - N-th item.
		* back_nth - N-th item from the end.
		* init - All but first item.
		* tail - All but last item.
		* body - All but first and last item.
		* reverse - Reverse list.
		* reverse_n - Reverse last n items of list.
		* pop_n - Remove last n items of list.
		* elem - Is item in list.
		* expl - Explode list items.
		* group - Group into list.
		* copy_group - Copy and group into list.
		* group_all - Group all items into list.
		* copy_group_all - Copy and group all items into list.
		* list_dup - Duplicate top of list.
		* list_swap - Swap top of list.
		* list_rot - Rotate top of list.
		* list_unrot - Rotate top of list backward.
		* list_roll - Roll top of list.
		* list_unroll - Roll top of list backward.
		* list_nip - Nip under list.
		* list_tuck - Tuck under list.
		* list_over - Duplicate over on list.

	* Math functions.
		* pi - The constant pi.
		* tau - The constant tau.
		* e - The constant e.
		* abs - Absolute value.
		* round - Round to the nearest integer.
		* ceil - Round upwards.
		* floor - Round downwards.
		* max - Biggest or longest.
		* min - Smallest or shortest.
		* sgn - Sign of number.
		* rand - Generate random number.
		* cos - Cosine of angle in radians.
		* sin - Sine of angle in radians.
		* tan - Tangent of angle in radians.
		* sqrt - Square root.
		* cbrt - Cube root.
		* root - N-th root.
		* log - Logarithm.
		* ln - Natural logarithm.

	* Function functions.
		* call - Call function or built-in.
		* iter - Iterate over.
		* id - Identity function.
		* comp - Compose functions.

	* State functions.
		* set - Set variable.
		* inc - Increment variable.
		* dec - Decrement variable.
`));
			} else {
				var page = stack.pop();
				if(page.type == types.sym) {
					var found = made_built_ins[page.data];
					if(found) {
						stack.push(types.new_str(help.help_pages[found.main_alias](found.aliases.join(", "))));
					} else {
						stack.push(types.new_str(`Error: "${page.data}" is not a built-in.`));
					}
				} else if(page.type == types.op) {
					stack.push(types.new_str(help.op_help_pages[page.data]));
				} else {
					stack.push(types.new_str(`Error: cannot get help page for value "${print(page)}" of type ${types.type_to_str(page.type)}.`));
				}
			}
		},
		"tut, tutorial"() {
			if(stack.length == 0) {
				stack.push(types.new_str(help.tut_pages[0]));
			} else {
				var page = stack.pop().data;
				if(page < help.tut_pages.length) {
					stack.push(types.new_str(help.tut_pages[page]));
				} else {
					stack.push(types.new_str(`Error: tutorial page ${page} does not exist.`));
				}
			}
		},
		"adv_tut, adv_tutorial, advanced_tutorial, advanced_tut"() {
			if(stack.length == 0) {
				stack.push(types.new_str(help.adv_tut_pages[0]));
			} else {
				var page = stack.pop().data;
				if(page < help.adv_tut_pages.length) {
					stack.push(types.new_str(help.adv_tut_pages[page]));
				} else {
					stack.push(types.new_str(`Error: advanced tutorial page ${page} does not exist.`));
				}
			}
		},
		
		// Basic functions.
		
		"type, typeof, instance, instanceof"() {
			stack.push(types.new_str(types.type_to_str(stack.pop().type)));
		},
		"true, yes, on"() {
			stack.push(types.new_bool(true));
		},
		"false, no, off"() {
			stack.push(types.new_bool(false));
		},
		"num_to_str, number_to_string"() {
			var num = stack.pop().data;
			stack.push(types.new_str((Math.round(num * 100000) / 100000).toString()));
		},
		"str_to_num, string_to_number"() {
			var str = stack.pop().data;
			stack.push(types.new_num(parseFloat(str)));
		},
		"eval, evaluate, calc"() {
			var program = stack.pop().data;
			stack.push(types.new_list(
				calc(program, end_time - (new Date).getTime())
			));
		},
		
		// Flow control.
		
		"if, iff"() {
			var if_false = stack.pop();
			var if_true = stack.pop();
			var cond = stack.pop();
			
			if(types.to_bool(cond)) {
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
		"stack_reverse_n, stack_invert_n"() {
			var n = stack.pop().data;
			var reversed_vals = stack.splice(stack.length - n, n).reverse();
			stack.push.apply(stack, reversed_vals);
		},
		"drop, stack_pop"() {
			stack.pop();
		},
		"dropn, stack_pop_n"() {
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
		"roll, rot_n, rotate_n"() {
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
		"unroll, unrot_n, unrotate_n, reverse_roll, counter_roll, reverse_rot_n, reverse_rotate_n, counter_rot_n, counter_rotate_n"() {
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
		
		"map, fmap"() {
			var mapper = stack.pop();
			var list = stack.pop().data;
			
			var mapped = list.map(item => {
				stack.push(item);
				run_part.run_function(mapper, stack, made_built_ins, operators, end_time);
				return stack.pop();
			});
			
			stack.push(types.new_list(mapped));
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
				return types.to_bool(stack.pop());
			});
			
			stack.push(types.new_list(filtered));
		},
		"length, size, len"() {
			stack.push(types.new_num(stack.pop().data.length));
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
		"nth, item, front_n, index, front_index, middle_n, middle_index"() {
			var index = stack.pop().data;
			var list = stack.pop().data;
			stack.push(list[index]);
		},
		"back_nth, back_item, last_n, back_n, back_index"() {
			var index = stack.pop().data;
			var list = stack.pop().data;
			stack.push(list[list.length - index - 1]);
		},
		"init, front, list_drop"() {
			stack.push(types.new_list(stack.pop().data.slice(0, -1)));
		},
		"tail, back, cdr, rest"() {
			stack.push(types.new_list(stack.pop().data.slice(1)));
		},
		"body, middle"() {
			stack.push(types.new_list(stack.pop().data.slice(1, -1)));
		},
		"reverse, invert"() {
			var list = stack.pop().data;
			stack.push(types.new_list(list.reverse()));
		},
		"reverse_n, invert_n"() {
			var n = stack.pop().data;
			var list = stack.pop().data;
			list = list.concat(list.splice(list.length - n, n).reverse());
			stack.push(types.new_list(list));
		},
		"pop_n, list_drop_n"() {
			var n = stack.pop().data;
			var list = stack.pop().data;
			for(let cou = 0; cou < n; cou++) {
				list.pop();
			}
			stack.push(types.new_list(list));
		},
		"elem, includes, contains, in_list"() {
			var item = stack.pop();
			var list = stack.pop().data;
			
			stack.push(types.new_bool(list.reduce(
				(acc, cur) => acc || types.eq(item, cur),
				false
			)));
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
			stack.push(types.new_list(list));
		},
		"copy_group, copy_as_list"() {
			var n = stack.pop().data;
			
			var list = [];
			for(let cou = 0; cou < n; cou++) {
				list.unshift(stack[stack.length - 1 - cou]);
			}
			stack.push(types.new_list(list));
		},
		group_all() {
			var list = stack.slice();
			stack.splice(0, stack.length);
			stack.push(types.new_list(list));
		},
		copy_group_all() {
			var list = stack.slice();
			stack.push(types.new_list(list));
		},
		"list_dup, list_duplicate"() {
			var list = stack.pop().data;
			list.push(list[list.length - 1]);
			stack.push(types.new_list(list));
		},
		list_swap() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			list.push(second);
			stack.push(types.new_list(list));
		},
		"list_rot, list_rotate"() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			var third = list.pop();
			list.push(first);
			list.push(third);
			list.push(second);
			stack.push(types.new_list(list));
		},
		"list_unrot, list_unrotate, list_reverse_rot, list_reverse_rotate, list_counter_rot, list_counter_rotate"() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			var third = list.pop();
			list.push(second);
			list.push(first);
			list.push(third);
			stack.push(types.new_list(list));
		},
		"list_roll, list_rot_n, list_rotate_n"() {
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
			
			stack.push(types.new_list(list));
		},
		"list_unroll, list_reverse_roll, list_counter_roll, list_reverse_rot_n, list_reverse_rotate_n, list_counter_rot_n, list_counter_rotate_n"() {
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
			
			stack.push(types.new_list(list));
		},
		list_nip() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			stack.push(types.new_list(list));
		},
		list_tuck() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(first);
			list.push(second);
			list.push(first);
			stack.push(types.new_list(list));
		},
		list_over() {
			var list = stack.pop().data;
			var first = list.pop();
			var second = list.pop();
			list.push(second);
			list.push(first);
			list.push(second);
			stack.push(types.new_list(list));
		},
		
		// Math functions.
		
		pi() {
			stack.push(types.new_num(Math.PI));
		},
		tau() {
			stack.push(types.new_num(Math.PI * 2));
		},
		e() {
			stack.push(types.new_num(Math.E));
		},
		"abs, absolute, positive"() {
			stack.push(types.new_num(Math.abs(stack.pop().data)));
		},
		"round, trunc, truncate"() {
			stack.push(types.new_num(Math.round(stack.pop().data)));
		},
		"ceil, ceiling, roof, round_up, round_upwards"() {
			stack.push(types.new_num(Math.ceil(stack.pop().data)));
		},
		"floor, round_down, round_downwards"() {
			stack.push(types.new_num(Math.floor(stack.pop().data)));
		},
		"max, maximum, biggest, longest, largest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.cmp(left, right, (x, y) => x > y) ? left : right);
		},
		"min, minimum, smallest, shortest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.cmp(left, right, (x, y) => x < y) ? left : right);
		},
		"sgn, sign"() {
			stack.push(types.new_num(Math.sign(stack.pop().data)));
		},
		"rand, random"() {
			var max = stack.pop().data;
			var min = stack.pop().data;
			stack.push(types.new_num((Math.random() * (max - min)) + min));
		},
		"cos, cosine"() {
			stack.push(types.new_num(Math.cos(stack.pop().data)));
		},
		"sin, sine"() {
			stack.push(types.new_num(Math.sin(stack.pop().data)));
		},
		"tan, tangent"() {
			stack.push(types.new_num(Math.tan(stack.pop().data)));
		},
		"sqrt, square_root"() {
			stack.push(types.new_num(Math.sqrt(stack.pop().data)));
		},
		"cbrt, cube_root"() {
			stack.push(types.new_num(Math.cbrt(stack.pop().data)));
		},
		"root, nth_root"() {
			var exp = stack.pop().data;
			var num = stack.pop().data;
			stack.push(types.new_num(num ** (1 / exp)));
		},
		"log, logarithm, log_n"() {
			var base = stack.pop().data;
			var num = stack.pop().data;
			stack.push(types.new_num(Math.log(num) / Math.log(base)));
		},
		"ln, log_e, natural_log, natural_logarithm"() {
			stack.push(types.new_num(Math.log(stack.pop().data)));
		},
		
		// Function functions.
		
		"call, run, do, apply, get, exe, execute"() {
			run_part.run_function(stack.pop(), stack, made_built_ins, operators, end_time);
		},
		"iter, iterate, iterative, loop, loop_n"() {
			var iter_cou = stack.pop().data;
			var iterator = stack.pop();
			
			for(let cou = 0; cou < iter_cou; cou++) {
				run_part.run_function(iterator, stack, made_built_ins, operators, end_time);
			}
		},
		"id, identity, nop, noop"() {},
		"comp, compose"(scopes) {
			var comp = {
				args: ["f", "g"], variables: [],
				data: [{
						args: [], variables: [],
						data: [types.new_sym("f"), types.new_sym("g")],
						type: types.func
					}
				],
				type: types.func,
				scopes: [{}]
			};
			
			run_part.run_function(comp, stack, made_built_ins, operators, end_time);
		},
		
		// State functions.
		
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
			
			if(
				left.type == types.num && right.type == types.num ||
				left.type == types.str && right.type == types.str
			) {
				stack.push({
					data: left.data + right.data,
					type: left.type
				});
			} else if(left.type == types.list && right.type != types.list) {
				stack.push(types.new_list([...left.data, right]));
			} else if(left.type != types.list && right.type == types.list) {
				stack.push(types.new_list([left, ...right.data]));
			} else if(left.type == types.list && right.type == types.list) {
				stack.push(types.new_list([...left.data, ...right.data]));
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
			} else if(
				(left.type == types.list || left.type == types.str) &&
				right.type == types.num
			) {
				var cut_list_like = right.data > 0
					? left.data.slice(0, -right.data)
					: right.data < 0
						? left.data.slice(-right.data)
						: left.data;
				stack.push({data: cut_list_like, type: left.type});
			}
		},
		"*"() {
			var right = stack.pop();
			var left = stack.pop();
			
			var list_repeat = (list, num) => Array(num).fill(list).flat();
			var cartesian_prod = (col, row) => col.reduce(
				(acc, i) => [...acc, ...row.map(j => [i, j])],
				[]
			);
			
			if(left.type == types.num && right.type == types.num) {
				stack.push(types.new_num(left.data * right.data));
			} else if(left.type == types.list && right.type == types.num) {
				stack.push(types.new_list(list_repeat(left.data, right.data)));
			} else if(left.type == types.num && right.type == types.list) {
				stack.push(types.new_list(list_repeat(right.data, left.data)));
			} else if(left.type == types.str && right.type == types.num) {
				stack.push(types.new_str(left.data.repeat(right.data)));
			} else if(left.type == types.num && right.type == types.str) {
				stack.push(types.new_str(right.data.repeat(left.data)));
			} else if(left.type == types.str && right.type == types.str) {
				var prod = cartesian_prod(left.data.split(""), right.data.split(""));
				stack.push(types.new_list(prod.map(pair => (types.new_str(pair.join(""))))));
			} else if(left.type == types.list && right.type == types.list) {
				var prod = cartesian_prod(left.data, right.data);
				stack.push(types.new_list(prod.map(pair => (types.new_list(pair)))));
			}
		},
		"/"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push(types.new_num(left.data / right.data));
			}
		},
		"^"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push(types.new_num(left.data ** right.data));
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
				list.push(types.new_num(cou));
			}
			
			if(left.type == types.str) {
				list = list.map(n => (types.new_str(String.fromCharCode(n.data))));
			}
			stack.push(types.new_list(gets_bigger ? list : list.reverse()));
		},
		"&"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push(types.new_bool(left.data && right.data));
			}
		},
		"|"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push(types.new_bool(left.data || right.data));
			}
		},
		"!"() {
			var bool = stack.pop();
			if(bool.type == types.num) {
				stack.push(types.new_bool(!bool.data));
			}
		},
		"="() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_bool(types.eq(left, right)));
		},
		"!="() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_bool(!types.eq(left, right)));
		},
		"<"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_bool(types.cmp(left, right, (x, y) => x < y)));
		},
		">"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_bool(types.cmp(left, right, (x, y) => x > y)));
		},
		"<="() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_bool(types.cmp(left, right, (x, y) => x <= y)));
		},
		">="() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_bool(types.cmp(left, right, (x, y) => x >= y)));
		},
		$() {
			throw "Tried to call $ as a function. Don't do that.";
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

module.exports = {built_ins, operators};
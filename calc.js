(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.calc = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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
},{"./lex":3,"./parse":4,"./print":5,"./run":7}],2:[function(require,module,exports){
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
	* "calc= "ble" "str" dup" -> "calc=ble str str"

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
	stack_reverse_n: aliases => `

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
	drop_n: aliases => `

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
	map: aliases => `

	MAP OVER LIST

Usage: "calc= list func map", where "list" is a list and "func" is any function.

Aliases: ${aliases}.

Examples:
	* "calc= 3 6 .. {1+} map" -> "calc=[4, 5, 6, 7]"
	* "calc= [true, false, true] $! map" -> "calc=[0, 1, 0]"

It applies the function to each element in the list. The function should take one argument and return one value, or else bugs might ensue.
`,
	fold: aliases => `

	FOLD LIST TO THE LEFT

Usage: "calc= list starting reducer fold", where "list" is a list, "starting" is the starting value for the folding, and "reducer" is the function for folding the list.

Aliases: ${aliases}.

Examples:
	* "calc= 1 5 .. 1 $* fold" -> "calc=120"
	* "calc= ["foo", "bar", "baz"] "" {", " + +} fold" -> "calc=foo, bar, baz, "

It applies the function to the last result of the function (the accumulator) to the next element of the list. The first accumulator is the "starting" argument.

Example explanation: "calc= 1 5 .. 1 $* fold".
	* [1, 2, 3, 4, 5] The list.
	* 1 The starting accumulator.
	* $* The reducer.

The argument on the left is the accumulator and the one on the right is the next element in the list.
1 * 1 -> 1
1 * 2 -> 2
2 * 3 -> 6
6 * 4 -> 24
24 * 5 -> 120

Then 120 is returned.
`,
	foldr: aliases => `

	FOLD LIST TO THE RIGHT

Usage: "calc= list starting reducer foldr", where "list" is a list, "starting" is the starting value for the folding, and "reducer" is the function for folding the list.

Aliases: ${aliases}.

Examples:
	* "calc= 1 5 .. 1 $* foldr" -> "calc=120"
	* "calc= ["foo", "bar", "baz"] "" {", " + +} foldr" -> "calc=baz, bar, foo, "

It applies the function to the last result of the function (the accumulator) to the next element of the list, starting from the end. The first accumulator is the "starting" argument.

Example explanation: "calc= 1 5 .. 1 $* foldr".
	* [1, 2, 3, 4, 5] The list.
	* 1 The starting accumulator.
	* $* The reducer.

The argument on the left is the accumulator and the one on the right is the next element in the list.
1 * 5 -> 5
5 * 4 -> 20
20 * 3 -> 60
60 * 2 -> 120
120 * 1 -> 120

Then 120 is returned.
`,
	filter: aliases => `

	FILTER LIST WITH PREDICATE

Usage: "calc= list pred filter", where "list" is a list and "pred" is any predicate (function that returns a boolean).

Aliases: ${aliases}.

Examples:
	* "calc= -5 5 .. {2 >} filter" -> "calc=[3, 4, 5]"
	* "calc= [-3 3 .., 1 2 .., -5 -3 .., [0, 3], [5, 1]] {0 elem !} filter" -> "calc=[[1, 2], [-5, -4, -3], [5, 1]]"
	* "calc= ["", "as", [], [1], 0, 1, {}, {+}, $0] {} filter" -> "calc=[as, [1], 1, { -> <function definition>}, { -> <function definition>}, 0]"

It calls the predicate on each element in the list, keeping only the elements that return truthy values.
`,
	length: aliases => `

	LENGTH OF

Usage: "calc= list_like length", where "list_like" is a list or a string (like a list of characters).

Aliases: ${aliases}.

Examples:
	* "calc= [0, 1, 2] length" -> "calc=3"
	* "calc= "dbfj" length" -> "calc=4"

It returns the length of the list_like.
`,
	head: aliases => `

	FIRST ITEM

Usage: "calc= list head", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] head" -> "calc=6"
	* "calc= 6 3 .. head" -> "calc=6"

It returns the first item of the list.
`,
	snd: aliases => `

	SECOND ITEM

Usage: "calc= list snd", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] snd" -> "calc=2"
	* "calc= 6 3 .. snd" -> "calc=5"

It returns the second item of the list.
`,
	last: aliases => `

	LAST ITEM

Usage: "calc= list last", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] last" -> "calc=7"
	* "calc= 6 3 .. last" -> "calc=3"

It returns the last item of the list.
`,
	back_snd: aliases => `

	BEFORE LAST ITEM

Usage: "calc= list back_snd", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] back_snd" -> "calc=2"
	* "calc= 6 3 .. back_snd" -> "calc=4"

It returns the before last item of the list.
`,
	nth: aliases => `

	N-TH ITEM

Usage: "calc= list idx nth", where "idx" is an index into the list and "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [866, 346, 987, 43] 2 nth" -> "calc=987"
	* "calc= 3 8 .. 3 nth" -> "calc=6"

It returns the n-th item of the list, where idx is that n. The list is 0 indexed, meaning the first item is at index 0.
`,
	back_nth: aliases => `

	N-TH ITEM FROM THE END

Usage: "calc= list idx back_nth", where "idx" is an index into the list and "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [866, 346, 987, 43] 2 back_nth" -> "calc=346"
	* "calc= 3 8 .. 3 back_nth" -> "calc=5"

It returns the n-th item from the back of the list, where idx is that n. The list is 0 indexed, meaning the last item is at index 0.
`,
	init: aliases => `

	ALL BUT FIRST ITEM

Usage: "calc= list init", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] init" -> "calc=[6, 2]"
	* "calc= 6 3 .. init" -> "calc=[6, 5, 4]"

It returns all but the first item of the list.
`,
	tail: aliases => `

	ALL BUT LAST ITEM

Usage: "calc= list tail", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] tail" -> "calc=[2, 7]"
	* "calc= 6 3 .. tail" -> "calc=[5, 4, 3]"

It returns all but the last item of the list.
`,
	body: aliases => `

	ALL BUT FIRST AND LAST ITEM

Usage: "calc= list body", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= [6, 2, 7] body" -> "calc=[2]"
	* "calc= 6 3 .. body" -> "calc=[5, 4]"

It returns all but the first and last item of the list.
`,
	reverse: aliases => `

	REVERSE LIST

Usage: "calc= list reverse", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= 4 9 .. reverse" -> "calc=[9, 8, 7, 6, 5, 4]"
	* "calc= [7, 34, $-, "as", [], {}] reverse" -> "calc=[{ -> <function definition>}, [], as, -, 34, 7]"

It reverses the list.
`,
	reverse_n: aliases => `

	REVERSE LAST N ITEMS OF LIST

Usage: "calc= list num reverse", where "list" is a list and "num" is an index into the list.

Aliases: ${aliases}.

Examples:
	* "calc= 1 6 .. 4 reverse_n" -> "calc=[1, 2, 6, 5, 4, 3]"
	* "calc= [7, 34, $-, "as", [], {}] 3 reverse_n" -> "calc=[7, 34, -, { -> <function definition>}, [], as]"

It reverses only the last num items of the list.
`,
	pop_n: aliases => `

	REMOVE LAST N ITEMS OF LIST

Usage: "calc= list num pop_n", where "list" is a list and "num" is an index into the list.

Aliases: ${aliases}.

Examples:
	* "calc= 1 6 .. 4 pop_n" -> "calc=[1, 2]"
	* "calc= [7, 34, $-, "as", [], {}] 3 pop_n" -> "calc=[7, 34, -]"

It removes the last num items of the list.
`,
	elem: aliases => `

	IS ITEM IN LIST

Usage: "calc= list item elem", where "list" is the list and "item" is the item to test for.

Aliases: ${aliases}.

Examples:
	* "calc= [7, {}, 4, 23, 'a, $+, 4, []] 4 elem" -> "calc=1"
	* "calc= [7, {}, 23, 'a, $+, []] 4 elem" -> "calc=0"
	* "calc= [-3 3 .., 1 2 .., -5 -3 .., [0, 3], [5, 1]] {0 elem !} filter" -> "calc=[[1, 2], [-5, -4, -3], [5, 1]]"

It returns true if the item is in the list, else it returns false.
`,
	expl: aliases => `

	EXPLODE LIST ITEMS

${built_in_warning}

Usage: "calc= list expl", where "list" is a list.

Aliases: ${aliases}.

Examples:
	* "calc= 1 3 .. expl" -> "calc=1 2 3"
	* "calc= [67, 2, 'a, 2] expl" -> "calc=67 2 a 2"

Every item of the list gets pushed to the top. The last item pushed will be the last item in the list.
`,
	group: aliases => `

	GROUP INTO LIST

${built_in_warning}

Usage: "calc= n ... m num group", where "num" is the amount of items you want to group and "n ... m" are the items.

Aliases: ${aliases}.

Examples:
	* "calc= 56 1 8 'f $+ 4 group" -> "calc=56 [1, 8, f, +]"
	* "calc= 4 6 .. expl 3 group" -> "calc=[4, 5, 6]"

It pops the top num items and puts them into a list, where the first item in the list was the last popped.
`,
	copy_group: aliases => `

	COPY AND GROUP INTO LIST

${built_in_warning}

Usage: "calc= n ... m num copy_group", where "num" is the amount of items you want to copy and group and "n ... m" are the items.

Aliases: ${aliases}.

Examples:
	* "calc= 56 1 8 'f $+ 4 copy_group" -> "calc=56 1 8 f + [1, 8, f, +]"
	* "calc= 4 6 .. expl 3 copy_group" -> "calc=4 5 6 [4, 5, 6]"

It peeks at the top num items and puts them into a list, where the first item in the list was the last peeked at.
`,
	group_all: aliases => `

	GROUP ALL ITEMS INTO LIST

${built_in_warning}

Usage: "calc= n ... m group_all", where "n ... m" is the entire stack.

Aliases: ${aliases}.

Examples:
	* "calc= 67 235 7 246 9 group_all" -> "calc=[67, 235, 7, 246, 9]"
	* "calc= $+ 987 'q 87 37 008 group_all" -> "calc=[+, 987, q, 87, 37, 8]"

It groups all the items, removing them after, into a list. The items near the top of the stack are near the end of the list.
`,
	copy_group_all: aliases => `

	COPY AND GROUP ALL ITEMS INTO LIST

${built_in_warning}

Usage: "calc= n ... m copy_group_all", where "n ... m" is the entire stack.

Aliases: ${aliases}.

Examples:
	* "calc= 67 235 7 246 9 copy_group_all" -> "calc=67 235 7 246 9 [67, 235, 7, 246, 9]"
	* "calc= $+ 987 'q 87 37 008 copy_group_all" -> "+ 987 q 87 37 8 calc=[+, 987, q, 87, 37, 8]"

It groups all the items, without removing them, into a list. The items near the top f the stack are near the end of the list.
`,
	list_dup: aliases => `

	DUPLICATE TOP OF LIST

Usage: "calc= list dup", where "list" is a list with at least 1 item.

Aliases: ${aliases}.

Examples:
	* "calc= [5] list_dup" -> "calc=[5, 5]"
	* "calc= ["ble", "str"] list_dup" -> "calc=[ble, str, str]"

It duplicates the top value of the list.
`,
	list_swap: aliases => `

	SWAP TOP OF LIST

Usage: "calc= list swap", where "list" is a list with at least 2 items.

Aliases: ${aliases}.

Examples:
	* "calc= [2, 5] list_swap" -> "calc=[5, 2]"
	* "calc= ["gh", [1, 2, 3]] list_swap" -> "calc=[[1, 2, 3], gh]"

It swaps the top 2 values of the list.
`,
	list_rot: aliases => `

	ROTATE TOP OF list

Usage: "calc= list list_rot", where "list" is a list with at least 3 items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b, 'c] list_rot" -> "calc=[c, a, b]"
	* "calc= ["as", [], 1] list_rot" -> "calc=[1, as, []]"

It rotates the top three items of the list to the right. To do this with more items you would use list_roll, but it is not recommended.
`,
	list_unrot: aliases => `

	ROTATE TOP OF LIST BACKWARD

Usage: "calc= list list_unrot", where "list" is a list with at least 3 items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b, 'c] list_unrot" -> "calc=[b, c, a]"
	* "calc= ["as", [], 1] list_unrot" -> "calc=[[], 1, as]"

It rotates the top three items of the list to the left. To do this with more items you would use list_unroll, but it is not recommended.
`,
	list_roll: aliases => `

	ROLL TOP OF LIST

${built_in_warning}

Usage: "calc= [n ... m] num roll", where "num" is the amount of items you want to roll and "[n ... m]" is a list with at least "num" items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b, 'c, 'd, 'e, 'f] 4 list_roll" -> "calc=[a, b, f, c, d, e]"
	* "calc= 1 5 .. {n -> 1 n .. n list_roll} map" -> "calc=[[1], [2, 1], [3, 1, 2], [4, 1, 2, 3], [5, 1, 2, 3, 4]]"

It rotates the top num items of the list to the left. If you want to roll 2 or 3 three items, please check out list_swap and list_rot.
`,
	list_unroll: aliases => `

	ROLL TOP OF LIST BACKWARD

${built_in_warning}

Usage: "calc= [n ... m] num unroll", where "num" is the amount of items you want to roll backward and "[n ... m]" is a list with at least "num" items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b, 'c, 'd, 'e, 'f] 4 list_unroll" -> "calc=[a, b, d, e, f, c]"
	* "calc= 1 5 .. {n -> 1 n .. n list_unroll} map" -> "calc=[[1], [2, 1], [2, 3, 1], [2, 3, 4, 1], [2, 3, 4, 5, 1]]"

It rotates the top num items of the list to the right. If you want to roll backward 2 or 3 three items, please check out list_swap and list_unrot.
`,
	list_nip: aliases => `

	NIP UNDER LIST

Usage: "calc= list list_nip", where "list" is a list with at least 2 items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b, 'c] list_nip" -> "calc=[a, c]"
	* "calc= [6, 1, 78, 2] list_nip" -> "calc=[6, 1, 2]"

It removes the item under the top one of the list. Equivalent to "list_swap list_drop".
`,
	list_tuck: aliases => `

	TUCK UNDER LIST

Usage: "calc= list list_tuck", where "list" is a list with at least 2 items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b, 'c] list_tuck" -> "calc=[a, c, b, c]"
	* "calc= [1, [2]] list_tuck" -> "calc=[[2], 1, [2]]"

It puts the top item of the list underneath the next. Equivalent to "list_dup list_rot" or "list_swap list_over".
`,
	list_over: aliases => `

	DUPLICATE OVER ON LIST

Usage: "calc= list list_over", where "list" is a list with at least 2 items.

Aliases: ${aliases}.

Examples:
	* "calc= ['a, 'b] list_over" -> "calc=[a, b, a]"
	* "calc= [4, 98, 2] list_over" -> "calc=[4, 98, 2, 98]"

It puts a duplicate of the second item from the top of the list on top of the list. Equivalent to "list_swap list_dup list_rot" or "list_swap list_tuck".
`,
	pi: aliases => `

	THE CONSTANT PI

Usage: "calc= pi".

Aliases: ${aliases}.

Examples:
	* "calc= pi 2 *" -> "calc=6.28318"
	* "calc= circle_area = {dup * pi *} ; 1 5 .. $circle_area map" -> "calc=[3.14159, 12.56637, 28.27433, 50.26548, 78.53981]"

It returns the mathematical constant pi. Same as "tau 2 /".
`,
	tau: aliases => `

	THE CONSTANT TAU

Usage: "calc= tau".

Aliases: ${aliases}.

Examples:
	* "calc= tau 2 /" -> "calc=3.14159"
	* "calc= circumference = {tau *} ; 1 5 .. $circumference map" -> "calc=[6.28318, 12.56637, 18.84955, 25.13274, 31.41592]"

It returns the mathematical constant tau. Same as "pi 2 *".
`,
	e: aliases => `

	THE CONSTANT E

Usage: "calc= e".

Aliases: ${aliases}.

Examples:
	* "calc= e ln" -> "calc=1"
	* "calc= e 3 ^ ln" -> "calc=3"

It returns the mathematical constant e, the base of the natural logarithm.
`,
	abs: aliases => `

	ABSOLUTE VALUE

Usage: "calc= num abs" where "num" is a number.

Aliases: ${aliases}.

Examples:
	* "calc= -5 abs 0 abs 2 abs" -> "calc= 5 0 2"
	* "calc= -5 5 .. $abs map" -> "calc= [5, 4, 3, 2, 1, 0, 1, 2, 3, 4, 5]"

It returns the absolute value of num. For any number more than or equal to 0, it returns that number, else that number negated.
`,
	round: aliases => `

	ROUND TO THE NEAREST INTEGER

Usage: "calc= num round" where "num" is a number.

Aliases: ${aliases}.

Examples:
	* "calc= -0.5 round" -> "calc=0"
	* "calc= 0.5 round" -> "calc=1"
	* "calc= 5 round" -> "calc=5"
	* "calc= 7.25 round" -> "calc=7"
	* "calc= 9.75 round" -> "calc=10"

It returns num, rounded to the nearest integer. If the fractional part if .5, the number is rounded upwards.
`,
	ceil: aliases => `

	ROUND UPWARDS

Usage: "calc= num ceil" where "num" is a number.

Aliases: ${aliases}.

Examples:
	* "calc= 4.5 ceil" -> "calc= 5"
	* "calc= 4.2 ceil" -> "calc= 5"
	* "calc= 6 ceil" -> "calc=6"
	* "calc= -2.5 ceil" -> "calc= -2"

It returns num rounded to the nearest integer greater or equal to it.
`,
	floor: aliases => `

	ROUND DOWNWARDS

Usage: "calc= num floor" where "num" is a number.

Aliases: ${aliases}.

Examples:
	* "calc= 4.5 floor" -> "calc= 4"
	* "calc= 4.7 floor" -> "calc= 4"
	* "calc= 6 floor" -> "calc=6"
	* "calc= -2.5 floor" -> "calc= -3"

It returns num rounded to the nearest integer less than or equal to it.
`,
/*
/*
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
	ln
	call
	iter
	id
	dot
	set
	inc
	dec*/
};

var built_in_warning = "!WARNING: This function is discouraged from being used, the only reason it is here is for the few cases in which it is necessary!";
},{}],3:[function(require,module,exports){
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
			return types.new_str(str);
		},
		
		char() {
			pointer += 2;
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
		} else if(/\[|,|\]|{|}|\$|;|\+|\*|\/|\^|\.|=|<|>|&|\||!/.test(code[pointer])) {
			tokens.push(expect.op());
		} else {
			pointer++;
		}
	}
	
	return tokens;
}

module.exports = lex;
},{"./types":9}],4:[function(require,module,exports){
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
					code.push(tokens[token_pointer]);
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
		
		return [...code, types.new_list(length)];
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
},{"./types":9}],5:[function(require,module,exports){
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
},{"./types":9}],6:[function(require,module,exports){
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
				stack.push(types.new_list(list.reverse()));
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
},{"./types":9,"./variable manipulation":10}],7:[function(require,module,exports){
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
},{"./run part":6,"./standard library":8}],8:[function(require,module,exports){
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
				stack.push(types.new_str("Help page usage not done yet."));
			} else {
				var page = stack.pop();
				if(page.type == types.sym) {
					var found = made_built_ins[page.data];
					if(found) {
						stack.push(types.new_str(help_pages[found.main_alias](found.aliases.join(", "))));
					} else {
						stack.push(types.new_str(`Error: "${page.data}" is not a built-in.`));
					}
				} else if(page.type == types.op) {
					
				} else {
					stack.push(types.new_str(`Error: cannot get help page for value "${print(page)}" of type ${types.type_to_str(page.type)}.`));
				}
			}
		},
		"tut, tutorial"() {
			if(stack.length == 0) {
				stack.push(types.new_str(tut_pages[0]));
			} else {
				var page = stack.pop().data;
				if(page < tut_pages.length) {
					stack.push(types.new_str(tut_pages[page]));
				} else {
					stack.push(types.new_str(`Error: tutorial page ${page} does not exist.`));
				}
			}
		},
		"adv_tut, adv_tutorial, advanced_tutorial, advanced_tut"() {
			if(stack.length == 0) {
				stack.push(types.new_str(adv_tut_pages[0]));
			} else {
				var page = stack.pop().data;
				if(page < adv_tut_pages.length) {
					stack.push(types.new_str(adv_tut_pages[page]));
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
			
			stack.push(types.new_bool(list.reduce((acc, cur) => acc || types.eq(item, cur), false)));
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
		"ceil, ceiling, roof"() {
			stack.push(types.new_num(Math.ceil(stack.pop().data)));
		},
		floor() {
			stack.push(types.new_num(Math.floor(stack.pop().data)));
		},
		"max, maximum, biggest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_num(Math.max(left, right)));
		},
		"main, minimum, smallest"() {
			var right = stack.pop();
			var left = stack.pop();
			stack.push(types.new_num(Math.min(left, right)));
		},
		"sgn, sign"() {
			stack.push(types.new_num(Math.sign(stack.pop().data)));
		},
		"rand, random"() {
			var min = stack.pop().data;
			var max = stack.pop().data;
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
		root() {
			var num = stack.pop().data;
			var exp = stack.pop().data;
			stack.push(types.new_num(num ** (1 / exp)));
		},
		"log, logarithm"() {
			var num = stack.pop().data;
			var base = stack.pop().data;
			stack.push(types.new_num(Math.log(num) / Math.log(base)));
		},
		"ln, log_e, natural_log, natural_logarithm"() {
			stack.push(types.new_num(Math.log(stack.pop().data)));
		},
		
		// Function functions.
		
		"call, run, do, apply, get"() {
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
		"dot, comp, compose"(scopes) {
			var second = stack.pop();
			var first = stack.pop();
			var run = types.new_sym("run");
			
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
			} else if(left.type == types.str && right.type == types.num) {
				var cut_string = right.data > 0
					? left.data.slice(0, -right.data)
					: right.data < 0
						? left.data.slice(-right.data)
						: left.data;
				stack.push(types.new_str(cut_string));
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
				stack.push(types.new_num(left.data * right.data));
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
				stack.push(types.new_num(left.data && right.data));
			}
		},
		"|"() {
			var right = stack.pop();
			var left = stack.pop();
			
			if(left.type == types.num && right.type == types.num) {
				stack.push(types.new_num(left.data || right.data));
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
},{"./help pages":2,"./print":5,"./run part":6,"./types":9,"./variable manipulation":10}],9:[function(require,module,exports){
var types = {
	num: 0, str: 1, list: 2,
	func: 3, sym: 4, op: 5
};

var new_value = {
	new_num: num => ({data: num, type: types.num}),
	new_bool: bool => ({data: bool | 0, type: types.num}),
	new_str: str => ({data: str, type: types.str}),
	new_list: list => ({data: list, type: types.list}),
	new_sym: sym => ({data: sym, type: types.sym}),
	new_op: op => ({data: op, type: types.op})
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

function to_bool(val) {
	if(val.is_ref) {
		return true;
	}
	switch(val.type) {
		case types.num:
		case types.str:
			return Boolean(val.data);
			break;
		case types.func:
		case types.sym:
		case types.op:
			return true;
			break;
		case types.list:
			return Boolean(val.data.length);
			break;
	}
	return false;
}

function eq(left, right) {
	if(
		left.type == types.num && right.type == types.num ||
		left.type == types.str && right.type == types.str
	) {
		return left.data == right.data;
	} else if(left.type == types.list && right.type == types.list) {
		return Object.compare(left.data, right.data);
	} else {
		return false;
	}
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

function cmp(left, right, comparator) {
	if(left.type == types.num && right.type == types.num) {
		return comparator(left.data, right.data);
	} else if(
		left.type == types.str && right.type == types.str ||
		left.type == types.list && right.type == types.list
	) {
		return comparator(left.data.length, right.data.length);
	}
	return false;
}

module.exports = {...types, ...new_value, type_to_str, to_bool, eq, cmp};
},{}],10:[function(require,module,exports){
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
},{}]},{},[1])(1)
});

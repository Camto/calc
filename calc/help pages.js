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
/*
	filter
/*
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
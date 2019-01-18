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
	max: aliases => `

	BIGGEST OR LONGEST

Usage: "calc= x y max" where "x" and "y" are numbers, lists, or strings (they must be the same type).

Aliases: ${aliases}.

Examples:
	* "calc= 3 4 max" -> "calc=4"
	* "calc= 6 -2 max" -> "calc=6"
	* "calc= [1, 2, 3] [1] max" -> "calc=[1, 2, 3]"
	* "calc= 'a "nice" max" -> "calc=nice"

It returns the biggest or longest of two items.
`,
	min: aliases => `

	SMALLEST OR SHORTEST

Usage: "calc= x y min" where "x" and "y" are numbers, lists, or strings (they must be the same type).

Aliases: ${aliases}.

Examples:
	* "calc= 3 4 min" -> "calc=3"
	* "calc= 6 -2 min" -> "calc=-2"
	* "calc= [1, 2, 3] [1] min" -> "calc=[1]"
	* "calc= 'a "nice" min" -> "calc=a"

It returns the smallest or shortest of two items.
`,
	sgn: aliases => `

	SIGN OF NUMBER

Usage: "calc= num sgn" where "num" is a number.

Aliases: ${aliases}.

Examples:
	* "calc= 42 sgn" -> "calc=1"
	* "calc= 0 sgn" -> "calc=0"
	* "calc= -30 sgn" -> "calc=-1"
	* "calc= -3 3 .. $sgn map" -> "calc=[-1, -1, -1, 0, 1, 1, 1]"

It returns the sign of num, 1 for positive, -1 for negative, and 0 for none.
`,
	rand: aliases => `

	GENERATE RANDOM NUMBER

Usage: "calc= x y rand", where "x" and "y" are the boundaries of the random number.

Aliases: ${aliases}.

Examples:
	* "calc= 3 4 rand" -> "calc=3.45051"
	* "calc= 0 9 .. {drop 1 10 rand} map" -> "calc=[4.44581, 9.54312, 9.75568, 4.35409, 9.83876, 5.42639, 9.90467, 6.86817, 9.90735, 5.01449]"

It returns are psuedo-random number between x and y (they don't have a specific order).
`,
	cos: aliases => `

	COSINE OF ANGLE IN RADIANS

Usage: "calc= angle cos". where "angle" is an angle in radians.

Aliases: ${aliases}.

Examples:
	* "calc= 3 2 / pi * cos" -> "calc=0"
	* "calc= 4 pi * cos" -> "calc=1"

It returns the cosine of the given angle, which is in radians.
`,
	sin: aliases => `

	SINE OF ANGLE IN RADIANS

Usage: "calc= angle sin". where "angle" is an angle in radians.

Aliases: ${aliases}.

Examples:
	* "calc= 3 2 / pi * sin" -> "calc=-1"
	* "calc= 4 pi * sin" -> "calc=0"

It returns the sine of the given angle, which is in radians.
`,
	tan: aliases => `

	TANGENT OF ANGLE IN RADIANS

Usage: "calc= angle tan". where "angle" is an angle in radians.

Aliases: ${aliases}.

Examples:
	* "calc= 1 4 / pi * tan" -> "calc=0.99999"
	* "calc= 3 pi * tan" -> "calc=0"

It returns the tangent of the given angle, which is in radians.
`,
	sqrt: aliases => `

	SQUARE ROOT

Usage: "calc= num sqrt", where "num" is any number.

Aliases: ${aliases}.

Examples:
	* "calc= 2 sqrt" -> "calc=1.41421"
	* "calc= 9 sqrt" -> "calc=3"

It returns the square root of num.
`,
	cbrt: aliases => `

	CUBE ROOT

Usage: "calc= num cbrt", where "num" is any number.

Aliases: ${aliases}.

Examples:
	* "calc= 3 cbrt" -> "calc=1.44224"
	* "calc= 64 cbrt" -> "calc=4"

It returns the cube root of num.
`,
	root: aliases => `

	NTH ROOT

Usage: "calc= num exp root", where "num" is any number and "exp" is an exponent.

Aliases: ${aliases}.

Examples:
	"calc= 16 4 root" -> "calc=2"
	"calc= 6 4 root" -> "calc=1.56508"

It returns the exp-th root of num.
`,
	log: aliases => `

Usage: "calc= num base log", where "num" is any number and "base" is a base.

Aliases: ${aliases}.

Examples:
	* "calc= 1024 2 log" -> "calc=10"
	* "calc= 27 3 log" -> "calc=3"

It returns the logarithm of num to base.
`,
	ln: aliases => `

	NATURAL LOGARITHM

Usage: "calc= num ln" where "num" is any number.

Aliases: ${aliases}.

Examples:
	* "calc= 3 ln" -> "calc=1.09861"
	* "calc= e ln" -> "calc=1"

It returns the logarithm of num to base e.
`,
/*
	call
	iter
	id
	dot
	set
	inc
	dec*/
};

var built_in_warning = "!WARNING: This function is discouraged from being used, the only reason it is here is for the few cases in which it is necessary!";
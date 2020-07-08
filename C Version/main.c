#include <stdio.h>

#include "len str.h"

/*
#include "types.h"
#include "print.h"
#include "builtins.h"
#include "aliases.h"
*/

#include "lex.h"

int lt(double n, double m) {return n < m;}

int main(int argc, char** argv) {
	/*
	Calc_Stack stack = calc_new_stack(CALC_START_CAP);

	const Calc_Len_Str* type_main = get_main_alias("typeof", 6)->main_alias;

	Calc_Builtin type = get_builtin("type", 4)->builtin;
	Calc_Builtin dup = get_builtin("dup", 3)->builtin;
	Calc_Builtin drop = get_builtin("drop", 4)->builtin;

	calc_push(&stack, calc_new_num(99.99999999));
	type(&stack, NULL, NULL, 0);
	calc_push(&stack, calc_new_str(calc_to_len_str("bruh")));
	type(&stack, NULL, NULL, 0);

	dup(&stack, NULL, NULL, 0);
	calc_debug_stack(&stack);
	drop(&stack, NULL, NULL, 0);
	calc_debug_stack(&stack);
	drop(&stack, NULL, NULL, 0);
	calc_debug_stack(&stack);
	dup(&stack, NULL, NULL, 0);
	calc_debug_stack(&stack);
	dup(&stack, NULL, NULL, 0);
	calc_debug_stack(&stack);

	calc_free_stack(&stack);
	*/
	
	if(argc > 1) {
		Calc_Len_Str* prog = calc_to_len_str(argv[1]);
		Calc_Tokens tokens = calc_lex(prog);
		calc_free_tokens(tokens);
		free(prog);
	} else printf("Please provide code to lex :)");
}

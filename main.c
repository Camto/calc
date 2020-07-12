#include <stdio.h>
#include <stdlib.h>

#include "len str.h"
#include "lex.h"
#include "error.h"

/*
#include "types.h"
#include "print.h"
#include "builtins.h"
#include "aliases.h"
*/

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
	
	if(argc > 2) {
		Calc_Len_Str* prog;
		Calc_Error_Header_Info info;
		Calc_Len_Str* err_buf;
		Calc_Len_Str* err;
		char* printable;
		
		prog = calc_to_len_str(argv[1]);
		
		info = calc_error_header_info(prog, atoi(argv[2]));
		err_buf = calc_len_str_prealloc(
			(info.start_cut - info.end_cut) * 2 + 1 + 5
		);
		calc_len_str_append(err_buf, calc_to_len_str("bruh\n"));
		calc_error_append_header(
			err_buf,
			prog, atoi(argv[2]),
			info.start_cut, info.end_cut
		);
		
		printable = calc_from_len_str(err);
		printf("Error:\n```\n%s| end here\n```", printable);
		
		free(err);
		free(printable);
		free(prog);
	} else printf("Please provide code to lex :)");
}

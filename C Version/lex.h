#ifndef CALC_LEX
#define CALC_LEX

#include <stdlib.h>

#include "len str.h"

typedef enum {
	calc_num_token, calc_str_token, calc_op_token, calc_sym_token
} Calc_Token_Type;

typedef enum {
	/* Normal operators. */
	calc_add, calc_sub, calc_mul, calc_div, calc_pow, calc_mod,
	calc_to,
	calc_and, calc_or, calc_not,
	calc_eq_, calc_neq, calc_lt, calc_gt, calc_lte, calc_gte,
	/* Context operators (only for parsing). */
	calc_refof,
	calc_list_start, calc_list_end, calc_list_sep,
	calc_func_start, calc_func_end, calc_func_arrow,
	calc_var_decl, calc_var_sep
} Calc_Op;

typedef struct {
	Calc_Token_Type type;
	union {
		Calc_Len_Str* sym;
		double num;
		Calc_Len_Str* str;
		Calc_Op op;
	} data;
} Calc_Token;

typedef struct {
	size_t len;
	size_t cap;
	Calc_Token* tokens;
} Calc_Tokens;

Calc_Tokens calc_lex(const Calc_Len_Str* prog);

void calc_expect_num(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
);
int calc_expect_str(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
);
int calc_expect_op(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
);
void calc_expect_sym(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
);

void calc_free_tokens(Calc_Tokens tokens);

void calc_append_token(Calc_Tokens* tokens, Calc_Token token);

bool calc_is_op_normal(Calc_Op op);
const Calc_Len_Str* calc_op_to_str(Calc_Op op);

#endif

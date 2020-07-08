#include "parse.h"

#include <stdlib.h>

#include <stdio.h> /* Hide this behind a debug macro later. */

#include "len str.h"
#include "lex.h"

Calc_Ast calc_parse(const Calc_Tokens tokens) {}

Calc_Ast calc_parse_prog(const Calc_Tokens* tokens size_t* pos) {}

Calc_Ast_Var calc_parse_var(const Calc_Tokens* tokens size_t* pos) {}

Calc_Ast_Expr calc_parse_expr(const Calc_Tokens* tokens size_t* pos) {}

Calc_Ast_Instr calc_parse_instr(const Calc_Tokens* tokens size_t* pos) {
	if(*pos >= tokens->len) return 0;
	Calc_Token curr = tokens->tokens[*pos];
	if(curr.type == calc_num_token)
	if token num -> return Num
	if token str -> return Str
	if token sym -> return Sym
	if token normal op -> return Sym{op}
}

Calc_Ast_Func calc_parse_func(const Calc_Tokens* tokens size_t* pos) {}

Calc_Ast_List calc_parse_list(const Calc_Tokens* tokens size_t* pos) {}

Calc_Ast_Instr calc_parse_refof(const Calc_Tokens* tokens size_t* pos) {}

void calc_free_ast(Calc_Ast ast) {}

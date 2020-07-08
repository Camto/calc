#ifndef CALC_PARSE
#define CALC_PARSE

#include <stdlib.h>

#include "lex.h"

typedef struct Calc_Ast_Func Calc_Ast_Func;
typedef Calc_Ast_Func Calc_Ast;
typedef struct Calc_Ast_Var Calc_Ast_Var;
typedef struct Calc_Ast_Expr Calc_Ast_Expr;
typedef struct Calc_Ast_Instr Calc_Ast_Instr;
typedef struct Calc_Ast_List Calc_Ast_List;
typedef struct Calc_Ast_Refof Calc_Ast_Refof;

/* The whole program is a func. */
struct Calc_Ast_Func {
	size_t vars_len;
	Calc_Ast_Var* vars;
	Calc_Ast_Expr* body;
};

struct Calc_Ast_Var {
	Calc_Len_Str* name;
	Calc_Ast_Expr* def;
};

struct Calc_Ast_Expr {
	size_t len;
	Calc_Ast_Instr** instrs;
};

struct Calc_Ast_Instr {
	Calc_Ast_Instr_Type type;
	union {
		double num;
		Calc_Len_Str* str;
		/* At this point normal operators are turned into symbols. */
		Calc_Len_Str* sym;
		Calc_Ast_Func* func;
		Calc_Ast_List* list;
		Calc_Ast_Instr* refof;
	} data;
};

struct Calc_Ast_List {
	size_t len;
	Calc_Ast_Expr** items;
};

Calc_Ast calc_parse(const Calc_Tokens tokens);

Calc_Ast calc_parse_prog(const Calc_Tokens* tokens size_t* pos);
Calc_Ast_Var calc_parse_var(const Calc_Tokens* tokens size_t* pos);
Calc_Ast_Expr calc_parse_expr(const Calc_Tokens* tokens size_t* pos);
Calc_Ast_Instr calc_parse_instr(const Calc_Tokens* tokens size_t* pos);
Calc_Ast_Func calc_parse_func(const Calc_Tokens* tokens size_t* pos);
Calc_Ast_List calc_parse_list(const Calc_Tokens* tokens size_t* pos);
Calc_Ast_Instr calc_parse_refof(const Calc_Tokens* tokens size_t* pos);

void calc_free_ast(Calc_Ast ast);

#endif

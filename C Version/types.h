#ifndef CALC_TYPES
#define CALC_TYPES

#include <stdlib.h>
#include <stdbool.h>
#include <time.h>

#include "khash.h"

#include "len str.h"

typedef enum {
	calc_num, calc_str, calc_list,
	calc_func, calc_ref, calc_op
} Calc_Type;

#include "lex.h" /* Remove later. */

typedef struct Calc_Val_List Calc_Val_List;
typedef Calc_Val_List Calc_Block;
typedef struct Calc_Func Calc_Func;
typedef struct Calc_Ref Calc_Ref;

typedef struct {
	Calc_Type type;
	union {
		double num;
		Calc_Len_Str* str;
		Calc_Val_List* list;
		Calc_Func* func;
		Calc_Ref* ref;
		Calc_Op op;
	} data;
	unsigned int refs;
} Calc_Val;

#define CALC_START_CAP 128

typedef struct {
	size_t len;
	size_t cap;
	Calc_Val** vals;
} Calc_Stack;

KHASH_MAP_INIT_STR(Calc_Val_Hash, Calc_Val)
typedef khash_t(Calc_Val_Hash) Calc_Scope;

typedef struct {
	size_t len;
	Calc_Scope** scopes;
} Calc_Scopes;

struct Calc_Val_List {
	size_t len;
	Calc_Val* vals[1];
};

struct Calc_Func {
	struct {
		size_t len;
		Calc_Len_Str** args;
	} args;
	struct {
		size_t len;
		Calc_Scope** vars;
	} vars;
	Calc_Scopes scopes;
	Calc_Block* body;
};

struct Calc_Ref {
	Calc_Len_Str* sym;
	Calc_Scopes scopes;
};

typedef void (*Calc_Builtin)(Calc_Stack*, Calc_Scopes*, void*, time_t);

#include "stdlib.h"

Calc_Val* calc_new_num(double num);
Calc_Val* calc_new_bool(bool bool_);
Calc_Val* calc_new_str(Calc_Len_Str* str);
Calc_Val* calc_new_ref(Calc_Len_Str* ref, Calc_Scopes scopes);
Calc_Val* calc_new_op(Calc_Op op);

bool calc_is_num(Calc_Val* val);
bool calc_is_str(Calc_Val* val);
bool calc_is_list(Calc_Val* val);
bool calc_is_func(Calc_Val* val);
bool calc_is_ref(Calc_Val* val);
bool calc_is_op(Calc_Val* val);
bool calc_is_list_like(Calc_Val* val);

const Calc_Len_Str* calc_type_to_str(Calc_Type type);

bool calc_val_to_bool(Calc_Val* val);

bool calc_dbl_eq(double n, double m);
bool calc_eq(Calc_Val* v, Calc_Val* u);
bool calc_cmp(Calc_Val* v, Calc_Val* u, bool comp(double, double));

void calc_gain_ref(Calc_Val* val);
void calc_lose_ref(Calc_Val* val);

Calc_Stack calc_new_stack(size_t start_cap);
void calc_free_stack(Calc_Stack* stack);

void calc_push(Calc_Stack* stack, Calc_Val* val);
Calc_Val* calc_pop(Calc_Stack* stack);
Calc_Val* calc_peek(Calc_Stack* stack);

#endif

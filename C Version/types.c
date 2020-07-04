#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <math.h>
#include <float.h>

#include "len str.h"
#include "types.h"

Calc_Val* calc_new_num(double num) {
	Calc_Val* val = malloc(sizeof(Calc_Val));
	val->type = calc_num;
	val->data.num = num;
	val->refs = 1;
	return val;
}

Calc_Val* calc_new_bool(bool bool_) {
	Calc_Val* val = malloc(sizeof(Calc_Val));
	val->type = calc_num;
	val->data.num = bool_ ? 1.0 : 0.0;
	val->refs = 1;
	return val;
}

Calc_Val* calc_new_str(Calc_Len_Str* str) {
	Calc_Val* val = malloc(sizeof(Calc_Val));
	val->type = calc_str;
	val->data.str = str;
	val->refs = 1;
	return val;
}

Calc_Val* calc_new_ref(Calc_Len_Str* sym, Calc_Scopes scopes) {
	Calc_Val* val = malloc(sizeof(Calc_Val));
	val->type = calc_ref;
	val->data.ref = malloc(sizeof(Calc_Ref));
	*(val->data.ref) = (Calc_Ref) {
		.sym = sym,
		.scopes = scopes
	};
	val->refs = 1;
	return val;
}

Calc_Val* calc_new_op(Calc_Op op) {
	Calc_Val* val = malloc(sizeof(Calc_Val));
	val->type = calc_op;
	val->data.op = op;
	val->refs = 1;
	return val;
}

bool calc_is_num(Calc_Val* val) {
	return val->type == calc_num;
}

bool calc_is_str(Calc_Val* val) {
	return val->type == calc_str;
}

bool calc_is_list(Calc_Val* val) {
	return val->type == calc_list;
}

bool calc_is_func(Calc_Val* val) {
	return val->type == calc_func;
}

bool calc_is_ref(Calc_Val* val) {
	return val->type == calc_ref;
}

bool calc_is_op(Calc_Val* val) {
	return val->type == calc_op;
}

bool calc_is_list_like(Calc_Val* val) {
	return calc_is_str(val) || calc_is_list(val);
}

static const Calc_Len_Str calc_num_str = {6, 'n', 'u', 'm', 'b', 'e', 'r'};
static const Calc_Len_Str calc_str_str = {6, 's', 't', 'r', 'i', 'n', 'g'};
static const Calc_Len_Str calc_list_str = {4, 'l', 'i', 's', 't'};
static const Calc_Len_Str calc_func_str = {8, 'f', 'u', 'n', 'c', 't', 'i', 'o', 'n'};
static const Calc_Len_Str calc_ref_str = {9, 'r', 'e', 'f', 'e', 'r', 'e', 'n', 'c', 'e'};
static const Calc_Len_Str calc_op_str = {8, 'o', 'p', 'e', 'r', 'a', 't', 'o', 'r'};

const Calc_Len_Str* calc_type_to_str(Calc_Type type) {
	switch(type) {
		case calc_num: return &calc_num_str;
		case calc_str: return &calc_str_str;
		case calc_list: return &calc_list_str;
		case calc_func: return &calc_func_str;
		case calc_ref: return &calc_ref_str;
		case calc_op: return &calc_op_str;
	}
}

bool calc_val_to_bool(Calc_Val* val) {
	switch(val->type) {
		case calc_num: return !calc_dbl_eq(val->data.num, 0.0);
		case calc_str: return val->data.str->len != 0;
		case calc_list: return val->data.list->len != 0;
		case calc_func:
		case calc_ref:
		case calc_op:
			return true;
	}
}

bool calc_dbl_eq(double n, double m) {
	return fabs(n - m) < 0.000005 - DBL_EPSILON;
}

bool calc_eq(Calc_Val* v, Calc_Val* u) {
	if(calc_is_num(v) && calc_is_num(u)) {
		return calc_dbl_eq(v->data.num, u->data.num);
	} else if(calc_is_str(v) && calc_is_str(u)) {
		Calc_Len_Str* v_data = v->data.str;
		Calc_Len_Str* u_data = u->data.str;
		if(v_data->len == u_data->len) {
			return memcmp(v_data->chars, u_data->chars, v_data->len) == 0;
		} else return false;
	} else if(calc_is_list(v) && calc_is_list(u)) {
		Calc_Val_List* v_data = v->data.list;
		Calc_Val_List* u_data = u->data.list;
		if(v_data->len == u_data->len) {
			size_t i;
			for(i = 0; i < v_data->len; i++) {
				if(!calc_eq(v_data->vals[i], u_data->vals[i]))
					return false;
			}
			return true;
		} else return false;
	} else return false;
}

bool calc_cmp(Calc_Val* v, Calc_Val* u, bool comp(double, double)) {
	if(
		calc_is_func(v) || calc_is_ref(v) || calc_is_op(v) ||
		calc_is_func(u) || calc_is_ref(u) || calc_is_op(u))
		return false;
	
	double v_num;
	double u_num;
	
	if(calc_is_num(v))
		v_num = v->data.num;
	else if(calc_is_str(v))
		v_num = (double) v->data.str->len;
	else // Must be a list.
		v_num = (double) v->data.list->len;
	
	if(calc_is_num(u))
		u_num = u->data.num;
	else if(calc_is_str(u))
		u_num = (double) u->data.str->len;
	else // Must be a list.
		u_num = (double) u->data.list->len;
	
	return comp(v_num, u_num);
}

#include "print.h"
void calc_free_val(Calc_Val* val) {
	printf("Freeing ");
	calc_debug_val(val);
	printf("\n");
	switch(val->type) {
		case calc_num: break;
		case calc_str: free(val->data.str); break;
		case calc_list: {
			Calc_Val_List* list = val->data.list;
			size_t i;
			for(i = 0; i < list->len; i++)
				calc_lose_ref(list->vals[i]);
			free(list);
			break;
		}
	}
	free(val);
}

void calc_gain_ref(Calc_Val* val) {
	val->refs++;
}

void calc_lose_ref(Calc_Val* val) {
	if(--val->refs == 0)
		calc_free_val(val);
	else {calc_debug_val(val); printf(" is down to %d ref(s).\n", val->refs);}
}

Calc_Stack calc_new_stack(size_t start_cap) {
	return (Calc_Stack) {
		.len = 0,
		.cap = start_cap,
		.vals = malloc(sizeof(Calc_Val*) * start_cap)
	};
}

void calc_free_stack(Calc_Stack* stack) {
	size_t i;
	for(i = 0; i < stack->len; i++)
		calc_lose_ref(stack->vals[i]);
	free(stack->vals);
	stack->vals = NULL;
	stack->cap = stack->len = 0;
}

void calc_push(Calc_Stack* stack, Calc_Val* val) {
	if(++stack->len > stack->cap) {
		stack->cap *= 2;
		stack->vals = realloc(stack->vals, sizeof(Calc_Val*) * stack->cap);
	}
	stack->vals[stack->len-1] = val;
}

Calc_Val* calc_pop(Calc_Stack* stack) {
	return stack->vals[--stack->len];
}

Calc_Val* calc_peek(Calc_Stack* stack) {
	return stack->vals[stack->len-1];
}
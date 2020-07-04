#include <stdlib.h>
#include <stdio.h>

#include "len str.h"
#include "types.h"
#include "print.h"

static const Calc_Len_Str list_start = {1, '['};
static const Calc_Len_Str list_end = {1, ']'};
static const Calc_Len_Str list_sep = {2, ',', ' '};

static const Calc_Len_Str func_start = {1, '{'};
static const Calc_Len_Str func_end = {26, ' ', '-', '>', ' ', '<', 'f', 'u', 'n', 'c', 't', 'i', 'o', 'n', ' ', 'd', 'e', 'f', 'i', 'n', 'i', 't', 'i', 'o', 'n', '>', '}'};
static const Calc_Len_Str func_sep = {1, ' '};

static const Calc_Len_Str stack_start = {5, 'c', 'a', 'l', 'c', '='};
static const Calc_Len_Str stack_sep = {1, ' '};

Calc_Len_Str* calc_print(Calc_Stack* stack) {
	Calc_Val** vals = stack->vals;
	size_t len = stack->len;
	size_t i;
	
	if(len == 0) return calc_to_len_str("calc=");
	
	Calc_Len_Str** printed_vals = malloc(sizeof(Calc_Len_Str*) * len);
	
	size_t buf_size = stack_start.len + stack_sep.len * (len - 1);
	for(i = 0; i < len; i++) {
		printed_vals[i] = calc_print_val(vals[i]);
		buf_size += printed_vals[i]->len;
	}
	
	Calc_Len_Str* buf = calc_len_str_prealloc(buf_size);
	calc_len_str_append(buf, &stack_start);
	for(i = 0; i < len; i++) {
		calc_len_str_append(buf, printed_vals[i]);
		if(i < len - 1)
			calc_len_str_append(buf, &stack_sep);
	}
	
	for(i = 0; i < len; i++)
		free(printed_vals[i]);
	free(printed_vals);
	
	return buf;
}

Calc_Len_Str* calc_print_val(Calc_Val* val) {
	switch(val->type) {
		case calc_num: {
			int len = snprintf(NULL, 0, "%.5f", val->data.num);
			char* buf = malloc(sizeof(char) * len);
			sprintf(buf, "%.5f", val->data.num);
			Calc_Len_Str* len_str = calc_to_len_str(buf);
			free(buf);
			return len_str;
		}
		case calc_str: return calc_len_str_copy(val->data.str);
		case calc_list: {
			Calc_Val_List* val_data = val->data.list;
			size_t list_len = val_data->len;
			size_t i;
			
			if(list_len == 0) return calc_to_len_str("[]");
			
			Calc_Len_Str** printed_vals = malloc(sizeof(Calc_Len_Str*) * list_len);
			
			size_t buf_size =
				list_start.len +
				list_sep.len * (list_len - 1) +
				list_end.len;
			for(i = 0; i < list_len; i++) {
				printed_vals[i] = calc_print_val(val_data->vals[i]);
				buf_size += printed_vals[i]->len;
			}
			
			Calc_Len_Str* buf = calc_len_str_prealloc(buf_size);
			calc_len_str_append(buf, &list_start);
			for(i = 0; i < list_len; i++) {
				calc_len_str_append(buf, printed_vals[i]);
				if(i < list_len - 1)
					calc_len_str_append(buf, &list_sep);
			}
			calc_len_str_append(buf, &list_end);
			
			for(i = 0; i < list_len; i++)
				free(printed_vals[i]);
			free(printed_vals);
			
			return buf;
		}
		case calc_func: {
			Calc_Len_Str** args = val->data.func->args.args;
			size_t args_len = val->data.func->args.len;
			size_t i;
			
			if(args_len == 0) return calc_to_len_str("{<function definition>}");
			
			size_t buf_size =
				func_start.len +
				func_sep.len * (args_len - 1) +
				func_end.len;
			for(i = 0; i < args_len; i++)
				buf_size += args[i]->len;
			
			Calc_Len_Str* buf = calc_len_str_prealloc(buf_size);
			calc_len_str_append(buf, &func_start);
			for(i = 0; i < args_len; i++) {
				calc_len_str_append(buf, args[i]);
				if(i < args_len - 1)
					calc_len_str_append(buf, &func_sep);
			}
			calc_len_str_append(buf, &func_end);
			
			return buf;
		}
		case calc_ref: return calc_len_str_copy(val->data.ref->sym);
		case calc_op: return calc_len_str_copy(calc_op_to_str(val->data.op));
	}
}

void calc_debug_stack(Calc_Stack* stack) {
	Calc_Len_Str* str = calc_print(stack);
	char* c_str = calc_from_len_str(str);
	printf("%s\n", c_str);
	free(str);
	free(c_str);
}

void calc_debug_val(Calc_Val* val) {
	Calc_Len_Str* str = calc_print_val(val);
	char* c_str = calc_from_len_str(str);
	printf("%s", c_str);
	free(str);
	free(c_str);
}

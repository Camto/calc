#include <stdlib.h>

#include "len str.h"
#include "lex.h"

#define is_digit(curr) ((curr) >= '0' && (curr) <= '9')

// A num op is the first character of an operator which can also be the first character of a number.

#define is_non_num_op_char(curr) ( \
		(curr) == '+' || (curr) == '*' || (curr) == '/' || \
		(curr) == '^' || (curr) == '%' || \
		(curr) == '&' || (curr) == '|' || (curr) == '!' || \
		(curr) == '=' || (curr) == '<' || (curr) == '>' || \
		(curr) == '$' || \
		(curr) == '[' || (curr) == ']' || (curr) == ',' || \
		(curr) == '{' || (curr) == '}' || \
		(curr) == ';' \
	)

#define is_num_op_char(curr) ((curr) == '-' || (curr) == '.')

#define is_whitespace(curr) ( \
		(curr) == ' ' || (curr) == '\t' || (curr) == '\n' || (curr) == '\r' \
	)

Calc_Tokens calc_lex(const Calc_Len_Str* prog) {
	Calc_Tokens tokens = {
		0,
		128,
		malloc(sizeof(Calc_Token) * 128)
	};
	size_t pos = 0;
	
	char curr;
	while(pos < prog->len) {
		curr = prog->chars[pos];
		if(is_digit(curr)) calc_expect_num(&tokens, prog, &pos);
		else if(is_num_op_char(curr)) {
			if(
				(pos + 1 < prog->len && is_digit(prog->chars[pos + 1])) ||
				(
					pos + 2 < prog->len &&
					prog->chars[pos + 1] == '.' &&
					is_digit(prog->chars[pos + 2]))
			) calc_expect_num(&tokens, prog, &pos);
			else {
				int succeeded = calc_expect_op(&tokens, prog, &pos);
				if(!succeeded) return tokens;
			}
		} else if(curr == '"') {
			int succeeded = calc_expect_str(&tokens, prog, &pos);
			if(!succeeded) return tokens;
		}
		else if(is_non_num_op_char(curr)) {
			int succeeded = calc_expect_op(&tokens, prog, &pos);
			if(!succeeded) return tokens;
		}
		else if(!is_whitespace(curr)) calc_expect_sym(&tokens, prog, &pos);
		else pos++;
	}
	
	return tokens;
}

void calc_expect_num(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
) {
	size_t end = *pos;
	
	if(prog->chars[end] == '-') end++;
	while(end < prog->len && is_digit(prog->chars[end])) end++;
	if(
		end + 1 < prog->len &&
		prog->chars[end] == '.' &&
		is_digit(prog->chars[end + 1])
	) {
		end++;
		while(end < prog->len && is_digit(prog->chars[end])) end++;
	}
	
	char* num_str = calc_from_len_str_slice(prog, *pos, end - *pos);
	double num = strtod(num_str, NULL);
	free(num_str);
	
	printf("Num: %f\n", num);
	
	calc_append_token(tokens, (Calc_Token) {
		.type = calc_num_token,
		.data.num = num
	});
	*pos = end;
}

int calc_expect_str(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
) {
	size_t end = *pos + 1;
	
	size_t escapes = 0;
	while(end < prog->len && prog->chars[end] != '"') {
		if(prog->chars[end] == '\\') {
			if(end + 1 < prog->len) {
				end++;
				escapes++;
			} else return 0;
		}
		end++;
	}
	if(prog->chars[end] != '"') return 0;
	end++;
	
	Calc_Len_Str* str = calc_len_str_prealloc(end - *pos - escapes - 2);
	size_t i;
	for(i = *pos + 1; i < end - 1; i++) {
		if(prog->chars[i] == '\\') {
			i++;
			switch(prog->chars[i]) {
				case 'n': {str->chars[str->len] = '\n'; break;}
				case 't': {str->chars[str->len] = '\t'; break;}
				default: {str->chars[str->len] = prog->chars[i]; break;}
			}
			str->len++;
		} else {
			str->chars[str->len] = prog->chars[i];
			str->len++;
		}
	}
	
	char* buf = calc_from_len_str(str);
	printf("Str: \"%s\"\n", buf);
	free(buf);
	
	calc_append_token(tokens, (Calc_Token) {
		.type = calc_str_token,
		.data.str = str
	});
	*pos = end;
	return 1;
}

int calc_expect_op(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
) {
	Calc_Op op;
	char curr = prog->chars[*pos];
	char next = *pos + 1 < prog->len ? prog->chars[*pos + 1] : '\0';
	
	if(curr == '+') op = calc_add;
	else if(curr == '-') {
		if(next == '>') {op = calc_func_arrow; (*pos)++;}
		else op = calc_sub;
	} else if(curr == '*') op = calc_mul;
	else if(curr == '/') op = calc_div;
	else if(curr == '^') op = calc_pow;
	else if(curr == '%') op = calc_mod;
	else if(curr == '.') {
		if(next == '.') {op = calc_to; (*pos)++;}
		else return 0;
	} else if(curr == '&') op = calc_and;
	else if(curr == '|') op = calc_or;
	else if(curr == '!') {
		if(next == '=') {op = calc_neq; (*pos)++;}
		else op = calc_not;
	} else if(curr == '=') op = calc_eq_;
	else if(curr == '<') {
		if(next == '=') {op = calc_lte; (*pos)++;}
		else op = calc_lt;
	} else if(curr == '>') {
		if(next == '=') {op = calc_gte; (*pos)++;}
		else op = calc_gt;
	} else if(curr == '$') op = calc_refof;
	else if(curr == '[') op = calc_list_start;
	else if(curr == ']') op = calc_list_end;
	else if(curr == ',') op = calc_list_sep;
	else if(curr == '{') op = calc_func_start;
	else if(curr == '}') op = calc_func_end;
	else if(curr == ';') op = calc_list_start;
	
	char* buf = calc_from_len_str(calc_op_to_str(op));
	printf("Op: %s\n", buf);
	free(buf);
	
	calc_append_token(tokens, (Calc_Token) {
		.type = calc_op_token,
		.data.op = op
	});
	(*pos)++;
	return 1;
}

void calc_expect_sym(
	Calc_Tokens* tokens,
	const Calc_Len_Str* prog,
	size_t* pos
) {
	size_t end = *pos;
	
	while(
		end < prog->len &&
		!is_digit(prog->chars[end]) &&
		!is_non_num_op_char(prog->chars[end]) &&
		!is_num_op_char(prog->chars[end]) &&
		!is_whitespace(prog->chars[end]) &&
		prog->chars[end] != '"'
	) end++;
	
	Calc_Len_Str* sym = calc_len_str_prealloc(end - *pos);
	size_t i;
	for(i = *pos; i < end; i++) {
		sym->chars[sym->len] = prog->chars[i];
		sym->len++;
	}
	
	char* buf = calc_from_len_str(sym);
	printf("Sym: %s\n", buf);
	free(buf);
	
	calc_append_token(tokens, (Calc_Token) {
		.type = calc_sym_token,
		.data.sym = sym
	});
	*pos = end;
}

void calc_append_token(Calc_Tokens* tokens, Calc_Token token) {
	if(++tokens->len > tokens->cap) {
		tokens->cap *= 2;
		tokens->tokens = realloc(tokens->tokens, sizeof(Calc_Token) * tokens->cap);
	}
	tokens->tokens[tokens->len-1] = token;
}

static const Calc_Len_Str calc_add_str = {1, '+'};
static const Calc_Len_Str calc_sub_str = {1, '-'};
static const Calc_Len_Str calc_mul_str = {1, '*'};
static const Calc_Len_Str calc_div_str = {1, '/'};
static const Calc_Len_Str calc_pow_str = {1, '^'};
static const Calc_Len_Str calc_mod_str = {1, '%'};
static const Calc_Len_Str calc_to_str = {2, '.', '.'};
static const Calc_Len_Str calc_and_str = {1, '&'};
static const Calc_Len_Str calc_or_str = {1, '|'};
static const Calc_Len_Str calc_not_str = {1, '!'};
static const Calc_Len_Str calc_eq_str = {1, '='};
static const Calc_Len_Str calc_neq_str = {2, '!', '='};
static const Calc_Len_Str calc_lt_str = {1, '<'};
static const Calc_Len_Str calc_gt_str = {1, '>'};
static const Calc_Len_Str calc_lte_str = {2, '<', '='};
static const Calc_Len_Str calc_gte_str = {2, '>', '='};
static const Calc_Len_Str calc_refof_str = {1, '$'};
static const Calc_Len_Str calc_list_start_str = {1, '['};
static const Calc_Len_Str calc_list_end_str = {1, ']'};
static const Calc_Len_Str calc_list_sep_str = {1, ','};
static const Calc_Len_Str calc_func_start_str = {1, '{'};
static const Calc_Len_Str calc_func_end_str = {1, '}'};
static const Calc_Len_Str calc_func_arrow_str = {2, '-', '>'};
static const Calc_Len_Str calc_var_sep_str = {1, ';'};

const Calc_Len_Str* calc_op_to_str(Calc_Op op) {
	switch(op) {
		// Normal operators.
		case calc_add: return &calc_add_str;
		case calc_sub: return &calc_sub_str;
		case calc_mul: return &calc_mul_str;
		case calc_div: return &calc_div_str;
		case calc_pow: return &calc_pow_str;
		case calc_mod: return &calc_mod_str;
		case calc_to: return &calc_to_str;
		case calc_and: return &calc_and_str;
		case calc_or: return &calc_or_str;
		case calc_not: return &calc_not_str;
		case calc_eq_: return &calc_eq_str;
		case calc_neq: return &calc_neq_str;
		case calc_lt: return &calc_lt_str;
		case calc_gt: return &calc_gt_str;
		case calc_lte: return &calc_lte_str;
		case calc_gte: return &calc_gte_str;
		// Context operators.
		case calc_refof: return &calc_refof_str;
		case calc_list_start: return &calc_list_start_str;
		case calc_list_end: return &calc_list_end_str;
		case calc_list_sep: return &calc_list_sep_str;
		case calc_func_start: return &calc_func_start_str;
		case calc_func_end: return &calc_func_end_str;
		case calc_func_arrow: return &calc_func_arrow_str;
		case calc_var_sep: return &calc_var_sep_str;
	}
}

// Clean up.

#undef is_digit
#undef is_non_num_op_char
#undef is_num_op_char
#undef is_whitespace
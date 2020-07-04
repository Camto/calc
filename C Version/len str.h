#ifndef CALC_LEN_STR
#define CALC_LEN_STR

#include <stdlib.h>

typedef struct {
	size_t len;
	char chars[1];
} Calc_Len_Str;

const Calc_Len_Str empty_str;

Calc_Len_Str* calc_to_len_str(const char* c_str);
char* calc_from_len_str(const Calc_Len_Str* str);

// Calc_Len_Str* calc_len_str_slice(const Calc_Len_Str* str, size_t start, size_t len);
char* calc_from_len_str_slice(const Calc_Len_Str* str, size_t start, size_t len);

Calc_Len_Str* calc_len_str_copy(const Calc_Len_Str* str);

Calc_Len_Str* calc_len_str_prealloc(size_t len);
void calc_len_str_append(Calc_Len_Str* str, const Calc_Len_Str* end);

#endif

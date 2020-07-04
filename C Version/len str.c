#include <stdlib.h>
#include <string.h>

#include "len str.h"

const Calc_Len_Str empty_str = {0};

Calc_Len_Str* calc_to_len_str(const char* c_str) {
	size_t len = (size_t) strlen(c_str);
	Calc_Len_Str* str = malloc(sizeof(Calc_Len_Str) + sizeof(char) * len);
	str->len = len;
	memcpy(&str->chars, c_str, len);
	return str;
}

char* calc_from_len_str(const Calc_Len_Str* str) {
	size_t len = str->len;
	char* c_str = malloc(sizeof(char) * (len + 1));
	memcpy(c_str, &str->chars, len);
	c_str[len] = '\0';
	return c_str;
}

char* calc_from_len_str_slice(const Calc_Len_Str* str, size_t start, size_t len) {
	char* c_str = malloc(sizeof(char) * (len + 1));
	memcpy(c_str, &str->chars[start], len);
	c_str[len] = '\0';
	return c_str;
}

Calc_Len_Str* calc_len_str_copy(const Calc_Len_Str* str) {
	size_t len = str->len;
	Calc_Len_Str* copy = malloc(sizeof(Calc_Len_Str) + sizeof(char) * len);
	copy->len = len;
	memcpy(&copy->chars, &str->chars, len);
	return copy;
}

Calc_Len_Str* calc_len_str_prealloc(size_t len) {
	Calc_Len_Str* str = malloc(sizeof(Calc_Len_Str) + sizeof(char) * len);
	str->len = 0;
	return str;
}

void calc_len_str_append(Calc_Len_Str* str, const Calc_Len_Str* end) {
	memcpy(&str->chars[str->len], &end->chars, end->len);
	str->len += end->len;
}
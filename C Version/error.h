#ifndef CALC_ERROR
#define CALC_ERROR

#include "len str.h"

typedef Calc_Len_Str* Calc_Maybe_Error;

typedef enum {calc_error, calc_result} Calc_Is_Error;
#define Calc_Errorful(T) \
	struct { \
		Calc_Is_Error is_error; \
		union { \
			Calc_Len_Str* error; \
			T result; \
		} data; \
	}

Calc_Len_Str* calc_error_header(const Calc_Len_Str* prog, size_t pos);

#endif

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

typedef struct {
	size_t start_cut;
	size_t end_cut;
	int line_count;
} Calc_Error_Header_Info; 

Calc_Error_Header_Info calc_error_header_info(
	const Calc_Len_Str* prog,
	size_t pos
);

void calc_error_header(
	const Calc_Len_Str* prog, size_t pos, Calc_Len_Str* buf,
	size_t start_cut, size_t end_cut
);

#endif

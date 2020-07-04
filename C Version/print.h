#ifndef CALC_PRINT
#define CALC_PRINT

#include "len str.h"
#include "types.h"

Calc_Len_Str* calc_print(Calc_Stack* stack);
Calc_Len_Str* calc_print_val(Calc_Val* val);

void calc_debug_stack(Calc_Stack* stack);
void calc_debug_val(Calc_Val* val);

#endif

#include "error.h"

#include <string.h>

Calc_Len_Str* calc_error_header(const Calc_Len_Str* prog, size_t pos) {
	size_t i;
	size_t start_prog_cut = 0;
	size_t end_prog_cut = prog->len;
	size_t cut_len;
	int line_count = 0;
	Calc_Len_Str* buf;
	
	for(i = 0; i < pos; i++)
		if(prog->chars[i] == '\n') {
			line_count++;
			start_prog_cut = i + 1;
		}
	
	for(i = pos; i < prog->len; i++)
		if(prog->chars[i] == '\n') {
			end_prog_cut = i;
			break;
		}
	
	if(pos - start_prog_cut > 10) start_prog_cut = pos - 10;
	if(end_prog_cut - pos > 11) end_prog_cut = pos + 11;
	cut_len = end_prog_cut - start_prog_cut;
	
	buf = calc_len_str_prealloc(cut_len * 2 + 1);
	memcpy(buf->chars, &prog->chars[start_prog_cut], cut_len);
	buf->len += cut_len;
	buf->chars[buf->len] = '\n';
	buf->len++;
	for(i = 0; i < pos - start_prog_cut; i++) {
		buf->chars[buf->len] = ' ';
		buf->len++;
	}
	buf->chars[buf->len] = '^';
	buf->len++;
	for(i = 0; i < end_prog_cut - pos - 1; i++) {
		buf->chars[buf->len] = ' ';
		buf->len++;
	}
	
	return buf;
}

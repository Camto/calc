#include "error.h"

#include <string.h>

Calc_Error_Header_Info calc_error_header_info(
	const Calc_Len_Str* prog,
	size_t pos
) {
	size_t i;
	size_t start_cut = 0;
	size_t end_cut = prog->len;
	int line_count = 0;
	Calc_Error_Header_Info info;
	
	for(i = 0; i < pos; i++)
		if(prog->chars[i] == '\n') {
			line_count++;
			start_cut = i + 1;
		}
	
	for(i = pos; i < prog->len; i++)
		if(prog->chars[i] == '\n') {
			end_cut = i;
			break;
		}
	
	if(pos - start_cut > 10) start_cut = pos - 10;
	if(end_cut - pos > 11) end_cut = pos + 11;
	
	info.start_cut = start_cut;
	info.end_cut = end_cut;
	info.line_count = line_count;
	return info;
}

void calc_error_append_header(
	Calc_Len_Str* buf,
	const Calc_Len_Str* prog, size_t pos,
	size_t start_cut, size_t end_cut
) {
	size_t i;
	size_t cut_len = end_cut - start_cut;
	
	memcpy(&buf->chars[buf->len], &prog->chars[start_cut], cut_len);
	buf->len += cut_len;
	buf->chars[buf->len] = '\n';
	buf->len++;
	for(i = 0; i < pos - start_cut; i++) {
		buf->chars[buf->len] = ' ';
		buf->len++;
	}
	buf->chars[buf->len] = '^';
	buf->len++;
	for(i = 0; i < end_cut - pos - 1; i++) {
		buf->chars[buf->len] = ' ';
		buf->len++;
	}
}

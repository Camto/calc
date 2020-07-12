require "pl"

local function skip_ws(prog, i)
	local ws = prog:sub(i):match"[ \n]*"
	return i + #ws
end

local function parse_name(prog, i)
	local name = prog:sub(i):match"[%w_]+"
	return name, i + #name
end

local str, insert = false, true

local function parse_str(prog, i)
	local str_ = prog:sub(i):match"`[^`]*`":sub(2, -2)
	
	local parsed_str = List{}
	local current_state = str
	for section in str_:gmatch"[^\\]+" do
		parsed_str:append{type = current_state, data = section}
		current_state = not current_state
	end
	
	return parsed_str, i + #str_ + 2
end

local function parse_prog(prog)
	local errors = List{}

	local i = 1
	while i <= #prog do
		local name
		local str_
		i = skip_ws(prog, i)
		name, i = parse_name(prog, i)
		i = skip_ws(prog, i)
		str_, i = parse_str(prog, i)
		i = skip_ws(prog, i)
		errors:append{name = name, str = str_}
	end
	
	return errors
end

local function to_c_char(char)
	if char == "'" then return "'\\''"
	elseif char == "\n" then return "'\\n'"
	elseif char == "\\" then return "'\\\\'"
	else return "'" .. char .. "'" end
end

local function error_to_func(error)
	local name = error.name
	local str = error.str[1].data
	
	return {
		"static const Calc_Len_Str_Size(" .. #str .. ") calc_error_" .. name ..
		"_str = {" .. #str .. ", " .. List(str):map(to_c_char):join", " .. "};",
		
"Calc_Len_Str* calc_error_" .. name .. [[(const Calc_Len_Str* prog, size_t pos) {
	Calc_Len_Str* buf;
	Calc_Error_Header_Info info = Calc_Error_Header_Info(prog, pos);
	buf = calc_len_str_prealloc(
		(info.start_cut - info.end_cut) * 2 + 3 + ]] .. #str .. [[

	);
	calc_error_append_header(
		buf,
		prog, pos,
		info.start_cut, info.end_cut
	);
	calc_len_str_append(buf, calc_two_newlines);
	calc_len_str_append(buf, calc_error_]] .. name .. [[_str);
	
	return buf;
}]],
		
		"Calc_Len_Str* calc_error_" .. name .. "(const Calc_Len_Str* prog, size_t pos);"
	}
end

local error_file = io.open("error.err", "r")
local prog = error_file:read"*a"
error_file:close()

errors = parse_prog(prog)

pretty.dump(errors:map(error_to_func))
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
	
	local parsed_str = {}
	local current_state = str
	for section in str_:gmatch"[^\\]+" do
		table.insert(parsed_str, {type = current_state, data = section})
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
		table.insert(errors, {name = name, str = str_})
	end
	
	return errors
end

local function error_to_func(error)
	return
"Calc_Len_Str* " .. error.name .. [[(const Calc_Len_Str* prog, size_t pos) {
	Calc_Len_Str* buf = calc_error_header(prog, pos);
}

]]
end

local error_file = io.open("error.err", "r")
local prog = error_file:read"*a"
error_file:close()

errors = parse_prog(prog)

print(errors:map(error_to_func))
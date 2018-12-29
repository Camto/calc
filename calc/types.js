var types = {
	num: 0, str: 1, list: 2,
	func: 3, sym: 4, op: 5
};

var new_value = {
	new_num: num => ({data: num, type: types.num}),
	new_bool: bool => ({data: bool | 0, type: types.num}),
	new_str: str => ({data: str, type: types.str}),
	new_list: list => ({data: list, type: types.list}),
	new_sym: sym => ({data: sym, type: types.sym})
};

function type_to_str(type) {
	switch(type) {
		case types.num:
			return "number";
		case types.str:
			return "string";
		case types.list:
			return "list";
		case types.func:
			return "function";
		case types.sym:
			return "symbol";
		case types.op:
			return "operator";
	}
}

function to_bool(val) {
	if(val.is_ref) {
		return true;
	}
	switch(val.type) {
		case types.num:
		case types.str:
			return Boolean(val.data);
			break;
		case types.func:
		case types.sym:
		case types.op:
			return true;
			break;
		case types.list:
			return Boolean(val.data.length);
			break;
	}
	return false;
}

module.exports = {...types, ...new_value, type_to_str, to_bool};
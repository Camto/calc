var types = {
	num: 0, str: 1, list: 2,
	func: 3, sym: 4, op: 5
};

var new_value = {
	new_num: num => ({data: num, type: types.num}),
	new_bool: bool => ({data: bool | 0, type: types.num}),
	new_str: str => ({data: str, type: types.str}),
	new_list: list => ({data: list, type: types.list}),
	new_sym: sym => ({data: sym, type: types.sym}),
	new_op: op => ({data: op, type: types.op})
};

var is_type = {
	is_num: val => val.type == types.num,
	is_str: val => val.type == types.str,
	is_list: val => val.type == types.list,
	is_func: val => val.type == types.func,
	is_sym: val => val.type == types.sym,
	is_op: val => val.type == types.op,
	is_list_like: val => is_type.is_list(val) || is_type.is_str(val)
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

function eq(left, right) {
	if(
		is_type.is_num(left) && is_type.is_num(right) ||
		is_type.is_str(left) && is_type.is_str(right)
	) {
		return left.data == right.data;
	} else if(is_type.is_list(left) && is_type.is_list(right)) {
		if(left.data.length != right.data.length) {
			return false;
		}
		for(var cou = 0; cou < left.data.length; cou++) {
			if(!eq(left.data[cou], right.data[cou])) {
				return false;
			}
		}
		return true;
	} else {
		return false;
	}
}

function cmp(left, right, comparator) {
	if(is_type.is_num(left) && is_type.is_num(right)) {
		return comparator(left.data, right.data);
	} else if(
		is_type.is_list_like(left) && is_type.is_list_like(right)
	) {
		return comparator(left.data.length, right.data.length);
	}
	return false;
}

module.exports = {
	...types, ...new_value, ...is_type,
	type_to_str, to_bool,
	eq, cmp
};
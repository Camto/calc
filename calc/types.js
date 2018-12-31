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
		left.type == types.num && right.type == types.num ||
		left.type == types.str && right.type == types.str
	) {
		return left.data == right.data;
	} else if(left.type == types.list && right.type == types.list) {
		return Object.compare(left.data, right.data);
	} else {
		return false;
	}
}

// Taken from https://gist.github.com/nicbell/6081098 .
Object.compare = function(obj1, obj2) {
	for(var p in obj1) {
		if(obj1.hasOwnProperty(p) !== obj2.hasOwnProperty(p)) {
			return false;
		}
		switch(typeof (obj1[p])) {
			case "object":
				if(!Object.compare(obj1[p], obj2[p])) {
					return false;
				}
				break;
			case "function":
				if(typeof (obj2[p]) == "undefined" || (p != "compare" && obj1[p].toString() != obj2[p].toString())) {
					return false;
				}
				break;
			default:
				if(obj1[p] != obj2[p]) {
					return false;
				}
				break;
		}
	}
	for(var p in obj2) {
		if(typeof (obj1[p]) == "undefined") {
			return false;
		}
	}
	return true;
};

function cmp(left, right, comparator) {
	if(left.type == types.num && right.type == types.num) {
		return comparator(left.data, right.data);
	} else if(
		left.type == types.str && right.type == types.str ||
		left.type == types.list && right.type == types.list
	) {
		return comparator(left.data.length, right.data.length);
	}
	return false;
}

module.exports = {...types, ...new_value, type_to_str, to_bool, eq, cmp};
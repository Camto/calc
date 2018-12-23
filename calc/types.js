var types = {
	num: 0, str: 1, list: 2,
	func: 3, sym: 4, op: 5
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

module.exports = {...types, type_to_str};
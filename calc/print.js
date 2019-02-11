var types = require("./types");

module.exports = function print(value) {
	if(value instanceof Array) {
		var result = "calc=";
		for(let cou = 0; cou < value.length; cou++) {
			result += print(value[cou]);
			if(cou < value.length - 1) {
				result += " ";
			}
		}
		return result;
	} else {
		
		switch(value.type) {
			case types.str:
			case types.sym:
			case types.op:
				return value.data;
				break;
			case types.num:
				return Math.round(value.data * 100000) / 100000;
			case types.list:
				var list = "[";
				for(let cou = 0; cou < value.data.length; cou++) {
					list += print(value.data[cou]);
					if(cou < value.data.length - 1) {
						list += ", ";
					}
				}
				list += "]";
				return list;
				break;
			case types.func:
				return `{${value.args.join(" ")} -> <function definition>}`;
				break;
		}
		
	}
}
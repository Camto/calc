function get_variable(name, scopes) {
	for(let cou = scopes.length - 1; cou >= 0; cou--) {
		if(scopes[cou][name]) {
			return scopes[cou][name];
		}
	}
	return undefined;
}

function set_variable(name, value, scopes) {
	for(let cou = scopes.length - 1; cou >= 0; cou--) {
		if(scopes[cou][name]) {
			scopes[cou][name] = value;
			return scopes[cou][name];
		}
	}
	return undefined;
}

module.exports = {get_variable, set_variable};
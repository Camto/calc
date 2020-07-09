"use strict";

var past = [""];
var travel = 2;

$(function() {
	$("#log").append(escape_input(calc.print(calc.calc("calc= h", 10000))) + "<br />");
	past.push("h");
	if(location.search.substring(6) == "") {
		history.replaceState("", "", "?calc=h");
	} else {
		var prog = decodeURIComponent(location.search.substring(6));
		if(prog != "h") {
			$("#log").append("calc= " + escape_input(prog) + "<br />");
			var result;
			try {
				result = calc.print(calc.calc("calc= " + prog, 10000));
			} catch(err) {
				result = calc.err_to_str(err);
			}
			$("#log").append(escape_input(result) + "<br />");
			past.push(decodeURIComponent(location.search.substring(6)));
			travel++;
		}
	}
	
	$("#calc").keyup(function(key) {
		switch(key.which) {
			case 13:
				$(this).val($(this).val().replace(/[\n\r]/g, ""));
				var result = "";
				try {
					result = calc.print(calc.calc("calc= " + $(this).val(), 10000));
				} catch(err) {
					result = calc.err_to_str(err);
				}
				past.push($(this).val().replace(/[\n\r]/g, ""));
				travel = past.length;
				history.replaceState("", "", "?calc=" + encodeURIComponent($(this).val().replace(/[\n\r]/g, "")));
				
				$("#log").append("calc= " + escape_input($(this).val()) + "<br />");
				$("#log").append(escape_input(result) + "<br />");
				$(this).val("");
				$("#log").scrollTop($("#log")[0].scrollHeight);
				break;
			case 38:
				travel--;
				if(travel <= 0) {
					travel = 0;
				}
				$(this).val(past[travel]);
				var length = $(this).val().length * 2;
				setTimeout(() => this.setSelectionRange(length, length), 1);
				break;
			case 40:
				travel++;
				if(travel > past.length - 1) {
					travel = past.length;
					$(this).val("");
					setTimeout(() => this.setSelectionRange(6, 6), 1);
				} else {
					$(this).val(past[travel]);
					var length = $(this).val().length * 2;
					setTimeout(() => this.setSelectionRange(length, length), 1);
				}
				break;
		}
	});
	
	$("#calc").keydown(function() {
		$(this).val($(this).val().replace(/[\n\r]/g, ""));
	});
});

function escape_input(string) {
	return string
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;")
		.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
		.replace(/\n/g, "<br />");
}
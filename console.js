var past = ["calc= "];
var travel = 0;

$(function() {
	$("#log").append(escape_input(print(calc("calc= h", 10000))));
	
	$("#calc").keyup(function(key) {
		switch(key.which) {
			case 13:
				$(this).val($(this).val().replace(/[\n\r]/g, ""));
				var result = "";
				try {
					result = print(calc($(this).val(), 10000));
				} catch(err) {
					result = err.toString();
				}
				past.push($(this).val().replace(/[\n\r]/g, ""));
				travel = past.length;
				
				$("#log").append(escape_input(result));
				$("#log").append("<br />");
				$(this).val("calc= ");
				$('#log').scrollTop($('#log')[0].scrollHeight);
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
					travel = past.length - 1;
					$(this).val("calc= ");
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
		.replace(/ /g, "&nbsp;")
		.replace(/\n/g, "<br />")
}
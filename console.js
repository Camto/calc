$(function() {
	$("#log").append(escape_input(print(calc("calc= h"))));
	
	$("#calc").keyup(function(key) {
		if(key.which == 13) {
			var result = "";
			try {
				result = print(calc($(this).val()));
			} catch(err) {
				result = err.toString();
			}
			
			$("#log").append(escape_input(result));
			$("#log").append("<br />");
			$(this).val("calc= ");
			$('#log').scrollTop($('#log')[0].scrollHeight);
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
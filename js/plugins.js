


// Avoid `console` errors in browsers that lack a console.
(function() {
	var method;
	var noop = function() {
	};
	var methods = [
		'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
		'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
		'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
		'timeStamp', 'trace', 'warn'
	];
	var length = methods.length;
	var console = (window.console = window.console || {});

	while (length--) {
		method = methods[length];

		// Only stub undefined methods.
		if (!console[method]) {
			console[method] = noop;
		}
	}
}());

// pre-submit callback 
function showRequest(formData, jqForm, options) {
	$('a[role="indicator"]').html("<span class='icon-hourglass'></span> Enregistrement...");
	//var queryString = $.param(formData);
	return true;
}

// post-submit callback 
function showResponse(responseText, statusText, xhr, $form) {
	$('a[role="indicator"]').html("<span class='icon-checkmark2'></span> Enregistré.");
}

var initalizeForm = function() {
	var options = {
		target: '#form-result', // target element(s) to be updated with server response 
		beforeSubmit: showRequest, // pre-submit callback 
		success: showResponse, // post-submit callback 
		url: "modules/updatecompetence.php",
		type: "post"        // 'get' or 'post', override for form's 'method' attribute 
	};

	$('#form-competences').submit(function() {
		// inside event callbacks 'this' is the DOM element so we first 
		// wrap it in a jQuery object and then invoke ajaxSubmit 
		$(this).ajaxSubmit(options);

		// !!! Important !!! 
		// always return false to prevent standard browser submit and page navigation 
		return false;
	});
	addClearItems();
};

var addClearItems = function()
{
	$('#form-competences fieldset').each(function() {
		var fieldset = $(this);
		var radioElt = fieldset.find(".radio input").first();
		if (fieldset.find(".clear-all").length == 0)
		{
			fieldset.append("<a class='clear-all' data-items='"
				+ radioElt.attr("name")
				+ "'><span class='icon-remove-circle'></span></a>");
		}
	});
	$("#form-competences fieldset a.clear-all").click(function() {
		var item = $(this);
		var concerned = item.parent().find("input[name='" + item.attr("data-items") + "']");
		$.ajax({
			url: "modules/deletecompetence.php",
			type: 'POST',
			data: {
				login: $("#form-login").val(),
				code: $("#form-code").val(),
				comp: item.attr("data-items")
			}
		}).done(function(data) {
			concerned.each(function() {
				if ($(this).is(":checked"))
				{
					$(this).removeAttr("checked");
				}
			});
		});
	});
};

var createFormCompetences = function()
{
	$("#form-competences").makeForms({
		components: window.items,
		groupSize: 1,
		templates:
			{
				title: "<h4>{{title}}</h4>",
				group: '<fieldset>{{group}}</fieldset>',
				label: '<label for="{{id}}">{{label}}</label>',
				radio: '<div class="radio"><input type="radio" name="{{name}}"\
	id="{{id}}" value="{{value}}">{{label}}<label for="{{id}}"></label></div>',
				input: '<input class="form-control" type="{{type}}" name="{{name}}"\
	id="{{id}}" value="{{value}}">',
				text: '<input class="form-control" type="text" name="{{name}}"\
	id="{{id}}" value="{{value}}">',
				select: '<select class="form-control" id="{{id}}" name="{{name}}">\n\
	<option id="{{id}}" value="">Aucun</option>{{options}}</select>',
				option: '<option id="{{id}}" value="{{value}}">{{label}}</option>'
			}
	});
	/*$("div.radio input + label").click(function()
	 {
	 console.log("ok");
	 var elt = $(this).parent().children("input");
	 if(elt.is(":checked"))
	 {
	 elt.prop('checked', false);
	 }
	 });*/
};

window.createFormCompetences = createFormCompetences;

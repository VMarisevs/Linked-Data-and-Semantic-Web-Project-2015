$(document).ready(function(){
	// hiding div
	$( "#edit-dialog" ).dialog({ autoOpen: false,resizable: false, modal: true, width:'500px', });
	
	$(".dismiss").click(function(){
		$("#notification").fadeOut("slow");
	});
	
});
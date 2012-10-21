
	var card=1;
	$('.card').hide();
	$('.card1').show();
	
	$('a.next').click(function() {
	  if (card != 6) {card++;};
		$('.card').hide();
		$('.card'+card).show();
	});
	$('a.prev').click(function() {
	  if (card != 1) {card--;};
		$('.card').hide();
		$('.card'+card).show();
	});
	$('a.finish').click(function() {
		$('.ks-window.welcome').fadeOut('fast');
	});

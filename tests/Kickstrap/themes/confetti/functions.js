
// Preload a larger image and replace the much smaller one when ready.
var img = rootDir + 'Kickstrap/themes/confetti/confetti_girl_full.jpg';
$(window).load(function() {
	$('<img/>').attr('src', img).load(function() {
	   $('body').css('background-image', 'url(' + img + ')');
	});
	
	/* The full size image is also included. However this image is a screenshot
	 	 from a film, so it may not look much better. */
});
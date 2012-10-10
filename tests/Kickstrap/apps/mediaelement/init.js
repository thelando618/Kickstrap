$('video,audio').mediaelementplayer();

kickstrap.ready(function() {
	// First time message. Remove this if you have everything set up.
	if(typeof window.$.pnotify == 'function') {
	$.pnotify({
		title: 'Media Element.js',
		text: 'Don\'t forget to add MIME types. Check out <a href="http://mediaelementjs.com/#installation">the documentation</a>. Remove me in Kickstrap/apps/mediaelement/init.js',
		type: 'success',
		styling: 'bootstrap'
	});
	}
});
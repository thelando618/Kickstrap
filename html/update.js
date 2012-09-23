// CHANGE VERSION HERE
// ===================
var latestVersion = "1.0.0 Beta";

thisVersion ? foundVersion = true : foundVersion = false;
thisVersion == latestVersion ? update = false : update = true; 

var msgTitle, msgText, msgType;
if (!foundVersion) {
  updateState = -1;
	msgTitle = "Could not get version";
	msgText = 'We were able to contact the server, but could not read your version number.';
	msgType = "error";
}
else {
	if (update) {
		updateState = 1;
		msgTitle = "Update available";
		msgText = 'A new version (' + latestVersion + ') is available! <a href="http://getkickstrap.com">Download here!</a>';
		msgType = "warn";
	}
	else {
		updateState = 0;
		msgTitle = "You're up to date!";
		msgText = "Looks like you're using the latest version, (" + latestVersion + ")";
		msgType = "success";
	}
}	
if(typeof window.$.pnotify == 'function') {
	$.pnotify({
		title: msgTitle,
		text: msgText,
		type: msgType,
		styling: 'bootstrap'
	});
}
else {
	consoleLog(msgText);
	consoleLog('We tried to run this message through the Pines Notify app, but it appears it\'s not running');
}

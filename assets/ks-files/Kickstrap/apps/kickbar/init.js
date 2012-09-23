// Create an HTML Array of the Apps
var appsListFormatted ="";
for(i=0;i<appList.length;i++) {
	appsListFormatted += '<li><a href="javascript:loadApp(\''+appList[i]+'\');">' + appList[i] + '</a></li>';
}

$('body').prepend('<ul class="sf-menu"><li><a class="sf-with-ul">Apps</a><ul>' + appsListFormatted + '</ul></li><li><a class="sf-with-ul">Functions</a><ul><li><a href="javascript:document.body.contentEditable=\'true\'; document.designMode=\'on\'; void 0">Prototype</a></li></ul></li></ul>');
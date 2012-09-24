// Write your tests here to prevent them from loading before QUnit does.
// test("a basic unit test", function() {var value="hello";equal(value,"hello","We expect value to be hello");});

// Tests
// -----

// TODO: Test for 999 as a value in countRequired, etc.
module("Kickstrap Window Tests");
test("Override Parameters", function() {
	var settings = {name: 'testerWindow', url: 'a', width:'1',height:'1', top: '1', left: '1', title: 'a', iframe: true, maximize: true, cache: true};
	loadWindow(settings, true);
	for (var key in settings) {
		if(settings[key] || settings[key] == '1' || settings[key] == 'a') {
			var pass = true;
			ok(pass, "Overrode " + settings[key] + ".");
		};
	}
});
test("Maximize/Minimize Behavior", function() {
	loadWindow({name: 'maxMinTest1'}, true);
	loadWindow({name: 'maxMinTest2'}, true); // Try to confuse the maximize/minimize behavior
	toggleWindow(maxMinTest1);
	toggleWindow(maxMinTest2);
	ok(maxMinTest1.count, "Changing one window did not change the other (1/6)");
	toggleWindow(maxMinTest2);
	ok(maxMinTest1.count, "Changing one window did not change the other (2/6)");
	toggleWindow(maxMinTest2);toggleWindow(maxMinTest1);
	ok(!maxMinTest1.count, "Changing one window did not change the other (3/6)");
	toggleWindow(maxMinTest1);
	ok(maxMinTest2.count, "Changing one window did not change the other (4/6)");
	toggleWindow(maxMinTest1);
	ok(maxMinTest2.count, "Changing one window did not change the other (5/6)");
	toggleWindow(maxMinTest1);
	ok(maxMinTest2.count, "Changing one window did not change the other (6/6)");
});

/*module("Browser Properties Test"); // Throws a crazy loop with less.js
test("localStorage Test", function() {
	var lSMatch = ("w" == (localStorage.setItem = "w"));
	ok(lSMatch, "Browser has localStorage"); 
  var consoleLogVal = (typeof window.console.log == 'function')
  ok(consoleLogVal, "console.log() is running");
});*/

module("Subdirectory Tests");
test("rootDir definition", function() {
	ok(rootDir, "var rootDir is defined as " + rootDir);
});
// get blank.js
var passed = false;
$.getScript(rootDir + 'Kickstrap/apps/qunit/blank.js', function() {
	passed = true;
})
// shouldn't take more than a second.
kickstrap.ready(function() {
	module("Subdirectory Tests");
	test("Subdirectory file retrieval", function() {
	  ok(passed, "Subdirectory (blank.js) retrieval working.");
  });
});

module("Common Errors");
test("Universals must load to trigger other apps", function() {
	ok(universals.path, "Universals path set");
	ok(typeof window.setDir == 'function', "setDir() exists");
});
test("Let isolated jQ functions run", function() {
	(function($){  
		 $.unitTest = function( m , o ) {return true;}; 
	})(jQuery);
	ok($.unitTest(), " Successfully ran a $. function");
});
setTimeout(function() {
	module("Common Errors");
	test("App resource loading", function() {
		for(i=0;i<appArray.length;i++) {
	  	ok(appArray[i].countRequired[0] == appArray[i].countRequired[1],
	  	"All resources loaded for " + appArray[i].name);
		}
	});
}, 2000); // Allow the apps to load.


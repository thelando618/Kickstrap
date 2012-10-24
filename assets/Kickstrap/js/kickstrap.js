// Kickstrap.js
// Adam Kochanowicz
//
// VARIABLES
// =========
//
// Some of the magic done by kickstrap is done by placing encoded javascript in
// the content attributes of script elements. However, not all browsers behave
// friendly when doing this.
//
// 1. contentHack.selector
//
// To manage compatibility, Kickstrap will determine whether it should use the
// 'content' attribute (valid and preferred) or the fake 'ie8' attribute.
// 
// 2. contentHack.parse
//
// As if this weren't enough, sometimes neither method works and Kickstrap will
// have to manually parse the stylesheet. It's a last resort.

var contentHack = {
	selector: 'content',
   parse: false
};
var self = this, 									// Used to set context in $.ajax
    configPath,
    appArray = [],
    universalsSet = false,
    readyFired = false,  					// Prevents multiple ajax calls from calling the kickstrap.ready() fxs
    appCheck = false, 						// Prevents a false positive for kickstrap.ready()
    thisVersion = "1.2.0 Beta", 	      // Don't change this! Used to check for updates with updater app
    diagnosticMsgs = []; 					// Array of helpful messages for user to use in diagnosing errors

// KICKSTRAP NAMESPACE
// ===================

// If the user is not using page-level apps:
// Let's create everything as an empty var. This way, we
// can concatenate to it later in the code without repetitively
// checking how we defined it in the first place.

if (!kickstrap)                  		{ var kickstrap = { }; }
if (!kickstrap['opts'])             { kickstrap['opts'] = {} }
if (!kickstrap.opts['apps'])        { kickstrap.opts['apps'] = [] }
if (!kickstrap.opts['rootDir'])     { kickstrap.opts['rootDir'] = '/' }
if (!kickstrap.opts['console'] || typeof kickstrap.opts['console'] != 'boolean') { kickstrap.opts['console'] = false }


kickstrap['hello'] = 'Kickstrap: Hi! (' + thisVersion + ')',
kickstrap['edit'] = function() {
   document.body.contentEditable='true'; document.designMode='on'; void 0;
   if(typeof window.$.pnotify == 'function') {
      $.pnotify({
         title: 'Prototyping Mode',
         text: 'You can now edit anything in this page. (But it won\'t be saved!)',
         type: 'success',
         styling: 'bootstrap'
      });
   }
   else { consoleLog('You can now edit anything in this page. (But it won\'t be saved!'); }
},
kickstrap.readyFxs = [],
kickstrap.ready = function(customFn) {this.readyFxs.push(customFn)},
kickstrap.testParams = { readyCount: 0 }

// FUNCTIONS
// =========

// consoleLog is a simple substitute for JavaScript's native console.log.
// There a couple advantages to doing this:
// 1. All Kickstrap-related logs go through it, so it can be uniformly turned
//    on or off.
// 2. Logs are prefixed with "Kickstrap:" to easily distinguish Kickstrap
//    messages from those created au natural.

function consoleLog(msg, msgType, objName) { 
   var prefix = 'Kickstrap: '
   if (kickstrap.opts.console && window.console) {
      if ( objName ) console.log([msg, objName])
      else {
         switch(msgType) { 
            case 'warn': 
            console.warn(prefix + msg)
            break
            
            case 'error':
            console.error(prefix + msg)
            break
            
            default:console.log(prefix + msg)
            break
         }
      }
   }
}

// Allow overrides of directories.
function setDir(newDir, dirType) {
   if (dirType == 'root') {
      // Give js defs preference
      kickstrap.opts.rootDir = (kickstrap.opts.rootDir || newDir)
   }
	 if (dirType == 'universal') {
			kickstrap.opts.universals = (kickstrap.opts.universals || newDir)
	 }
}

// For reading commented-out items
String.prototype.isIgnored = function () {return (this.substr(0, 2) == "//" || this == "");}

// For reading public items
String.prototype.isPublic = function () {return (this.substr(0, 5) == "http:" || this.substr(0, 6) == "https:");}

// Differentiate JS from CSS dependencies.
String.prototype.isJS = function () {return (this.substr(this.length-3, this.length) == ".js");}

//Modified version of CSV splitter thanks to 
//http://www.greywyvern.com/?post=258
String.prototype.splitCSV = function(sep) {
  for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
  	foo[x] = foo[x].replace(/ /g,''); // Modified to remove spaces from string too.
	    if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
	      if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
	        foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
	      } else if (x) {
	        foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
	      } else foo = foo.shift().split(sep).concat(foo);
	    } else foo[x].replace(/""/g, '"');
  } return foo;
};

// Clears localStorage only.
function clearCache(testVal) {
	// Let's see if the browser has localStorage so this doesn't blow up.
	var hasStorage = ("w" == (localStorage.setItem = "w"));

	if(hasStorage) {
		localStorage.clear();
		consoleLog('Cache has been cleared. Reloading...');
		location.reload(true);
	} // This is the part that actually clears the cache.
	else {
		consoleLog('This browser does not support localStorage.','error');
	}
}

// To make things easier for servers, let's remove ../s whenever possible.
// Haven't needed to use this yet.

/*
if (!String.prototype.unFuckURL) {
    String.prototype.unFuckURL = function () {
		var url = this;
		var base_url = location.href.match(/^(.+)\/?(?:#.+)?$/)[0]+"/";
		if(url.substring(0,2) == "//")
			return location.protocol + url;
		else if(url.charAt(0) == "/")
			return location.protocol + "//" + location.host + url;
		else if(url.substring(0,2) == "./")
			url = "." + url;
		else if(/^\s*$/.test(url))
			return ""; //Empty = Return nothing
		var i=0
		while(/\/\.\.\//.test(url = url.replace(/[^\/]+\/+\.\.\//g,"")));

		// Escape certain characters to prevent XSS
		url = url.replace(/\.$/,"").replace(/\/\./g,"").replace(/"/g,"%22")
				.replace(/'/g,"%27").replace(/</g,"%3C").replace(/>/g,"%3E");
		return url;
    };
}
*/

// There are a couple ways we might do this.
function formatString(str, extensive) {
  str = String(str);

  if (extensive) {
	  str = String(str);
		str=str.replace(/\\'/g,'\'');
		str=str.replace(/\\"/g,'"');
		str=str.replace(/\\0/g,'\0');
		str=str.replace(/\\\\/g,'\\');
		str=str.substring(1,str.length-1);
  }
  else {
		str = str.replace(/['"]/g,'');
	}
  str = str.replace(/br-/ig,';'); // Semicolons in the content attr act like the content's semicolon.
	return str;
}

// Thanks http://ejohn.org/blog/javascript-array-remove/
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
} 

// IE compatibility fallbacks, turned on when needed.
// Thanks to http://stackoverflow.com/questions/2790001/fixing-javascript-array-functions-in-internet-explorer-indexof-foreach-etc
if (!('every' in Array.prototype)) {
  Array.prototype.every= function(tester, that /*opt*/) {
    for (var i= 0, n= this.length; i<n; i++)
      if (i in this && !tester.call(that, this[i], i, this))
        return false;
    return true;
  };
}

'use strict';

// Add ECMA262-5 method binding if not supported natively
//
// if (!('bind' in Function.prototype)) {
//     Function.prototype.bind= function(owner) {
//         var that= this;
//         if (arguments.length<=1) {
//             return function() {
//                 return that.apply(owner, arguments);
//             };
//         } else {
//             var args= Array.prototype.slice.call(arguments, 1);
//             return function() {
//                 return that.apply(owner, arguments.length===0? args : args.concat(Array.prototype.slice.call(arguments)));
//             };
//         }
//     };
// }

// Add ECMA262-5 string trim if not supported natively
//
// if (!('trim' in String.prototype)) {
//     String.prototype.trim= function() {
//         return this.replace(/^\s+/, '').replace(/\s+$/, '');
//     };
// }

// Add ECMA262-5 Array methods if not supported natively
//
if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf= function(find, i /*opt*/) {
        if (i===undefined) i= 0;
        if (i<0) i+= this.length;
        if (i<0) i= 0;
        for (var n= this.length; i<n; i++)
            if (i in this && this[i]===find)
                return i;
        return -1;
    };
}
// if (!('lastIndexOf' in Array.prototype)) {
//     Array.prototype.lastIndexOf= function(find, i /*opt*/) {
//         if (i===undefined) i= this.length-1;
//         if (i<0) i+= this.length;
//         if (i>this.length-1) i= this.length-1;
//         for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
//             if (i in this && this[i]===find)
//                 return i;
//         return -1;
//     };
// }
// if (!('forEach' in Array.prototype)) {
//     Array.prototype.forEach= function(action, that /*opt*/) {
//         for (var i= 0, n= this.length; i<n; i++)
//             if (i in this)
//                 action.call(that, this[i], i, this);
//     };
// }
// if (!('map' in Array.prototype)) {
//     Array.prototype.map= function(mapper, that /*opt*/) {
//         var other= new Array(this.length);
//         for (var i= 0, n= this.length; i<n; i++)
//             if (i in this)
//                 other[i]= mapper.call(that, this[i], i, this);
//         return other;
//     };
// }
if (!('filter' in Array.prototype)) {
    Array.prototype.filter= function(filter, that /*opt*/) {
        var other= [], v;
        for (var i=0, n= this.length; i<n; i++)
            if (i in this && filter.call(that, v= this[i], i, this))
                other.push(v);
        return other;
    };
}
// if (!('some' in Array.prototype)) {
//     Array.prototype.some= function(tester, that /*opt*/) {
//         for (var i= 0, n= this.length; i<n; i++)
//             if (i in this && tester.call(that, this[i], i, this))
//                 return true;
//         return false;
//     };
// }

// Those with IE shall be marked.
var ver = getInternetExplorerVersion();
if (ver > -1)
{
  if ( ver < 9.0) { contentHack.selector = 'ie8'; }
  else { contentHack.selector = 'content'; }
}	
function getInternetExplorerVersion() {
  var rv = -1; // Return value assumes failure.
  if (navigator.appName == 'Microsoft Internet Explorer')
  {
    var ua = navigator.userAgent;
    var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat( RegExp.$1 );
  }
  return rv;
}

// The five second test, if your site doesn't load in 5 seconds, you've got problems.
setTimeout(function() {
		if (!readyFired) {
		  consoleLog('I noticed your page still hasn\'t loaded.')
			// Show the diagnostic messages. Placed here to insure they happen once each.
			for (var i = 0;i<diagnosticMsgs.length;i++) { consoleLog(diagnosticMsgs[i], 'error') }
		  if (!kickstrap.opts.readyOverride) {
		  	consoleLog('If you want kickstrap.ready() to fire anyway, set kickstrap.opts.readyOverride to true.')
		  }
		  else {
			  //readyFired = true; 
			  kickstrap.fire();
		  }
		}
}, 5000);

function themeFunction(urlPath) {$.ajax({type: "GET", url: kickstrap.opts.rootDir + 'Kickstrap/themes/' + urlPath + '/functions.js', dataType: "script", context: self});}

// BEGIN
// =====

// Look for script#app and get app list
setupKickstrap();

function setupKickstrap() {
	if($('#appList').css('content') == 'normal' || $('#appList').css('content') == undefined) {
		contentHack.selector = 'ie8';
		if ($('#appList').css('ie8') == undefined ||
		$('#appList').css('ie8') == '') {
		  var writeScripts = '';
		  contentHack.parse = true; 
			for(var i = 0; i < document.styleSheets.length; i++) {
			  for (var j = 0; j < document.styleSheets[i].rules.length; j++) {
				var selector = document.styleSheets[i].rules[j].selectorText;
				if (selector == "#appList") {
				  kickstrap.opts.apps = kickstrap.opts.apps.concat(formatString(document.styleSheets[i].rules[j].style.content, true).splitCSV());
				}
				else if (selector == "script#rootDir" || selector == "script#console" || selector == "script#caching") {
				  writeScripts += formatString(document.styleSheets[i].rules[j].style.content, true);
				  //if(selector == "script#caching") initKickstrap();
				}
			  }
			}
			document.write(writeScripts);
		}
	};
	document.write('<script id="rootDir" type="text/javascript">appendMagic(\'#rootDir\');</script><script id="themeFunctions">appendMagic(\'#themeFunctions\');</script><script id="console" type="text/javascript">appendMagic(\'#console\');</script><script id="caching" type="text/javascript">appendMagic(\'#caching\');initKickstrap();</script>');
}

// The appendMagics we just created will need this.
function appendMagic(newAppendee) {
  if (!contentHack.parse) {
		var scriptString = formatString($(newAppendee).css(contentHack.selector), true);
		if (scriptString == 'ndefine' || scriptString == 'on') {scriptString = '<script></script>'}; 
		// (above) Prevents "[u]ndefine[d]" from being printed when the appended script is removed.
		document.write(scriptString);
	}
}

// The last appendMagic will call this function and get things started.
function initKickstrap() {
	// Allow the user to skip universals loading
  if (!universalsSet && kickstrap.opts.universals == "none") universalsSet = true;
  if (universalsSet) {
    if (!contentHack.parse) { // In which case we already have the app list.
	    kickstrap.opts.apps = kickstrap.opts.apps.concat((formatString($('#appList').css(contentHack.selector))).splitCSV()); // Get list
	  }
	  // Remove duplicates from array
	  // Thanks http://stackoverflow.com/questions/9229645/remove-duplicates-from-javascript-array
		kickstrap.opts.apps = kickstrap.opts.apps.filter(function(elem, pos) {
		    return kickstrap.opts.apps.indexOf(elem) == pos;
		})
	  
	  // TODO: If there are no apps, fire kickstrap.ready()
		for(i = 0;i<kickstrap.opts.apps.length;i++) 
		{
		  theapp = kickstrap.opts.apps[i];
			if (theapp.isIgnored()) {
			  // Remove commented items from list.
				kickstrap.opts.apps.remove(i);
				i--;
			}
			else {
			  // Make each app an app object
				window[kickstrap.opts.apps[i]] = new app(theapp);
			}
		}
	}
	else {
	  universal = new app("universal");
	}
}

function cssIfy(filePath) { // Global so ks-window pages can use this.
  var linkElement = document.createElement("link");
  linkElement.setAttribute("rel", "stylesheet");
  linkElement.setAttribute("type", "text/css");
  linkElement.setAttribute("href", filePath);
  document.getElementsByTagName('body')[0].appendChild(linkElement);
}

/*
You ask me why I dwell in green mountains
I smile and make no reply 
for my heart is free of care.

As the peach blossom flows downstream
and is gone into the unknown

I have a world apart that is not among men.
*/

function app(x) {
  // Set up the app object's parts
  this.resourcesRequired = [];
  this.resourcesDependent = [];
  this.countRequired=[999,0]; // Starting w/ 999 insures a false "complete" positive does not occur (0 == 0)
  this.countDependent=[999,0];
  this.name = x;
  this.loaded = false;
  configPath = kickstrap.opts.rootDir + "Kickstrap/apps/";
  this.configPath = configPath + x + '/config.ks';
  // Override if user wants CDN-hosted config.ks files.
  if (x.substring(0, 5) == "http:" || x.substring(0,6) == "https:") { this.configPath = x; }
  if(!universalsSet && kickstrap.opts.universals != "local" && kickstrap.opts.universals != undefined) 
  {this.configPath = kickstrap.opts.universals + '/universal/config.ks'}
  // Now open config and fill out the app object structure.
	$.ajax({type: "GET", url: this.configPath, dataType: "html", context: self,
		success: function(data) {
		  // config file successfully found, now we'll parse.
			this.resources = data.split(/\r\n|\n/);
			parseConfig(this.resources); // Must be an external function to use variables.
		},
	  error:function (xhr, ajaxOptions, thrownError){
	    // Common error, the user just spelled the name wrong.
	    consoleLog('Could not load the app "' + x + '" [' + xhr.status + ' (' + thrownError + ')]', 'error');
	    diagnosticMsgs.push('Verify your rootDir variable in kickstrap.less or in JavaScript has been set correctly.');
	  }  
	});
	function parseConfig(resources) {
	  // Get the required dependencies and create array.
		var resourcesRequired = resources[0].splitCSV();
		for (i=0;i<resourcesRequired.length;i++) {
		  if(resourcesRequired[i].isIgnored()) { //Splice commented items from array.
		    resourcesRequired.splice(resourcesRequired.indexOf(resourcesRequired[i]), 1);
			}
		}	// Commented items removed, finalize the required items in the app object.
		window[x].resourcesRequired = resourcesRequired;
		// Now look for dependent items.
		if (resources[1]) {
			var resourcesDependent = resources[1].splitCSV();
			for (i=0;i<resourcesDependent.length;i++) {
			  if(resourcesDependent[i].isIgnored()) { //Splice commented items from array.
			    resourcesDependent.splice(resourcesDependent.indexOf(resourcesDependent[i]), 1);
				}
			}
			window[x].resourcesDependent = resourcesDependent;
		}
		appArray.push(window[x]);
		if(!universalsSet) {loadResources()}
    // Test to see if the resources we loaded are equal to the resources we've found.
		if(appArray.length == kickstrap.opts.apps.length) {loadResources();}
	}
	
  function finishUniversals() {
	  universalsSet = true;
    appArray = [];
    initKickstrap();
  }
  
	function loadResources() {
		if (universalsSet && kickstrap.opts.apps.length > 0) {appCheck = true;}
		for (var i = 0;i<appArray.length || function() {if(!universalsSet && appArray[0].countRequired[1] == 0){finishUniversals();}}();i++) {
			appArray[i].countRequired[0] = 0;
         consoleLog('Kickstrap: ' +  appArray[i].name, null, appArray[i]); // Tell the user what we're loading.
		  for (var j = 0;j<appArray[i].resourcesRequired.length;j++) {
		  
		    var requiredResource = appArray[i].resourcesRequired[j];
		    var filePath = configPath + appArray[i].name + '/' + requiredResource;
		    // Override filePath if public.
		    if(requiredResource.isPublic()) {filePath = requiredResource;}
		    if(!requiredResource.isIgnored()) {
			    if(requiredResource.isJS()) {
			      // Load JS
						$.ajax({type: "GET", url: (filePath), dataType: "script", context: this, 
						  beforeSend: function(jqXHR, settings) {
						    jqXHR.thisIs = appArray[i];
						    jqXHR.thisIs.countRequired[1]++;
						  },
						  success: function(data, textStatus, jqXHR) {
						    var currentObj = jqXHR.thisIs;
						    currentObj.countRequired[0]++; // Like teenagers, XMLHttpRequests have a way of not calling if they come home late.

						    if(currentObj.countRequired[0] == currentObj.countRequired[1]) {
						      if(!universalsSet) {
							      universalsSet = true;
							      appArray = [];
							      initKickstrap();
							      universal.countDependent = [0, 0];
						      }
						      currentObj.countDependent[0] = 0;
						      kickstrapReady(currentObj.name);
							    for (var k = 0;k<currentObj.resourcesDependent.length;k++) {
							      var filePath = configPath + currentObj.name + '/' + currentObj.resourcesDependent[k];
							      if (currentObj.resourcesDependent[k].isPublic()) {filePath = currentObj.resourcesDependent[k];}
							      if(filePath.isJS()) {
								      $.ajax({type: "GET", url: (filePath), dataType: "script", context: this,
										  beforeSend: function(jqXHR, settings) {
										    jqXHR.thisIs = currentObj;
										    jqXHR.thisIs.countDependent[1]++;
										  },
										  success: function(data, textStatus, jqXHR) {
										    var currentObj = jqXHR.thisIs;
										    currentObj.countDependent[0]++;
										    kickstrapReady(currentObj.name);
										  }
										  });
							      }
							      else {
							       currentObj.countDependent[0]++;
							       currentObj.countDependent[1]++;
							       cssIfy(filePath);
							      };
							    }
						    }
						  }
						});
					}
					else {
					  // Make CSS Link
					  appArray[i].countRequired[0]++;
					  appArray[i].countRequired[1]++;
					  cssIfy(filePath);
					}
				}
			}
		}
	}
}

function kickstrapReady(myNameIs) {

	// Fire fire() only if all the resource counts match
	if (appCheck) {
		this.loadedLoop = []; // Store loaded = false/true vals in array to validate.
		for(var i = 0;i<appArray.length || function(){if(this.loadedLoop.every(Boolean))kickstrap.fire()}();i++) {
			var appR = appArray[i].countRequired;
			var appD = appArray[i].countDependent;
			
			if (appR[0] == appR[1] && appD[0] == appD[1]) { appArray[i].loaded = true; }
			else {appArray[i].loaded = false;}
			this.loadedLoop.push(appArray[i].loaded);
			//console.log(this.loadedLoop + ' ' + myNameIs + ' ' + appR + ' ' + appD); // For debugging
		}
	}
}
kickstrap.fire = function() {
	if (!readyFired) {
		readyFired = true;
  	kickstrap.testParams.readyCount++;
  	consoleLog('Executing kickstrap.ready() functions');
		for (var i = 0;i<kickstrap.readyFxs.length;i++) { // This allows the user to use this function all over the place.
			(kickstrap.readyFxs[i])(); // Go to the next function in array and fire.
		}
	}
}

/*
When people see some things as beautiful,
other things become ugly.
When people see some things as good,
other things become bad.

Being and non-being create each other.
Difficult and easy support each other.
Long and short define each other.
High and low depend on each other.
Before and after follow each other.

Therefore the Master
acts without doing anything
and teaches without saying anything.
Things arise and she lets them come;
things disappear and she lets them go.
She has but doesn't possess,
acts but doesn't expect.
When her work is done, she forgets it.
That is why it lasts forever.
*/

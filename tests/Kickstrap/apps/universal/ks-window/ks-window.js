$('body').append('<div id="stackSet"></div>');

var openDiv = '<div style="display:none;" class="ks-window ';
var closeDiv = '"><div id="toolbar"><div class="top"><div id="lights"><div class="light red"><div class="glyph">&#215;</div><div class="shine"></div><div class="glow"></div></div><div class="light yellow"><div class="glyph">-</div><div class="shine"></div><div class="glow"></div></div><div class="light green"><div class="glyph">+</div><div class="shine"></div><div class="glow"></div></div></div><div id="title">Kickstrap</div></div><div class="bottom"><div id="nav"><div class="control_box"><div class="control back"><div>&#x25C0;</div></div><div class="control forward"><div><!--&#x25B6;-->&#x25C0;</div></div></div></div><div id="view"><div class="control_box"><div class="control" name="grid"><div class="grid"><div class="square"></div><div class="square"></div><div class="square"></div><div class="square"></div></div></div><div class="control active" name="list"><div class="list"><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div></div></div><div class="control" name="column"><div class="column"><div class="row"></div><div class="row"></div><div class="row"></div></div></div><div class="control" name="coverflow"><div class="coverflow"><div class="large"></div><div class="medium"></div><div class="center"></div><div class="medium"></div><div class="large"></div></div></div></div></div></div></div><div id="body"><img src="'+rootDir+'Kickstrap/apps/universal/ks-window/ajax-loader.gif" style="position: absolute; top: 50%; left: 50%; height:15px; margin-top: -7px; width: 128px; margin-left: -64px;"/><!--iframe src="/Kickstrap/apps/universal/ks-window/loading.html"></iframe--></div><div id="foot"><div class="handle"><div class="grip">|||</div></div></div></div>';

function loadWindow(options, testing) {window[options.name] = new kswindow(options, testing);}

var myHeight;
if (typeof(window.innerHeight) == 'number') {
	// Non-IE
	myHeight = window.innerHeight;
}
else if (document.documentElement && document.documentElement.clientHeight) {
	// IE 6+ in 'standards compliant mode'
	myHeight = document.documentElement.clientHeight;
}
	// Need these appear here to be tested in qUnit.
	function toggleWindow(obj) {
		obj.count != null ? obj.count = !obj.count : obj.count = true; // Toggle value
		obj.count ? maximizeWindow(obj) : minimizeWindow(obj);
	}
	function maximizeWindow(obj) {
		$(obj).closest('.ks-window').addClass('full-size');
		$('.ks-window.full-size #body').css('height', myHeight-54);
	}
	function minimizeWindow(obj) {
		$(obj).closest('.ks-window').removeClass('full-size');
		$('.ks-window.full-size').css('height', '100%');
	}
	
function kswindow(options, testing) {
  var rnd = Math.floor(Math.random()*1001);
  var settings = {
    name: 'kickstrap-'+rnd,
	  theUrl: 'http://getkickstrap.com',
	  width: '800',
	  height: '500',
	  top: '50%',
	  left: '50%',
	  title: '',
	  iframe: false,
	  maximize: false,
	  cache: false
  }

  
	for (var key in settings) {
		if(options[key] != undefined) {
			settings[key] = options[key];
		};
	}
	if (testing) {
		this.settings = settings;
		this.count = false;
		return;
	}
	if (!settings.cache) {
		settings.theUrl += '?v=' + rnd;
	}
	// Make it easy for apps to find their own resources
  if ((settings.theUrl).substr(0,5) != "http:" && (settings.theUrl).substr(0,6) != "https:")
	{
	  settings.theUrl = rootDir + 'Kickstrap/apps/' + settings.name + '/' + settings.theUrl;
	}
	if (settings.title == '') {settings.title = settings.name;}
	settings.className = settings.name.replace('\/','');
	if (!testing) {$('#stackSet').append(openDiv + settings.className + closeDiv)};
	
	if (settings.iframe) {
		$('.ks-window.'+ settings.className + ' iframe')
		.attr('src',settings.theUrl)
		.css('height', settings.height - 54);
	}
	else {
			$.ajax({type: "GET", url: (settings.theUrl), dataType: "html", 
			  success: function(data, textStatus, jqXHR) {
			  	$('.ks-window.'+settings.className + ' #body').html(data)
			  	.css('height', settings.height - 54)
			  	.css('margin-bottom', '0');
			  	localStorage.clear();
			  }
			});
		
	}
	$('.ks-window.'+ settings.className)		
	  .css('width',settings.width)
		.css('height', settings.height)
		.css('margin-left', -settings.width/2)
		.css('margin-top', -settings.height/2)
		.css('top',settings.top)
		.css('left',settings.left)
		.show();
	$('.ks-window.'+ settings.className +' #title').text(settings.title);

	// "Stack" is rumored to be deprecated in future releases of jQUI
	$("#stackSet .ks-window").draggable({ stack: "#stackSet .ks-window" });
	
	// Close 
	$('.light.red').click(function() {
		$(this).closest('.ks-window').hide();
	});
	
	// Minimize
	$('.light.yellow').toggle(function() {
	  var ksWindow = $(this).closest('.ks-window');
		ksWindow.children('#body').slideUp('fast');
		ksWindow.css('height','auto');
	},
	function() {
	  var ksWindow = $(this).closest('.ks-window');
		ksWindow.children('#body').slideDown('fast');
	});
	
	// Maximize...not ready yet.
	$('.ks-window div#title').dblclick(function() {
		toggleWindow(this);
	});
	$('.light.green').click(function() {toggleWindow(this)});
}
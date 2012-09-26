#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')
  , prod  = process.argv[2] == 'production'
  , test  = process.argv[2] == 'test'
  , title = 'Kickstrap'

var appLayout
var publishDir = 'html'
var appList = '<section><div class="row">'
var appCount = 0

var theApps = [{
      'appName': 'Bootstrap',
      'appUrl': 'http://twitter.github.com/bootstrap',
      'appPrice': 'Free',
      'appDesc': 'Use either the entire Bootstrap.js library minimized or individual components as apps. Please note, this download contains the necessary directories and config.ks files but requires you to have Bootstrap in Kickstrap/bootstrap.'
   },
   {
      'appName': 'Chosen',
      'appUrl': 'http://harvest.github.com/chosen',
      'appPrice': 'Free',
      'appDesc': 'Chosen is a JavaScript plugin that makes long, unwieldy select boxes much more user-friendly.'
   },
   {
      'appName': 'Fokus',
      'appUrl': 'http://lab.hakim.se/fokus/',
      'appPrice': 'Free',
      'appDesc': 'Fokus uses JavaScript to emphasize anything you select by covering the rest of the page with semi-transparent black. Try it out by selecting this paragraph or the sample content below. You\'ll see the entire page fade out while this text is highlighted.'
   },
   {
      'appName': 'Color Schemer',
      'appUrl': 'http://netdna.getkickstrap.com/docs/1.1/#color-schemer',
      'appPrice': 'Free',
      'appDesc': 'Colorschemer was formerly being tested as an inherent function in Kickstrap, later turned into an app to reduce file size. Color schemer automatically generates analogue, mono, split complement, triad, and tetrad color schemes and will convert colors between hex, hsl, hsv, and rgb all from the command line. For convenience, this will also print a floating set of square previews right in your website. Great for picking color schemes and editing your theme.'
   },
   {
      'appName': 'Firebug Lite',
      'appUrl': 'http://getfirebug.com',
      'appPrice': 'Free',
      'appDesc': 'Need to debug your site in a browser with no native inspector? Firebug Lite is the Javascript version of the popular debugging tool for Firefox. This means it runs in any browser...even IE6.'
   },
   {
      'appName': 'Hammer.js',
      'appUrl': 'http://eightmedia.github.com/hammer.js',
      'appPrice': 'Free',
      'appDesc': 'Hammer.js is a Javascript library for multitouch gestures. Only 2kb (minified and gzipped), completely standalone.'
   },
   {
      'appName': 'jQuery Lint',
      'appUrl': 'http://james.padolsey.com/javascript/jquery-lint',
      'appPrice': 'Free',
      'appDesc': 'jQuery Lint is a simple script you can download and use with jQuery. It works over the top of jQuery and dilligently reports errors and any incorrect usage of jQuery. It will also, to some extent, offer guidance on best practices and performance concerns.'
   },
   {
      'appName': 'Knockout.js',
      'appUrl': 'http://knockoutjs.com',
      'appPrice': 'Free',
      'appDesc': 'Knockout simplifies dynamic JavaScript UIs by applying the MVVM (Model-View-View-Model) pattern. Easily associate DOM elements with model data using a concise, readable syntax, when your data model\'s state changes, your UI updates automatically. Implicitly set up chains of relationships between model data, to transform and combine it. Quickly generate sophisticated, nested UIs as a function of your model data.'
   },
   {
      'appName': 'Mousetrap.js',
      'appUrl': 'http://craig.is/killing/mice',
      'appPrice': 'Free',
      'appDesc': 'Mousetrap is a simple library for handling keyboard shortcuts in JavaScript.'
   },
   {
      'appName': 'Pines Notify',
      'appUrl': 'http://pinesframework.org/pnotify',
      'appPrice': 'Free',
      'appDesc': 'Pines Notify is a JavaScript notification plugin, developed by Hunter Perrin as part of Pines. It is designed to provide an unparalleled level of flexibility, while still being very easy to implement and use.'
   },
   {
      'appName': 'QUnit',
      'appUrl': 'http://qunitjs.com',
      'appPrice': 'Free',
      'appDesc': 'QUnit is a powerful, easy-to-use JavaScript unit test suite. It\'s used by the jQuery, jQuery UI and jQuery Mobile projects and is capable of testing any generic JavaScript code, including itself!'
   },
   {
      'appName': 'Raphael.js',
      'appUrl': 'http://raphaeljs.com',
      'appPrice': 'Free',
      'appDesc': 'Raphaël is a small JavaScript library that should simplify your work with vector graphics on the web. If you want to create your own specific chart or image crop and rotate widget, for example, you can achieve it simply and easily with this library.'
   },
   {
      'appName': 'Updater',
      'appUrl': 'http://getkickstrap.com/docs/1.1/',
      'appPrice': 'Free',
      'appDesc': 'Another Kickstrap native app, Updater just checks our server for updates for your Kickstrap installation and gives you a link to the upgrade page if an upgrade is necessary. Updater will try first to give you notifications through the Pines Notify app but falls back to the console if not running.'
   },
]

// duplicate appName as a formatted lowercase string and shove it in.
theApps.forEach(function(name) {
   name['appSlug'] = name['appName'].replace(/ /g,'').replace(/\./g,'').toLowerCase();
})

// compile app layout template
appLayout = fs.readFileSync(__dirname + '/assets/templates/appLayout.mustache', 'utf-8')
appLayout = hogan.compile(appLayout, { sectionTags: [{o:'_i', c:'i'}] })

// cram app details into single layouts.
theApps.forEach(function (name) {
   appList +=  appLayout.render(name)
   appCount++
   if (appCount%3 == 0) appList += '</div></section><section><div class="row">'
}) 

module.exports = {
   appList: appList
};

#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')
  , prod  = process.argv[2] == 'production'
  , test  = process.argv[2] == 'test'
  , title = 'Kickstrap'

var themeLayout
var publishDir = 'html'
var themeList = '<section><div class="row">'
var themeCount = 0

var theThemes = [{
      'themeName': 'Serenity',
      'themeUrl': 'http://getkickstrap.com/themes',
      'themePrice': 'Free',
      'themeDesc': 'A pretty theme we\'ve been playing around with. Best on the impressionist UI from DesignModo'
   }
]

// duplicate themeName as a formatted lowercase string and shove it in.
theThemes.forEach(function(name) {
   name['themeSlug'] = name['themeName'].replace(/ /g,'').replace(/\./g,'').toLowerCase();
})

// compile theme layout template
themeLayout = fs.readFileSync(__dirname + '/assets/templates/themeLayout.mustache', 'utf-8')
themeLayout = hogan.compile(themeLayout, { sectionTags: [{o:'_i', c:'i'}] })

// cram theme details into single layouts.
theThemes.forEach(function (name) {
   themeList +=  themeLayout.render(name)
   themeCount++
   if (themeCount%4 == 0) themeList += '</div></section><section><div class="row">'
}) 

module.exports = {
   themeList: themeList
};

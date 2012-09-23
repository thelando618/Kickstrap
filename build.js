#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')
  , prod  = process.argv[2] == 'production'
  , test  = process.argv[2] == 'test'
  , title = 'Kickstrap'

var layout, pages, apps
var publishDir = 'html'
var appList = '<section><div class="row">'
var appCount = 0

// compile layout template
layout = fs.readFileSync(__dirname + '/assets/templates/layout.mustache', 'utf-8')
layout = hogan.compile(layout, { sectionTags: [{o:'_i', c:'i'}] })

// retrieve pages
pages = fs.readdirSync(__dirname + '/assets/templates/pages')

// retrieve apps 
apps = fs.readdirSync(__dirname + '/assets/templates/apps')

// combine apps html pieces
apps.forEach(function (name) {

   if (!name.match(/\.mustache$/)) return

   var app = fs.readFileSync(__dirname  + '/assets/templates/apps/' + name, 'utf-8')
    , context = {}

   appList += app
   appCount++
   if (appCount%3 == 0) appList += '</div></section><section><div class="row">'
   
})

// iterate over pages
pages.forEach(function (name) {

  if (!name.match(/\.mustache$/)) return

  var page = fs.readFileSync(__dirname  + '/assets/templates/pages/' + name, 'utf-8')
    , context = {}

  context[name.replace(/\.mustache$/, '')] = 'active'
  context._i = true
  context.production = prod
  context.test = test
  context.title = name
    .replace(/\.mustache/, '')
    .replace(/\-.*/, '')
    .replace(/(.)/, function ($1) { return $1.toUpperCase() })

  if (context.title == 'Index') {
    context.title = title
  } 
  else {
    context.title += ' á ' + title
  }

  page = hogan.compile(page, { sectionTags: [{o:'_i', c:'i'}] })
  page = layout.render(context, {
    body: page,
    applist: appList
  })

  fs.writeFileSync(__dirname + '/' + publishDir + '/' + name.replace(/mustache$/, 'html'), page, 'utf-8')
})


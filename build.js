#!/usr/bin/env node
var hogan = require('hogan.js')
  , fs    = require('fs')
  , prod  = process.argv[2] == 'production'
  , test  = process.argv[2] == 'test'
  , title = 'Kickstrap'

var layout, pages, apps, layoutGh, exampleLayout, examplePages
var publishDir = 'html'
var appList = '<section><div class="row">'
var appCount = 0

// compile layout template
layout = fs.readFileSync(__dirname + '/assets/templates/layout.mustache', 'utf-8')
layout = hogan.compile(layout, { sectionTags: [{o:'_i', c:'i'}] })

// compile layout template
layoutGh = fs.readFileSync(__dirname + '/assets/templates/layoutGh.mustache', 'utf-8')
layoutGh = hogan.compile(layoutGh, { sectionTags: [{o:'_i', c:'i'}] })

// compile example layout template
exampleLayout = fs.readFileSync(__dirname + '/assets/templates/exampleLayout.mustache', 'utf-8')
exampleLayout = hogan.compile(exampleLayout, { sectionTags: [{o:'_i', c:'i'}] })

// retrieve pages
pages = fs.readdirSync(__dirname + '/assets/templates/pages')

// retrieve example pages
examplePages = fs.readdirSync(__dirname + '/assets/templates/examplePages')

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


// iterate over example pages
examplePages.forEach(function (name) {

  if (!name.match(/\.mustache$/)) return

  var page = fs.readFileSync(__dirname  + '/assets/templates/examplePages/' + name, 'utf-8')
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
  page = exampleLayout.render(context, {
    body: page 
  })

  fs.writeFileSync(__dirname + '/' + publishDir + '/examples/' + name.replace(/mustache$/, 'html'), page, 'utf-8')
})

// Make the special index.html page for GitHub

  var indexPage = fs.readFileSync(__dirname  + '/assets/templates/pages/index.mustache', 'utf-8')
    , context = {}


  //context[name.replace(/\.mustache$/, '')] = 'active'
  context._i = true
  context.production = prod
  context.test = test
  context.title = 'indexGh'
    .replace(/\.mustache/, '')
    .replace(/\-.*/, '')
    .replace(/(.)/, function ($1) { return $1.toUpperCase() })

  context.title = title

  page = hogan.compile(indexPage, { sectionTags: [{o:'_i', c:'i'}] })
  page = layoutGh.render(context, {
    body: indexPage
  })


fs.writeFileSync(__dirname + '/' + publishDir + '/indexGh.html', page, 'utf-8')

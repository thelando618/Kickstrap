module('kickstrap tree')

/* Kickstrap tree should contain the following elements:
 * - opts
 *   - apps
 *   - rootDir
 */

// This should pass it.
/*
ks.opts = {
   'apps': ['something', 'something else'],
   'rootDir': '/'
}
*/
module('Backwards compatibility')
var a;
kickstrap.ready(function() {
   a = true;
});
ks.ready(function() {
   test('kickstrap.ready sets variable \'a\' to \'true\'.', function() {
      ok( typeof(window.a) == 'boolean', 'the boolean \'a\' was created.') 
   })
});
module('Post-kickstrap load')
ks.ready(function() {
   test('ks.opts components created', function() {
      ok(
         (typeof(window.ks.opts)         == 'object'), 
         'ks.opts should be an object.'
      )
      ok(
         (typeof(window.ks.apps)    == 'object'), 
         'ks.apps should be an object.'
      )
      ok(
         (typeof(window.ks.opts.rootDir) == 'string'), 
         'ks.opts.rootDir should be a string.'
      )
      ok(
         (typeof(window.ks.opts.console) == 'boolean'), 
         'ks.opts.console should be a boolean.'
      )
   });
})

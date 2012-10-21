module('kickstrap tree')

/* Kickstrap tree should contain the following elements:
 * - opts
 *   - apps
 *   - rootDir
 */

// This should pass it.
/*
kickstrap.opts = {
   'apps': ['something', 'something else'],
   'rootDir': '/'
}
*/

module('Post-kickstrap load')
kickstrap.ready(function() {
   test('kickstrap.opts components created', function() {
      ok(
         (typeof(window.kickstrap.opts)         == 'object'), 
         'kickstrap.opts should be an object.'
      )
      ok(
         (typeof(window.kickstrap.opts.apps)    == 'object'), 
         'kickstrap.opts.apps should be an object.'
      )
      ok(
         (typeof(window.kickstrap.opts.rootDir) == 'string'), 
         'kickstrap.opts.rootDir should be a string.'
      )
   });
})

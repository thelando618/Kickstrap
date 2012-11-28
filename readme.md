<p>You're looking at Kickstrap's source files. Were you looking for the <a href="http://getkickstrap.com">docs and/or main Kickstrap download</a> instead?</p>
<h1>About this repository</h1>
<p>Please refer to the <strong>product</strong> folder for the latest build of Kickstrap.</p>
<p>At the root level, these files are used for organizing the templates and build scripts which automatically compile Kickstrap.</p>
<p>To build from the latest source, open the root of this repository in a terminal and run <code>make</code></p>
<p>You can also compile only the test folder with <code>make test</code> or just the production folder with <code>make prod</code></p>
<p>The makefile requires connect, uglify-js, and jshint. Run the following command to install.</p>
<p><code>$ npm install connect uglify-js jshint -g</code></p>
<p>Note, Uglify JS 2 is required.</p>

<h1>Branches and Pull Requests</h1>
<p>There are four main branches for development: <strong>development, canary, beta,</strong> and <strong>stable.</strong></a></p>
<p>All pull requests should be sent to the <strong>development</strong> branch and should be made exclusively in the assets folder.</p>

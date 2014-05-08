(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'subject',
		// dependencies for the test
		deps = [mod, 'should', 'lodash'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(subject, should, _) {
	'use strict';

	describe('subject enumerability', function () {
		it('is fine (:', function () {

			var createObj = subject({});

			var obj = createObj();


			// keys should be none
			var keys = [];

			for (var prop in obj) {
				keys.push(prop);
			}

			keys.should.eql([]);
		});
	});
});

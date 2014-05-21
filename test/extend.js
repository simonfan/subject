(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'subject',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(subject, should) {
	'use strict';

	describe('subject extend', function () {

		it('is fine (:', function () {

			var something = subject({
				initialize: function initialize() {
					this.initializeSomething();
				},
			});

			something.assignProto({
				initializeSomething: function () {},

				sing: function () {
					return 'lalala';
				}
			});

			something.assignStatic({
				someCrazyMethod: function () {}
			});


			var specialThing = something.extend({
				singSpecially: function () {
					return 'special-lalala'
				}
			});


			var specialThingInstance = specialThing();

			specialThingInstance.singSpecially().should.eql('special-lalala');

		});
	});
});

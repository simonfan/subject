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
		it('plain subject should be absolutely clean', function () {

			var createObj = subject();

			var obj = createObj();


			// keys should be empty
			var keys = [];

			for (var prop in obj) {
				keys.push(prop);
			}

			keys.length.should.eql(0);
		});

		it('extend should accept descriptor as second argument', function () {


			// person methods are non enumerable
			var person = subject({
				initialize: function initialize(data) {
					this.name = data.firstName + ' ' + data.lastName;

					this.firstName = data.firstName;
					this.lastName = data.lastName;
				},

				talk: function talk(data) {
					return 'My name is ' + this.firstName;
				},

				name: void(0)

			}, { enumerable: false });


			// but the property 'name' is enumerable.
			var john = person({
				firstName: 'John',
				lastName:  'Banana'
			});

			var jonhKeys = [];

			for (var prop in john) {
				jonhKeys.push(prop);
			}

			jonhKeys.should.eql(['name', 'firstName', 'lastName']);
		})
	});
});

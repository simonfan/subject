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

	describe('subject assign-static', function () {
		beforeEach(function (done) {
			done();
		});

		it('is fine (:', function () {


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

			// define some static methods on person
			person.assignStatic({
				echo: function echo(input) {
					return input;
				},
			});

			// directly set static methods on person (these methods will not be perpetuated);
			person.personOnly = 'personOnly';


			// create subsubject
			var singer = person.extend({

				sing: function sing(song) {
					return 'lalala ' + song + ' lalala';
				}

			}, { enumerable: false });

			// check that the static methods are available on singer
			singer.should.have.property('echo');
			// check that the properties directly defined on person (but not through assignStatic)
			// were not propagated
			singer.should.not.have.property('personOnly');
		});
	});
});

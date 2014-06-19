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

		it('assignStatic(propName, value, descriptor)', function () {
			var person = subject({
				prop1: 'val1',
				prop2: 'val2'
			});

			person.assignStatic('static1', 'static1value');

			person.static1.should.eql('static1value');

			// define a constructor that extends person
			var singer = person.extend({
				prop2: 'singer-val2'
			});

			singer.static1.should.eql('static1value');
		});

		it('assignStatic({ prop: value }, descriptor)', function () {


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

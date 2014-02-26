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

	describe('subject proto-merge', function () {
		beforeEach(function () {
			this.personMethods = {
				initialize: function (data) {
					this.name = data.name;
				},

				sayName: function () {
					return 'My name is ' + this.name;
				},

				introduceSelf: function () {
					return this.sayName() + ' I am somebody.';
				},
			};

			this.person = subject(this.personMethods);

			this.person.proto({
				actions: {
					talk: function talk() {
						return 'bla bla bla'
					},
				}
			})
		})

		it('is fine (:', function () {

			var person = this.person;

			// normal person
			var joe = this.person({
				name: 'Joe'
			});

			joe.actions.talk().should.eql('bla bla bla');


			// add actions to a superhero.
			var superhero = this.person.extend({});
			superhero.protoMerge({
				actions: {
					fly: function () {
						return 'ffffff...';
					},

					explosion: function () {
						return 'BOOM'
					}
				}
			});

			var ana = superhero({ name: 'Ana' });

			// special stuff for ana.
			ana.actions.talk().should.eql(joe.actions.talk());
			ana.actions.explosion().should.eql('BOOM');

			// no special stuff for joe
			joe.actions.should.not.have.property('fly');

			// instantiate a person after the superhero was defined
			var normalGuy = person({
				name: 'Average Joe'
			});

			normalGuy.actions.talk().should.eql('bla bla bla');
			// no special stuff for normal guy
			normalGuy.actions.should.not.have.property('explosion');

		});
	});
});

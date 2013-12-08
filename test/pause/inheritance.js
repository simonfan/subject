(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'../src/subject' :
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

	describe('subject.child', function () {
		beforeEach(function (done) {
			done();
		});

		it('returns a function ...', function () {
			var something = subject.child({});

			something.should.be.type('function');
		});

		it('... that generates an object ...', function () {
			var something = subject.child({}),
				lalala = something({});

			lalala.should.be.type('object');
		});

		it('... that has the methods passed on definition ...', function () {
			var something = subject.child({
					sayName: function(d) {
						return d.name;
					}
				}),
				lalala = something({ name: 'lalala' });

			lalala.sayName.should.be.type('function');
			lalala.sayName().should.eql('lalala');
		});


		it('... and can further child other subjects ...', function () {
			var something = subject.child({
					sayName: function(d) {
						return d.name;
					}
				}),
				anotherThing = something.child({
					sing: function(d) {
						return d.song;
					}
				}),

				lalala = something({ name: 'lalala' }),
				anotherLalala = anotherThing({ name: 'anotherLalala', song: 'laaa' });

			lalala.sayName().should.eql('lalala');
			lalala.should.not.have.property('sing');

			anotherLalala.sayName().should.eql('anotherLalala');
			anotherLalala.sing().should.eql('laaa');
		});

		it('... and the prototype chain is right ...', function() {
			var basicList = subject.child({
					has: _.has
				}),
				complexList = basicList.child({
					push: function(list, value) {
						list.push(value);

						return this;
					},

					shift: function(list) {
						list.shift();

						return this;
					},

					unshift: function(list, value) {
						list.unshift(value);
						return this;
					}
				}),

				customBehaviourList = basicList.child({
					sum: function(list) {
						return _.reduce(list, function(res, val) {
							return res + val;
						}, 0);
					},

					odd: function(list) {
						return _.filter(list, function(value) {
							return value % 2 === 0;
						})
					}
				}),
				extremelyCustomList = customBehaviourList.child(complexList.subject).child({
					sumToEach: function (list, sum) {
						_.each(list, function(value, index) {
							list[index] = value + sum;
						});
					}
				});


			var arr = [10, 20, 30, 40],
				basic = basicList(arr),
				complex = complexList(arr),
				custom = customBehaviourList(arr),
				extremelyCustom = extremelyCustomList([10, 40])


			var methods = {}

			methods.basic = ['has'];
			methods.complex = ['push', 'shift', 'unshift'];
			methods.custom = ['sum', 'odd'];


			// first test basic mehtods
				// have
			_.each(methods.basic, function (method) {
				basic.should.have.property(method);
			})

				// not have
			_.each(_.union(methods.complex, methods.custom), function (method) {
				basic.should.not.have.property(method);
			});

			// complex methods
				// have
			_(methods.complex).union(methods.basic).each(function (method) {
				complex.should.have.property(method);
			});

				// not have
			_(methods.custom).each(function (method) {
				complex.should.not.have.property(method);
			});

			// custom methods
				// have
			_(methods.custom).union(methods.basic).each(function (m) {
				custom.should.have.property(m);
			});

				// not have
			_(methods.complex).each(function (m) {
				custom.should.not.have.property(m);
			});

			_(methods.basic)
				.union(methods.complex)
				.union(methods.custom)
				.union(['sumToEach'])
				.each(function(m) {
					extremelyCustom.should.have.property(m);
				});

		});
	});
});

(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'../src/subject' :
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

	describe('subject.object', function () {

		it('has setters and getters', function () {
			var obj = {
					name: 'Simon',
					age: 21
				},
				object = subject.object(obj);

			object
				.get('age')
				.should.eql(21);

			object
				.get('name')
				.should.eql('Simon');

			object
				.set('name', 'Someone else')
				.get('name')
					.should.eql('Someone else');

			object
				.set('occupation', 'student')
				.equals('occupation', 'student')
					.should.be.true;

			object.equals('age', 20)
				.should.be.false;
		});
	});

	describe('subject.list', function () {

		it('has object methods', function () {
			var arr = ['a','b','c','d'],
				alphabet = subject.list(arr);

			alphabet
				.get(0).should.eql('a');

			alphabet
				.set(2, 'this was c')
				.get(2).should.eql('this was c');

			alphabet.equals(3, 'd').should.be.true;

		});

		it('has basic array methods', function () {
			var arr = [10, 20, 40],
				list = subject.list(arr);

			list.push(100)
				.unwrap().should.eql([10, 20, 40, 100]);

			list.unshift(0)
				.unwrap().should.eql([0, 10, 20, 40, 100]);
		});

	});
});

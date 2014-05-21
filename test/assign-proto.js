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

	describe('subject assign-proto', function () {
		beforeEach(function (done) {
			done();
		});

		it('subject.assignProto(methodName, function () {})', function () {

			var constructor = subject({});

			constructor.assignProto('someMethod', function () {
				return 'something';
			});


			var instance = constructor();

			instance
				.someMethod()
				.should.eql('something');
		});
	});
});

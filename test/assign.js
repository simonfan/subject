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

	describe('subject.assign - auxiliary method to run \'defineProperty\'', function () {
		beforeEach(function (done) {
			done();
		});

		it('sets non writable data', function () {


			var obj = {};

			var nonWritableData = {
				two: 2,
				twice: '2x',
			};


			subject.assign(obj, nonWritableData, {
				writable: false,
			});


			// check that setting nonWritable properties
			// trhows errors
			should.throws(function () { obj.two = 3; });
			should.throws(function () { obj.twice = '4x' });

		});

		it('assign(object, ["key1", "key2", "key3"], { get: ..., set: ... } - accepts accessor descriptors', function () {
			var obj = {};

			obj.getCount = {};
			obj.setCount = {};

			obj.attachedObject = {
				key1: 'attached-v1',
				key2: 'attached-v2',
				key3: 'attached-v3'
			};

			subject.assign(obj, ['key1', 'key2', 'key3'], {
				get: function get(key) {

					var getCount = this.getCount[key];

					// do some fancy side effects..
					this.getCount[key] = getCount ? getCount + 1 : 1;

					return this.attachedObject[key];
				},
				set: function set(key, value) {

					var setCount = this.setCount[key];

					// do some fancy side effects..
					this.setCount[key] = setCount ? setCount + 1 : 1;

					this.attachedObject[key] = value;
				},
			});

			// get
			obj.key1.should.eql('attached-v1');
			obj.key2.should.eql('attached-v2');
			obj.key3.should.eql('attached-v3');

			// set
			obj.key2 = 'modified';
			obj.key2.should.eql('modified');
			obj.attachedObject.key2.should.eql('modified');
			// verify side effects
			obj.setCount.key2.should.eql(1);
			obj.key2 = 'modified again';
			obj.setCount.key2.should.eql(2);

			// get count
			obj.key2;
			obj.getCount.key2.should.eql(3);
		});
	});
});

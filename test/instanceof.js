(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'subject',
		// dependencies for the test
		deps = [mod, 'should', 'backbone'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(subject, should, Backbone) {
	'use strict';

	describe('subject instanceof', function () {


		it('works for objects', function () {

			var base = {
				method1: function () { return 'method1-result' }
			};

			var obj = subject(base);

			var objInstance = obj();
			objInstance.should.be.instanceof(obj);

			obj.prototype.isPrototypeOf(objInstance).should.be.true;



			var extendedObj = obj.extend({});

			var extendedObjInstance = extendedObj();

			extendedObjInstance.should.be.instanceof(obj);
			extendedObjInstance.should.be.instanceof(extendedObj);
			extendedObj.prototype.isPrototypeOf(extendedObjInstance).should.be.true;
			extendedObj.prototype.isPrototypeOf(objInstance).should.be.false;
		});

	});


	describe.skip('', function () {


		it('is fine (:', function () {

			var base = function BaseConstructor() {

			};

			base.prototype.property = 'proto-prop';


			var extended = subject(base);


			var extendedInstance = extended();


			base.prototype.isPrototypeOf(extendedInstance).should.be.true;

			extendedInstance.should.be.instanceof(base);

		});

		it('backbone model', function () {
			var model = subject(Backbone.Model);

			var modelInstance = model({
				name: 'Simon',
				lastName: 'Fan'
			});

			modelInstance.get('name').should.eql('Simon');

			modelInstance.should.be.instanceof(Backbone.Model);
		});

		it('extending using functions', function () {
			var obj = subject({
				method1: function () { return 'method1-result'; },
				method2: function () { return 'method2-result'; }
			});

			var objInstance = obj();

			objInstance.method1().should.eql('method1-result');

			var extendedObj = obj.extend(Backbone.Model);

			var extendedObjInstance = extendedObj();

			extendedObjInstance.should.be.instanceof(Backbone.Model);

			console.log(extendedObjInstance);

			extendedObjInstance.method2().should.eql('method2-result')
		})
	})
});

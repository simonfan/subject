
/* jshint ignore:start */

/* jshint ignore:end */

define('__subject/private/assign',['require','exports','module','lodash'],function (require, exports, module) {
	


	var _ = require('lodash');

		// descriptor for both accessor and data
	var defaultDescriptor = {
			configurable: true,
			enumerable:   true,
		},
		// descriptor for data only.
		defaultDataDescriptor = _.extend({
			writable:     true,
		}, defaultDescriptor);



	/**
	 * Defines properties using accessor descriptor
	 *
	 * @method assignAccessor
	 * @param  {[type]} obj        [description]
	 * @param  {[type]} properties [description]
	 * @param  {[type]} descriptor [description]
	 * @return {[type]}            [description]
	 */
	function assignAccessor(obj, properties, descriptor) {

		// when the descriptor DOES NOT HAVE
		// neither 'get' nor 'set'
		// set defaults for configurable, enumerable and writable.
		_.defaults(descriptor, defaultDescriptor);

		if (_.isArray(properties)) {

			_.each(properties, function (property) {

				// partialize get and set
				// using the property name as first argument.
				var desc = _.extend({}, descriptor);
				if (desc.get) {
					desc.get = _.partial(desc.get, property);
				}

				if (desc.set) {
					desc.set = _.partial(desc.set, property);
				}

				// run defineProperty
				Object.defineProperty(obj, property, desc);
			});

		} else {

			// TODO
			throw new Error('Currently subject.assign does not accept non-array properties for accessor assignment.');
		}
	}

	/**
	 * Defines properties using data descriptors.
	 *
	 * @method assignData
	 * @param  {[type]} obj        [description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} descriptor [description]
	 * @return {[type]}            [description]
	 */
	function assignData(obj, data, descriptor) {

		// when the descriptor HAS
		// either 'get' or 'set'
		// set defaults only for configurable, enumerable
		_.defaults(descriptor, defaultDataDescriptor);


		_.each(data, function (value, property) {

			// set value on descriptor
			var desc = _.assign({ value: value }, descriptor);

			// run defineProperty
			Object.defineProperty(obj, property, desc);
		});
	}

	/**
	 *
	 *
	 * @method assign
	 * @private
	 * @param obj
	 * @param data
	 * @param [descriptor]
	 */
	module.exports = function assign(obj, data, descriptor) {

		if (!descriptor) {
			// simple assigning.
			_.assign(obj, data);

		} else {
			// use defineProperty to assign.

			if (descriptor.get || descriptor.set) {
				// ACCESSOR DESCRIPTOR

				assignAccessor(obj, data, descriptor);

			} else {
				//
				assignData(obj, data, descriptor);
			}
		}

		return obj;
	};

});

/* jshint ignore:start */

/* jshint ignore:end */

define('__subject/public/assign-proto',['require','exports','module','lodash','../private/assign'],function (require, exports, module) {
	


	var _ = require('lodash');

	var assign = require('../private/assign');

	/**
	 * Augments the prototype.
	 *
	 * @method proto
	 */
	module.exports = function assignProto() {

		var extensions, descriptor;

		// [1] parse arguments
		if (_.isObject(arguments[0])) {

			// arguments = [extensions, descriptor];
			extensions = arguments[0];
			descriptor = arguments[1];

		} else if (_.isString(arguments[0])) {
			// arguments = [propertyName, propertyValue, descriptor];

			extensions = {};
			extensions[arguments[0]] = arguments[1];
			descriptor = arguments[2];
		}

		// [2] run extending
		assign(this.prototype, extensions, descriptor);

		return this;
	};
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__subject/public/proto-merge',['require','exports','module','lodash','../private/assign'],function (require, exports, module) {
	


	var _ = require('lodash');

	var assign = require('../private/assign');
	/**
	 * Merges a property into the prototype object
	 * instead of overwriting it.
	 *
	 * @method protoMerge
	 * @param prop {String|Object}
	 * @param [merge] {Object}
	 */
	module.exports = function protoMerge() {

		var original, merge, descriptor;

		if (_.isString(arguments[0])) {
			// merge single property

			// property to be merged
			var prop = arguments[0];

			original   = this.prototype[prop];
			merge      = arguments[1];
			descriptor = arguments[2];

			// run extending
			this.prototype[prop] = assign(_.create(original), merge, descriptor);

		} else {
			// merge multiple properties
			descriptor = arguments[1];
			_.each(arguments[0], _.bind(function (merge, prop) {

				this.protoMerge(prop, merge, descriptor);

			}, this));
		}

		return this;
	};
});

/* jshint ignore:start */

/* jshint ignore:end */

define('__subject/public/extend',['require','exports','module','lodash','../private/assign'],function (require, exports, module) {
	


	var _ = require('lodash');

	// internal
	var assign = require('../private/assign');


	/**
	 * Define a function that when run will return an instance
	 * of its prototype object.
	 *
	 * All arguments passed to the extend method
	 * will be passed on to `this.prototype.extend` method.
	 *
	 * @method extend
	 * @param extensions {Object}
	 */
	module.exports = function extendSubject(extensions, descriptor) {

		// parent
		var parent = this;

		// [1] Declare the child variable.
		var child;

		// [2] Define the child constructor/builder function
		//     that creates an instance of the prototype object
		//     and initializes it.
		if (_.isFunction(extensions)) {

			child = function builder() {

				var instance = _.create(extensions.prototype);
				_.assign(instance, child.prototype);

				extensions.apply(instance, arguments);
				return instance;
			}

		} else {

			child = function builder() {
				var instance = _.create(child.prototype);
				instance.initialize.apply(instance, arguments);

				return instance;
			};
		}

		// [3] Static methods
		assign(child, _.pick(parent, parent.staticProperties), {
			enumerable: false,
		});

		// [4] Set the child function's prototype property
		//     to reference an object created from the parent's prototype
		child.prototype = _.create(parent.prototype);

		// [5] assignProto extensions.
		child.assignProto(extensions, descriptor);


		// [6] references to the constructor
		//     and super  must be set onto the prototype
		assign(child.prototype, {
			// to constructor of the itself
			constructor: child,
			// to parent's prototype.
			__super__: parent.prototype,

		}, { enumerable: false });


		return child;
	};

});

//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

/**
 * Expressive (very :) prototypal inheritance.
 *
 * @module subject
 */

/* jshint ignore:start */

/* jshint ignore:end */

define('subject',['require','exports','module','lodash','./__subject/private/assign','./__subject/public/assign-proto','./__subject/public/assign-proto','./__subject/public/proto-merge','./__subject/public/extend'],function (require, exports, module) {
	


	var _ = require('lodash');


	var assign = require('./__subject/private/assign');


	/**
	 * @class __subject
	 */
	var __subject = function () {};

	/**
	 * The prototype object.
	 * When the __subject function is run, it will
	 * create an instance of `this.prototype` and call its
	 * initialize method.
	 *
	 * @property prototype
	 * @type object
	 */
	__subject.prototype = assign({}, {
		/**
		 * This method will be called before returning
		 * the instance. Put your initialization code here.
		 *
		 * @method initialize
		 */
		initialize: function () {}

	}, { enumerable: false });


	////////////
	// static //
	////////////

	assign(__subject, {


		/**
		 *
		 *
		 *
		 */
		staticProperties: ['proto', 'assignProto', 'protoMerge', 'staticProperties', 'assignStatic', 'extend'],

		/**
		 * Assigns static values.
		 *
		 */
		assignStatic: function assignStatic() {

			// parse out the arguments :)
				// properties to be set
			var properties,
				// array of propertynames
				propertyNames,
				// descriptor used for Object.defineProperty(name, value, descriptor)
				descriptor;

			if (_.isString(arguments[0])) {
				// single property,
				// expect second argument to be the property valu
				// and third argument to be property descriptor
				//
				// arguments = [propertyName, propertyValue, propertyDescriptor]
				properties = {};
				properties[arguments[0]] = arguments[1];
				propertyNames = [arguments[0]];

				descriptor = arguments[2];

			} else if (_.isObject(arguments[0])) {
				// multiple properties
				// arguments = [properties, propertyDescriptor]
				properties = arguments[0];
				propertyNames = _.keys(properties);

				descriptor = arguments[1];
			}

			this.staticProperties = _.union(this.staticProperties, propertyNames);

			return assign(this, properties, descriptor);
		},

		assignProto: require('./__subject/public/assign-proto'),
		proto: require('./__subject/public/assign-proto'),			// alias, for backwards compatibility
		protoMerge: require('./__subject/public/proto-merge'),
		extend: require('./__subject/public/extend'),

	}, { enumerable: false });

	/////////////
	// exports //
	/////////////

	/**
	 * Bind the extend method of the original __subject and export it.
	 * __subject is not accessible to anyone, only instances of it.
	 *
	 */
	module.exports = _.bind(__subject.extend, __subject);

	/**
	 * Assign helper functions directly to the exports,
	 * as the exports is not the extend method by itself,
	 * but actually a bound version returned by _.bind
	 *
	 */
	var helpers = { assign: assign };
	assign(module.exports, helpers, {
		enumerable:   false,
		writable:     false,
		configurable: false
	});
});

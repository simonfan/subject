
/* jshint ignore:start */

/* jshint ignore:end */

define('__subject/private/assign',['require','exports','module','lodash'],function (require, exports, module) {
	


	var _ = require('lodash');

	var defaultDescriptor = {
	//	value:
		configurable: true,
		writable:     true,
		enumerable:   true,
	};

	/**
	 *
	 *
	 * @method assign
	 * @private
	 * @param obj
	 * @param extensions
	 * @param [descriptor]
	 */
	module.exports = function assign(obj, extensions, descriptor) {

		if (!descriptor) {
			// simple assigning.

			return _.assign(obj, extensions);

		} else {
			// use defineProperty to assign.

			// set default values for descriptor
			_.defaults(descriptor, defaultDescriptor);

			_.each(extensions, function (value, property) {

				// set value on descriptor
				var desc = _.assign({ value: value }, descriptor);

			//	console.log('define ' + property);

				// run defineProperty
				Object.defineProperty(obj, property, desc);
			});

			return obj;
		}
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

		} else {
			// arguments = [propertyName, propertyValue, descriptor];

			extensions = ({})[arguments[0]] = arguments[1];
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
		child = function builder() {
			var instance = _.create(child.prototype);
			instance.initialize.apply(instance, arguments);

			return instance;
		};

		// [3] Static methods
		assign(child, _.pick(parent, parent.staticProperties), {
			enumerable: false,
		});

		// [4] Set the child function's prototype property
		//     to reference an object created from the parent's prototype
		child.prototype = _.create(parent.prototype);

		// [5] proto extensions.
		child.proto(extensions, descriptor);


		// [6] references
		assign(child, {
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
		assignStatic: function assignStatic(properties, descriptor) {

			this.staticProperties = _.union(this.staticProperties, _.keys(properties));

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

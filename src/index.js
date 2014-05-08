//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

/**
 * Expressive prototypal inheritance.
 *
 * @module subject
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(['lodash'], function (_) {
	'use strict';





	var defaultDescriptor = {
	//	value:
		configurable: false,
		writable:     true,
		enumerable:   false,
	};

	function extendNonEnumerable(obj, extensions, descriptor) {

		// set default values for descriptor
		descriptor = descriptor || {};
		_.defaults(descriptor, defaultDescriptor);

		_.each(extensions, function (value, key) {

			var d = { value: value };
			_.assign(d, descriptor);

			Object.defineProperty(obj, key, d);

		});

		return obj;
	}



	function argumentsToArray(args) {
		return Array.prototype.slice.call(args);
	}

	/**
	 * The original prototype object.
	 *
	 * @class __prototype
	 * @static
	 */
	var __prototype = {};

	extendNonEnumerable(__prototype, {
		/**
		 * This method will be called before returning
		 * the instance. Put your initialization code here.
		 *
		 * @method initialize
		 */
		initialize: function () {}
	});

	/**
	 * Mock
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
	__subject.prototype = __prototype;


	/**
	 * Augments the prototype.
	 *
	 * @method proto
	 */
	__subject.proto = function proto(first, second) {

		if (_.isObject(first)) {
			_.assign(this.prototype, first);
		} else {
			this.prototype[first] = second;
		}

		return this;
	};

	/**
	 * Merges a property into the prototype object
	 * instead of overwriting it.
	 *
	 * @method protoMerge
	 * @param prop {String|Object}
	 * @param [merge] {Object}
	 */
	__subject.protoMerge = function protoMerge(prop, merge) {

		if (_.isString(prop)) {
			// merge single property

				// retrieve the original object.
			var original = this.prototype[prop],
				// create a "protocopy" of the original
				obj = _.assign({}, original, merge);

			this.proto(prop, obj);

		} else {
			// merge multiple properties

			_.each(prop, _.bind(function (merge, prop) {

				this.protoMerge(prop, merge);

			}, this));
		}
	};


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
	__subject.extend = function extend(extensions, options) {

		// parent
		var parent = this;

		// [1] Declare the child variable.
		var child;

		// [2] Define the child constructor/builder function
		//     that creates an instance of the prototype object
		//     and initializes it.
		child = function builder() {
			var instance = Object.create(child.prototype);
			instance.initialize.apply(instance, arguments);

			return instance;
		};

		// [3] Static methods
		_.assign(child, parent);

		// [4] Set the child function's prototype property
		//     to reference the `nproto`, so that the new prototype may be
		//     further extended.
		child.prototype = Object.create(parent.prototype);
	//	child.prototype.constructor = child;

		// [5] proto extensions.
		child.proto(extensions);



		// define non-enumerable properties
		extendNonEnumerable(child, {
			constructor: child,
			__super__: parent.prototype
		});

		// [6] reference to parent's prototype.
	//	child.__super__ = parent.prototype;

		return child;
	};

	return __subject.extend.bind(__subject);
});

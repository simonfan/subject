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

define(function (require, exports, module) {
	'use strict';


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
	 * @method extend
	 * @private
	 * @param obj
	 * @param extensions
	 * @param [descriptor]
	 */
	function extend(obj, extensions, descriptor) {

		if (!descriptor) {
			// simple extending.

			return _.extend(obj, extensions);

		} else {
			// use defineProperty to extend.

			// set default values for descriptor
			_.defaults(descriptor, defaultDescriptor);

			_.each(extensions, function (value, property) {

				// set value on descriptor
				var desc = _.extend({ value: value }, descriptor);

			//	console.log('define ' + property);

				// run defineProperty
				Object.defineProperty(obj, property, desc);
			});

			return obj;
		}
	}

	/**
	 * The original prototype object.
	 *
	 * @class __prototype
	 * @static
	 */
	var __prototype = {};

	extend(__prototype, {
		/**
		 * This method will be called before returning
		 * the instance. Put your initialization code here.
		 *
		 * @method initialize
		 */
		initialize: function () {}
	}, { enumerable: false });

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



	// static methods
	extend(__subject, {

		/**
		 * Augments the prototype.
		 *
		 * @method proto
		 */
		proto: function proto() {

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
			extend(this.prototype, extensions, descriptor);

			return this;
		},

		/**
		 * Merges a property into the prototype object
		 * instead of overwriting it.
		 *
		 * @method protoMerge
		 * @param prop {String|Object}
		 * @param [merge] {Object}
		 */
		protoMerge: function protoMerge() {

			var original, merge, descriptor;

			if (_.isString(arguments[0])) {
				// merge single property

				// property to be merged
				var prop = arguments[0];

				original   = this.prototype[prop];
				merge      = arguments[1];
				descriptor = arguments[2];

				// run extending
				this.prototype[prop] = extend(_.create(original), merge, descriptor);

			} else {
				// merge multiple properties
				descriptor = arguments[1];
				_.each(arguments[0], _.bind(function (merge, prop) {

					this.protoMerge(prop, merge, descriptor);

				}, this));
			}

			return this;
		},

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
		extend: function extendSubject(extensions, options) {

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
			extend(child, _.pick(parent, ['proto', 'protoMerge', 'extend']), {
				enumerable: false,
			});

			// [4] Set the child function's prototype property
			//     to reference the `nproto`, so that the new prototype may be
			//     further extended.
			child.prototype = Object.create(parent.prototype);
		//	child.prototype.constructor = child;

			// [5] proto extensions.
			child.proto(extensions, options);



			// define non-enumerable properties
			extend(child, {
				constructor: child,
				__super__: parent.prototype,

			}, { enumerable: false });

			// [6] reference to parent's prototype.
		//	child.__super__ = parent.prototype;

			return child;
		},

	}, { enumerable: false });

	return __subject.extend.bind(__subject);
});

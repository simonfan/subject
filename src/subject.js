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

	/**
	 * The original prototype object.
	 *
	 * @class __prototype
	 * @static
	 */
	var __prototype = {
		/**
		 * This method will be called before returning
		 * the instance. Put your initialization code here.
		 *
		 * @method constructor
		 */
		constructor: function () {},

		/**
		 * Takes any number of objects as arguments
		 * and extend the values to this one.
		 * Overwrite this property to have new behaviour
		 * on the next extension.
		 *
		 * @method extend
		 */
		extend: function () {
			var args = Array.prototype.slice.call(arguments);
			args.unshift(this);
			_.extend.apply(_, args);

			return this;
		}
	};

	/**
	 * Returns an instance of the __prototype object.
	 *
	 * This function is a simplified equivalent of
	 * the one returned by `__subject.define`.
	 * The only difference is that constructor method is not invoked.
	 *
	 * @class __subject
	 * @constructor
	 */
	var __subject = function subject() {
		return Object.create(__prototype);
	};

	/**
	 * The prototype object.
	 * When the __subject function is run, it will
	 * create an instance of `this.prototype` and call its
	 * constructor method.
	 *
	 * @property prototype
	 * @type object
	 */
	__subject.prototype = __prototype;


	/**
	 * Define a function that when run will return an instance
	 * of its prototype object.
	 *
	 * All arguments passed to the extend method
	 * will be passed on to `this.prototype.extend` method.
	 *
	 * @method extend
	 */
	__subject.extend = function extend() {

		// [1] Create an instance of 'this.prototype'
		var newprototype = Object.create(this.prototype);

		// [2] Call 'newprototype.extend' passing it all the arguments
		//     with which extend was called.
		//     The 'extend' method is extend
		newprototype.extend.apply(newprototype, arguments);

		// [3] Create a builder function
		//     that creates an instance of the prototype object
		//     and constructors it.
		var builder = function builder() {
			var instance = Object.create(newprototype);
			instance.constructor.apply(instance, arguments);

			return instance;
		};

		// [4] Set the builder function's prototype property
		//     to reference the `newprototype`, so that the new prototype may be
		//     further extended.
		builder.prototype = newprototype;

		// [5] Define an extend
		builder.extend = this.extend;

		return builder;
	};

	return __subject;
});

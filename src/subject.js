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
	 * The original base object.
	 * 
	 * @class __base
	 * @static
	 */
	var __base = {
		/**
		 * This method will be called before returning
		 * the instance. Put your initialization code here.
		 * 
		 * @method initialize
		 */
		initialize: function () {},

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
	 * Returns an instance of the __base object.
	 * 
	 * This function is a simplified equivalent of
	 * the one returned by `__subject.define`.
	 * The only difference is that initialize method is not invoked.
	 * 
	 * @class __subject
	 * @constructor
	 */
	var __subject = function subject() {
		return Object.create(__base);
	};

	/**
	 * The base object.
	 * When the __subject function is run, it will
	 * create an instance of `this.base` and call its
	 * initialize method.
	 * 
	 * @property base
	 * @type object
	 */
	__subject.base = __base;


	/**
	 * Define a function that when run will return an instance
	 * of its base object.
	 * 
	 * All arguments passed to the extend method
	 * will be passed on to `this.base.extend` method.
	 * 
	 * @method extend
	 */
	__subject.extend = function extend() {

		// [1] Create an instance of 'this.base'
		var newbase = Object.create(this.base);

		// [2] Call 'newbase.extend' passing it all the arguments
		//     with which extend was called.
		//     The 'extend' method is extend
		newbase.extend.apply(newbase, arguments);

		// [3] Create a builder function 
		//     that creates an instance of the base object
		//     and initializes it.
		var builder = function builder() {
			var instance = Object.create(newbase);
			instance.initialize.apply(instance, arguments);

			return instance;
		};

		// [4] Set the builder function's base property
		//     to reference the `newbase`, so that the new base may be 
		//     further extended.
		builder.base = newbase;

		// [5] Define an extend
		builder.extend = this.extend;

		// some aliases
		builder.define = builder.extend;

		return builder;
	};

	// aliases
	__subject.define = __subject.extend;

	return __subject;
});
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

	function argumentsToArray(args) {
		return Array.prototype.slice.call(args);
	}

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
		 * @method initialize
		 */
		initialize: function () {},
	};

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
	__subject.proto = function proto(protoProps) {
		_.assign(this.prototype, protoProps);
		return this;
	};

	/**
	 * Define a function that when run will return an instance
	 * of its prototype object.
	 *
	 * All arguments passed to the extend method
	 * will be passed on to `this.prototype.extend` method.
	 *
	 * @method extend
	 */
	__subject.extend = function extend(protoProps, staticProps) {

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
		_.assign(child, parent, staticProps);

		// [4] Set the child function's prototype property
		//     to reference the `nproto`, so that the new prototype may be
		//     further extended.
		child.prototype = Object.create(parent.prototype);
		child.prototype.constructor = child;

		// [5] proto protoProps.
		child.proto(protoProps);

		// [6] reference to parent's prototype.
		child.__super__ = parent.prototype;

		return child;
	};

	return __subject.extend.bind(__subject);
});

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


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

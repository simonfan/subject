/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


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

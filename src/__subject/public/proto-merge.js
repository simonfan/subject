/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


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

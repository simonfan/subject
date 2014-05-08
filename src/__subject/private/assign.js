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

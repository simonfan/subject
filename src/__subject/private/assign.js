/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');

		// descriptor for both accessor and data
	var defaultDescriptor = {
			configurable: true,
			enumerable:   true,
		},
		// descriptor for data only.
		defaultDataDescriptor = _.extend({
			writable:     true,
		}, defaultDescriptor);



	/**
	 * Defines properties using accessor descriptor
	 *
	 * @method assignAccessor
	 * @param  {[type]} obj        [description]
	 * @param  {[type]} properties [description]
	 * @param  {[type]} descriptor [description]
	 * @return {[type]}            [description]
	 */
	function assignAccessor(obj, properties, descriptor) {

		// when the descriptor DOES NOT HAVE
		// neither 'get' nor 'set'
		// set defaults for configurable, enumerable and writable.
		_.defaults(descriptor, defaultDescriptor);

		if (_.isArray(properties)) {

			_.each(properties, function (property) {

				// partialize get and set
				// using the property name as first argument.
				var desc = _.extend({}, descriptor);
				if (desc.get) {
					desc.get = _.partial(desc.get, property);
				}

				if (desc.set) {
					desc.set = _.partial(desc.set, property);
				}

				// run defineProperty
				Object.defineProperty(obj, property, desc);
			});

		} else {

			// TODO
			throw new Error('Currently subject.assign does not accept non-array properties for accessor assignment.');
		}
	}

	/**
	 * Defines properties using data descriptors.
	 *
	 * @method assignData
	 * @param  {[type]} obj        [description]
	 * @param  {[type]} data [description]
	 * @param  {[type]} descriptor [description]
	 * @return {[type]}            [description]
	 */
	function assignData(obj, data, descriptor) {

		// when the descriptor HAS
		// either 'get' or 'set'
		// set defaults only for configurable, enumerable
		_.defaults(descriptor, defaultDataDescriptor);


		_.each(data, function (value, property) {

			// set value on descriptor
			var desc = _.assign({ value: value }, descriptor);

			// run defineProperty
			Object.defineProperty(obj, property, desc);
		});
	}

	/**
	 *
	 *
	 * @method assign
	 * @private
	 * @param obj
	 * @param data
	 * @param [descriptor]
	 */
	module.exports = function assign(obj, data, descriptor) {

		if (!descriptor) {
			// simple assigning.
			_.assign(obj, data);

		} else {
			// use defineProperty to assign.

			if (descriptor.get || descriptor.set) {
				// ACCESSOR DESCRIPTOR

				assignAccessor(obj, data, descriptor);

			} else {
				//
				assignData(obj, data, descriptor);
			}
		}

		return obj;
	};

});

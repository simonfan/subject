//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

/**
 * Expressive (very :) prototypal inheritance.
 *
 * @module subject
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(function (require, exports, module) {
	'use strict';


	var _ = require('lodash');


	var assign = require('./__subject/private/assign');


	/**
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
	__subject.prototype = assign({}, {
		/**
		 * This method will be called before returning
		 * the instance. Put your initialization code here.
		 *
		 * @method initialize
		 */
		initialize: function () {}

	}, { enumerable: false });


	////////////
	// static //
	////////////

	assign(__subject, {


		/**
		 *
		 *
		 *
		 */
		staticProperties: ['proto', 'protoMerge', 'staticProperties', 'assignStatic', 'extend'],

		/**
		 * Assigns static values.
		 *
		 */
		assignStatic: function assignStatic(properties, descriptor) {

			this.staticProperties = _.union(this.staticProperties, _.keys(properties));

			return assign(this, properties, descriptor);
		},

		assignProto: require('./__subject/public/assign-proto'),
		proto: require('./__subject/public/assign-proto'),			// alias, for backwards compatibility
		protoMerge: require('./__subject/public/proto-merge'),
		extend: require('./__subject/public/extend'),

	}, { enumerable: false });

	/////////////
	// exports //
	/////////////

	/**
	 * Bind the extend method of the original __subject and export it.
	 * __subject is not accessible to anyone, only instances of it.
	 *
	 */
	module.exports = _.bind(__subject.extend, __subject);

	/**
	 * Assign helper functions directly to the exports,
	 * as the exports is not the extend method by itself,
	 * but actually a bound version returned by _.bind
	 *
	 */
	var helpers = { assign: assign };
	assign(exports, helpers, {
		enumerable:   false,
		writable:     false,
		configurable: false
	});
});

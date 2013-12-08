//     createSubject
//     (c) simonfan
//     createSubject is licensed under the MIT terms.

/**
 * AMD and CJS module.
 *
 * @module createSubject
 */

/* jshint ignore:start */
if (typeof define !== 'function') { var define = require('amdefine')(module) }
/* jshint ignore:end */

define(['underscore'], function (_, eventemitter2) {
	'use strict';

	/**
	 * cri cri cri...
	 */
	function zZzz() {}

	/**
	 * Method applied to the newly built object.
	 * May be changed on createSubject definition.
	 */
	var __constructor__ = function __constructor__(wrapped) {
		this.__wrapped__ = wrapped;
		this.initialize();
	};

	/**
	 * Base Subject object
	 */
	var subject = {
		initialize: zZzz,

		wrap: function wrap(value) {
			this.__wrapped__ = value;
		},

		unwrap: function unwrap() {
			return this.__wrapped__;
		},

		method: function method(name, func) {

			if (typeof name === 'object') {
				_.each(name, function (f, n) {
					this.method(n, f);
				}.bind(this));
			} else {
				this[name] = function () {

					var args = Array.prototype.slice.call(arguments);

					// add the wrapped value to the arguments
					args.unshift(this.__wrapped__);

					return func.apply(this, args);
				};
			}
		},
	};

	/**
	 * @class createSubject(1)
	 * @constructor
	 */
	var createSubject = function createSubject() {
		var obj = Object.create(subject);
		obj.initialize.apply(obj, arguments);

		return obj;
	};

	/**
	 * This property is how we maintain the prototype chain
	 * correctly set.
	 * Each 'createSubject' builder function has a subject property
	 * Which refers to the base createSubject object to be used
	 * when creating a new one.
	 *
	 * @property base {Object}
	 */
	createSubject.subject = subject;

	/**
	 * Does the sorcery. (:)
	 * Creates createSubject builders that create
	 * objects that inherit (via prototype) from
	 * objects up in the chain.
	 *
	 * @method define
	 * @param [constructor] {Function}
	 * @param methods {Object}
	 * @return {Function}
	 */
	createSubject.define = function define(methods) {

		// create an instance of this createSubject object
		// remember: `this` is the current createSubject function.
		var subject = Object.create(this.subject);

		subject.method(methods);

		// create a function that will create the final object
		var createSubject = function () {

			var obj = Object.create(subject);

			__constructor__.apply(obj, arguments);

			return obj;
		};

		// let createSubject have the same methods as the main createSubject.
		// set subject property!
		_.extend(createSubject, this, {
			subject: subject
		});

		return createSubject;
	};

	/**
	 * aliases
	 */
	createSubject.child = createSubject.define;








	function chainify(func) {

		// this function will be bound to the createSubject object.
		return function () {
			var res = func.apply(this, arguments);

			if (res === this.unwrap()) {
				return this;
			} else {
				return createSubject(res);
			}
		};
	}


/** how lodash does chaining
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
**/


	/**
	 * Define some basic createSubject objects.
	 */
	// TODO: mixin lodash methods
	createSubject.object = createSubject.define({
		get: function (data, property) {
			return data[property];
		},
		set: function (data, property, value) {
			data[property] = value;
			return this;
		},
		equals: function (data, property, value) {
			return data[property] === value;
		}
	});

	createSubject.list = createSubject.array = createSubject.object.define({
		has: _.contains,
		push: function (data, value) {
			data.push(value);
			return this;
		},
		unshift: function (data, value) {
			data.unshift(value);
			return this;
		},
		shift: function (data) {
			data.shift();
			return this;
		}
	});

	return createSubject;
});





	/**
	 * FROM LODASH DOCS:
	 *
	 * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
	 * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
	 * and `unshift`
	 *
	 * Chaining is supported in custom builds as long as the `value` method is
	 * implicitly or explicitly included in the build.
	 *
	 * The chainable wrapper functions are:
	 * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
	 * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
	 * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
	 * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
	 * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
	 * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
	 * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
	 * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
	 * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
	 * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
	 * and `zip`
	 *
	 * The non-chainable wrapper functions are:
	 * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
	 * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
	 * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
	 * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
	 * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
	 * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
	 * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
	 * `template`, `unescape`, `uniqueId`, and `value`
	 */






    /**
     LODASH MIXIN STRATEGY:

     * Adds function properties of a source object to the destination object.
     * If `object` is a function methods will be added to its prototype as well.
     *
     * @static
     * @memberOf _
     * @category Utilities
     * @param {Function|Object} [object=lodash] object The destination object.
     * @param {Object} source The object of functions to add.
     * @param {Object} [options] The options object.
     * @param {boolean} [options.chain=true] Specify whether the functions added are chainable.
     * @example
     *
     * function capitalize(string) {
     *   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
     * }
     *
     * _.mixin({ 'capitalize': capitalize });
     * _.capitalize('fred');
     * // => 'Fred'
     *
     * _('fred').capitalize().value();
     * // => 'Fred'
     *
     * _.mixin({ 'capitalize': capitalize }, { 'chain': false });
     * _('fred').capitalize();
     * // => 'Fred'
     */

/*
    function mixin(object, source, options) {
      var chain = true,
          methodNames = source && functions(source);

      if (!source || (!options && !methodNames.length)) {
        if (options == null) {
          options = source;
        }
        ctor = lodashWrapper;
        source = object;
        object = lodash;
        methodNames = functions(source);
      }
      if (options === false) {
        chain = false;
      } else if (isObject(options) && 'chain' in options) {
        chain = options.chain;
      }
      var ctor = object,
          isFunc = isFunction(ctor);

      forEach(methodNames, function(methodName) {
        var func = object[methodName] = source[methodName];
        if (isFunc) {
          ctor.prototype[methodName] = function() {
            var chainAll = this.__chain__,
                value = this.__wrapped__,
                args = [value];

            push.apply(args, arguments);
            var result = func.apply(object, args);
            if (chain || chainAll) {
              if (value === result && isObject(result)) {
                return this;
              }
              result = new ctor(result);
              result.__chain__ = chainAll;
            }
            return result;
          };
        }
      });
    }
*/

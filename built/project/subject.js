//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

define(["lodash"],function(e){var t={initialize:function(){},extend:function(){var t=Array.prototype.slice.call(arguments);return t.unshift(this),e.extend.apply(e,t),this}},n=function(){return Object.create(t)};return n.base=t,n.extend=function(){var t=Object.create(this.base);t.extend.apply(t,arguments);var n=function(){var n=Object.create(t);return n.initialize.apply(n,arguments),n};return n.base=t,n.extend=this.extend,n.define=n.extend,n},n.define=n.extend,n});
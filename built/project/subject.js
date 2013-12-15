//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

define(["lodash"],function(e){function t(e){return Array.prototype.slice.call(e)}var n={initialize:function(){}},r=function(){return Object.create(n)};return r.prototype=n,r.inherit=function(n){return e.assign(this.prototype,n),this},r.extend=function(n,r){var i=this,s;return s=function(){var t=Object.create(s.prototype);return t.initialize.apply(t,arguments),t},e.assign(s,i,r),s.prototype=Object.create(this.prototype),s.prototype.constructor=s,s.inherit(n),s},r});
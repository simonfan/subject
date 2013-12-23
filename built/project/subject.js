//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

define(["lodash"],function(e){function t(e){return Array.prototype.slice.call(e)}var n={initialize:function(){}},r=function(){};return r.prototype=n,r.proto=function(n,r){return e.isObject(n)?e.assign(this.prototype,n):this.prototype[n]=r,this},r.extend=function(n,r){var i=this,s;return s=function(){var t=Object.create(s.prototype);return t.initialize.apply(t,arguments),t},e.assign(s,i,r),s.prototype=Object.create(i.prototype),s.prototype.constructor=s,s.proto(n),s.__super__=i.prototype,s},r.extend.bind(r)});
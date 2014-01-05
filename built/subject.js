//     subject
//     (c) simonfan
//     subject is licensed under the MIT terms.

define("subject",["lodash"],function(t){var e={initialize:function(){}},i=function(){};return i.prototype=e,i.proto=function(e,i){return t.isObject(e)?t.assign(this.prototype,e):this.prototype[e]=i,this},i.extend=function(e,i,n){var o,r;t.isFunction(e)?(o=t.assign({},i,{initialize:e}),r=n):t.isObject(e)&&(o=e||{},r=n);var p,s=this;return p=function(){var t=Object.create(p.prototype);return t.initialize.apply(t,arguments),t},t.assign(p,s,r),p.prototype=Object.create(s.prototype),p.prototype.constructor=p,p.proto(o),p.__super__=s.prototype,p},i.extend.bind(i)});
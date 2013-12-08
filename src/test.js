var _ = require('lodash'),
	log = console.log;

var subject = function () {

};

subject.lalalala = 'aaaa';

subject.methods = function methods(methods) {

	function exec(method) {
		var args = Array.prototype.slice.call(arguments);
		args.shift();
		args.unshift(this.__wrapped__);

		return methods[method].apply(this, args);
	};

	_.each(methods, _.bind(function(func, name) {

		this[name] = _.partial(exec, name);

	}, this));
};




subject.define = function(fst, snd) {

	var parent = this;

	log('!!!!!!!!!!!!define!!!!!!!!!!!!!!!!!!!!')
	console.log(this);

		// if the first argument is a function then it will be considered
		// the constructor.
	var constructor = typeof fst === 'function' ? fst : false,
		// if there is a constructor, the methods should be second argument
		methods = constructor ? snd : fst;


	var func = function(data) {

		s.methods(methods);

		s.__wrapped__ = data;
		return s;
	};

	//////// RETURN HERE /////////
	func.prototype = Object.create(parent);

	return func;
};



var arr = subject.define({
	push: function(data, value) {
		data.push(value);

		return this;
	},

	data: function(data) {
		return data;
	},

	pushAndData: function(data, value) {
		this.push(value);
		return this.data();
	}
});

log('!!!!arr')

log(arr);

var list1 = arr([10, 30, 1000]);
var list2 = arr(['a', 'b', 'c']);

list1.push(10000);
list2.push('ooo');

log(list1);
log(list2);



var improvedArr = arr.define({
	unshift: function (data, value) {
		data.unshift(value);
	}
})

log(improvedArr);

var superList = improvedArr(['abc',12312]);
log(superList);

superList.push('102013023');
superList.unshift('uhuuuuuul');
log(superList);
log(list1);
log(list2);
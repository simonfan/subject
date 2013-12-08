# subject

Wrap a value inside custom object with methods that take the
wrapped value as first argument.

Inspired by (if not completely a copy of) underscore, lodash and Lazy.js 
data wrapping functionality.


## usage

``` javascript


var data = {
	name: 'Banana',
	color: 'yellow'
}

var fruit = require('subject').define({
		color: function() {
			this.trigger('color-request');

			return this.color
		}
	});

banana = fruit(data);

banana.color() // yellow



/////////////////////

var Person = require('subject').define({
	introduce: function(data) {
		return 'Hi, my name is ' + data.name;
	},

	set: function(data, value) {

		data[prop] = value;
	},
});

var ana = Person.create({
	name: 'Ana'
});

ana.introduce() // returns 'Hi, my name is Ana'

///////////////////////////////////////////////////
var list = require('subject').define({
	push: function (data, item) {
		data.push(item);

		this.trigger('push', item);

		return this;
	},

	data: function(data) {
		return data;
	}
});


list([1, 2, 3, 4]).push(7).data();	// returns [1, 2, 3, 4, 7]


////////////////////////
var encodedString = require('subject').define({
	decode: function (str) {
		return str.replace('!@#$', 'fuck');
	}
});

var encodedString('!@#$ you!').decode();  // returns 'fuck you!'


////////////////////
var fancyConfigurations = require('subject').define({
	isSomeSettingEnabled: function(data) {
		return data.someSetting;
	},

	someOtherSetting: function(data, value) {
		if (arguments.length === 2) {
			data.someOtherSetting = value;
		} else {
			return data.someOtherSetting
		}
	},

	// getter for the value
	someProperty: true
});

```

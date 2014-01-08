# subject [![Build Status](https://secure.travis-ci.org/simonfan/subject.png?branch=master)](http://travis-ci.org/simonfan/subject)

Some sweet object definition, inheritance and instantiation in functional syntax.


``` javascript
var subject = require('subject');

// define person builder
var person = subject.define({

		// This will be called on instantiation
		initialize: function (data) {
			this.name = data.name;
		},

		// These are simple methods and prototype properties.
		introduceSelf: function () {
			return 'My name is ' + this.name
		},

		walk: function () {
			// 
		}
	});

// instantiate person
var joe = person({ name: 'Joe Smith' });

joe.introduceSelf() // My name is Joe Smith


// define musician builder, which should inherit from person
var musician = person.define({
		// Overwrite initialization
		initialize: function (data) {
			// call the person's
			person.base.initialize.apply(this, arguments);

			this.instruments = data.instrments;
		},

		play: function (instrument) {
			return _.contains(this.instruments, instrument) ? '♬ ♫ ♪ ♩ ♭ La La La' : 'I can\'t play that!';
		}
	});

// instantiate musician
var bob = musician({ name: 'Bob Dylan', instruments: ['guitar', 'voice', 'harmonica'] });

// person methods
bob.introduceSelf()    // My name is Bob Dylan

// musician methods.
bob.play('harmonica')  // ♬ ♫ ♪ ♩ ♭ La La La
bob.play('trumpet')    // I can't play that!

```

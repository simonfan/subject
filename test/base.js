'use strict';

var should = require('should');

var subject = require('../src/subject');

describe('inheritance', function () {
	beforeEach(function (done) {
		done();
	});

	it('returns an object', function () {

		var b = subject();

		b.should.be.type('object');

	});

	it('... that has an extend method', function () {
		var b = subject();

		b.extend.should.be.type('function');

		// extend should basically set stuff on the object
		b.extend({
			name: 'Simon',
			sayName: function () {
				return 'My name is ' + this.name;
			}
		});

		b.name.should.eql('Simon');
		b.sayName().should.eql('My name is ' + b.name);
	});

	it('... that has a \'base\' property and a \'define\' method', function() {
		var anotherSubject = subject.define();

		anotherSubject.base.should.be.type('object');
		anotherSubject.define.should.be.type('function');
	});

	it('basic subject', function() {
		var person = subject.define({
				initialize: function(data) {
					this.name = data.name;
				},

				introduceSelf: function () {
					return 'My name is ' + this.name;
				}
			});

		var simon = person({
			name: 'Simon'
		});

		simon.should.eql({
			name: 'Simon'
		});

		simon.introduceSelf().should.eql('My name is Simon');

	});

	it('the fire test: inheritance chain', function () {
		var person = subject.define({
				initialize: function(data) {
					this.name = data.name;
				},

				introduceSelf: function () {
					return 'My name is ' + this.name;
				}
			}),

			musician = person.define({
				initialize: function(data) {
					person.base.initialize.apply(this, arguments);

					this.style = data.style;
				},

				play: function () {
					return '♭ ♭ ♭   ♭';
				}
			}),

			singer = musician.define({
				initialize: function(data) {
					musician.base.initialize.apply(this, arguments);

					this.song = data.song;
				},

				sing: function () {
					return '♭ ' + this.song + ' ♭';
				},

				play: function () {
					return 'Sorry... I can only sing';
				}
			});

		var simon = person({
				name: 'Simon',
			}),

			guitarPlayer = musician({
				name: 'Guitar Guy',
				style: 'rock',
			}),

			louis = singer({
				name: 'Louis',
				song: 'I\'ve got the Heebie Jeebies bada baad',
			});

		simon.should.have.property('name', 'Simon');
		// simon is just a person, he cannot sing
		simon.should.not.have.property('song');
		simon.should.not.have.property('sing');

		guitarPlayer.play().should.eql('♭ ♭ ♭   ♭');

		// now louis... wow
		louis.should.have.property('name', 'Louis');
		louis.should.have.property('song');
		louis.sing().should.eql('♭ I\'ve got the Heebie Jeebies bada baad ♭');
		louis.play().should.eql('Sorry... I can only sing');
	});
});

(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'../src/subject' :
		// browser
		'subject',
		// dependencies for the test
		deps = [mod, 'should'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(subject, should) {
	'use strict';



	describe('person = subject.define({ *methods for person objects* })', function () {

		beforeEach(function () {
			this.personMethods = {
				initialize: function (data) {
					this.name = data.name;
				},

				sayName: function () {
					return 'My name is ' + this.name;
				},

				introduceSelf: function () {
					return this.sayName() + ' I am somebody.';
				},
			};

			this.person = subject.define(this.personMethods);
		})

		describe('person', function () {

			it('is a function', function () {
				this.person.should.be.type('function');
			});

			it('has a `base` object property', function () {
				this.person.base.should.be.type('object');
			});

			it('has a `define/extend` method', function () {
				this.person.define.should.be.type('function');
			});



			describe('joe = person({ name: "Joe" })', function () {
				beforeEach(function () {
					this.joe = this.person({
						name: 'Joe',
					});
				});

				it('is an object', function () {
					this.joe.should.be.type('object');
				});

				it('has methods defined on person subject definition', function () {
					this.joe.sayName.should.be.type('function');

					this.joe
						.sayName().should.eql('My name is Joe');

					this.joe
						.introduceSelf().should.eql(this.joe.sayName() + ' I am somebody.');
				});

				it('should have methods on the prototype chain, not on itself', function () {
					this.joe.should.not.have.ownProperty('sayName');
					this.joe.should.have.ownProperty('name');
				})
			});

		});

		describe('musician = person.define({ *musician specific methods* )', function () {

			beforeEach(function () {
				var person = this.person;

				this.musicianMethods = {
					// overwrite initialize
					initialize: function (data) {
						// run person initialization
						person.base.initialize.call(this, data);

						// some further definitions
						this.style = data.style;
						this.instruments = data.instruments;
					},

					// overwrite introduceSelf
					introduceSelf: function () {
						return '♪ ' + this.sayName() + ' ♪';
					},

					play: function (instrument) {
						var sounds = this.instruments[instrument] || 'sounds not so good';

						return sounds;
					},
				};

				this.musician = person.define(this.musicianMethods);
			});


			it('is also a function', function () {
				this.musician.should.be.type('function');
			});

			it('has a `base` property', function () {
				this.musician.base.should.be.type('object');
			});

			it('has a `define/extend` method', function () {
				this.musician.define.should.be.type('function');
				this.musician.extend.should.be.type('function');
			});

			describe('louis = musician(...), frank = musician(...)', function () {

				beforeEach(function () {
					this.louis = this.musician({
						name: 'Louis Armstrong',
						instruments: {
							voice: '♬ ♫ ♪ ♩ ♭ La La La',
							trumpet: '♪ ♩ ♭ ♫ ♪, ♪ ♩ ♭'
						}
					});

					this.frank = this.musician({
						name: 'Frank Sinatra',
						instruments: {
							voice: '♪ ♩ ♭ ♪ ♩ ♭ ♪ ♩ ♭',
						}
					})
				});

				it('is an object', function () {
					this.louis.should.be.type('object');
				});

				it('has methods that are common to all person objects', function () {
					this.louis.sayName.should.be.type('function');

					this.louis.sayName()
						.should.eql('My name is Louis Armstrong');
				});

				it('should have some methods overwritten', function () {
					var louisIntro = this.louis.introduceSelf();

					louisIntro.should.eql('♪ My name is Louis Armstrong ♪');

					this.joe
						.introduceSelf()
							.should.not.eql(louisIntro);

				});

				it('has methods specific to musicians', function () {
					this.louis.play.should.be.type('function');
					this.louis
						.play('voice')
							.should.eql(this.musicianMethods.play.call(this.louis, 'voice'));
				});

				it('frank should be different from louis', function () {
					this.louis.sayName().should.eql('My name is Louis Armstrong');
					this.frank.sayName().should.eql('My name is Frank Sinatra');
				})
			});

			describe('fred = person.extend(this.lawyerMethods)(* Fred data *)', function () {
				beforeEach(function () {

					var person = this.person;

					this.lawyerMethods = {
						initialize: function (data) {
							person.base.initialize.apply(this, arguments);
						},

						introduceSelf: function () {
							return 'My Lord, ' + this.sayName;
						},

						accuse: function() {
							//whatever..
						}
					};

					this.lawyer = person.extend(this.lawyerMethods);
					this.fred = this.lawyer({ name: 'Fred, the lawyer'});
				});

				it('presents itself different from musicians or normal people', function () {
					var frankIntro = this.frank.introduceSelf(),
						joeIntro = this.joe.introduceSelf(),

						fredIntro = this.fred.introduceSelf();

					fredIntro.should.not.eql(frankIntro);

					fredIntro.should.not.eql(joeIntro);
				});

				it('does not have musician methods', function () {
					this.fred.should.not.have.property('play');
					this.fred.should.have.property('accuse');
				})
			});

		});

	});

});

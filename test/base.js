(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'../src' :
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



	describe('person = subject({ *methods for person objects* })', function () {

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

			this.person = subject(this.personMethods);
		})

		describe('person', function () {

			it('is a function', function () {
				this.person.should.be.type('function');
			});

			it('has a `base` object property', function () {
				this.person.prototype.should.be.type('object');
			});

			it('has an `extend` method', function () {
				this.person.extend.should.be.type('function');
			});



			describe('joe = person({ name: "Joe" }) - function invocation', function () {
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

			describe('sara = new person({name: "Sara"}) - initialize invocation', function () {
				beforeEach(function () {
					this.sara = new this.person({
						name: 'Sara',
					})
				});

				it('is an object', function () {
					this.sara.should.be.type('object');
				});

				it('has methods defined on person subject definition', function () {
					this.sara.sayName.should.be.type('function');

					this.sara.sayName()
						.should.eql('My name is Sara');

					this.sara.introduceSelf()
						.should.eql(this.sara.sayName() + ' I am somebody.');
				});
			})

		});

		describe('musician = person.extend({ *musician specific methods* )', function () {

			beforeEach(function () {
				var person = this.person;

				this.musicianMethods = {
					// overwrite initialize
					initialize: function (data) {
						// run person constructortion
						person.prototype.initialize.call(this, data);

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

				this.musician = person.extend(this.musicianMethods);
			});


			it('is also a function', function () {
				this.musician.should.be.type('function');
			});

			it('has a `base` property', function () {
				this.musician.prototype.should.be.type('object');
			});

			it('has an `extend` method', function () {
				this.musician.extend.should.be.type('function');
			});

			describe('ella = musician(...), frank = musician(...) - builder invocation', function () {

				beforeEach(function () {
					this.ella = this.musician({
						name: 'Ella Fitzgerald',
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
					this.ella.should.be.type('object');
				});

				it('has methods that are common to all person objects', function () {
					this.ella.sayName.should.be.type('function');

					this.ella.sayName()
						.should.eql('My name is Ella Fitzgerald');
				});

				it('should have some methods overwritten', function () {
					var ellaIntro = this.ella.introduceSelf();

					ellaIntro.should.eql('♪ My name is Ella Fitzgerald ♪');

					this.joe
						.introduceSelf()
							.should.not.eql(ellaIntro);

				});

				it('has methods specific to musicians', function () {
					this.ella.play.should.be.type('function');
					this.ella
						.play('voice')
							.should.eql(this.musicianMethods.play.call(this.ella, 'voice'));
				});

				it('frank should be different from ella', function () {
					this.ella.sayName().should.eql('My name is Ella Fitzgerald');
					this.frank.sayName().should.eql('My name is Frank Sinatra');
				})
			});

			describe('louis = new musician(...), billie = new musician(...) - initialize invocation', function () {
				beforeEach(function () {
					this.louis = new this.musician({ name: 'Louis Armstrong' });
					this.billie = new this.musician({ name: 'Billie Holiday' });
				})

				it('louis should be different from billie', function () {
					this.louis.sayName().should.eql('My name is Louis Armstrong');
					this.billie.sayName().should.eql('My name is Billie Holiday');
				})
			})

			describe('fred = person.extend(this.lawyerMethods)(* Fred data *)', function () {
				beforeEach(function () {

					var person = this.person;

					this.lawyerMethods = {
						initialize: function (data) {
							person.prototype.initialize.apply(this, arguments);
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

	describe.skip('[DROPPED] person = subject.extend(initialize {Function}, perotoProps {Object})', function () {

		beforeEach(function () {
			this.personInitialize = function person (data) {
				this.name = data.name;

				this.familyName = data.name.split(' ')[1];
			};

			this.personMethods = {
				sayName: function () {
					return 'My name is ' + this.name;
				}
			};

			this.person = subject(this.personInitialize, this.personMethods);

		});

		it('can be invoked as a constructor', function () {
			var ana = new this.person({ name: 'Ana Silva' });

			ana.name.should.eql('Ana Silva');
			ana.familyName.should.eql('Silva');
		});

		it('can be invoked as a builder', function () {
			var joao = this.person({ name: 'Joao Franco' });

			joao.name.should.eql('Joao Franco');
			joao.familyName.should.eql('Franco');
		})
	});

});

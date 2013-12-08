require.config({
	urlArgs: 'bust=0.5646813064813614',
	baseUrl: '/',
	paths: {
		requirejs: 'bower_components/requirejs/require',
		text: 'bower_components/requirejs-text/text',
		mocha: 'node_modules/mocha/mocha',
		should: 'node_modules/should/should',
		subject: 'src/subject',
		'document-matcher': 'bower_components/document-matcher/src/document-matcher',
		jquery: 'bower_components/jquery/jquery',
		'requirejs-text': 'bower_components/requirejs-text/text',
		'underscore.contains': 'bower_components/underscore.contains/src/underscore.contains',
		'underscore.deep': 'bower_components/underscore.deep/src/underscore.deep',
		underscore: 'bower_components/underscore/underscore',
		eventemitter2: 'bower_components/eventemitter2/lib/eventemitter2',
		lodash: 'bower_components/lodash/dist/lodash.compat'
	},
	shim: {
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		mocha: {
			exports: 'mocha'
		},
		should: {
			exports: 'should'
		}
	}
});

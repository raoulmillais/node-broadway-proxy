var vows = require('vows'),
	assert = require('assert'),
	Broadway = require('../Broadway').Broadway,
	buffer;

vows.describe('Broadway').addBatch({
	'A new instance': {
		topic : new Broadway({ port: 8080 }),
		'should set the port': function(broadway) {
			assert.equal(broadway.getPort(), 8080);
		},
		'should default the gtk application to the demo': function(broadway) {
			assert.equal(broadway.getGtkApplicationExectutable(), '/home/raoul/checkout/gnome/gtk+/demos/gtk-demo/gtk3-demo');
		},
		'should default the gtk application args to empty': function(broadway) {
			assert.isArray(broadway.getGtkApplicationExecutableArgs());
			assert.isEmpty(broadway.getGtkApplicationExecutableArgs());
		},
		'should set environment for child process': function(broadway) {
			assert.isNotNull(broadway.processEnv);
		}
	},

	'Assigning ports': {
		topic: function() { 
			return Broadway.getNextPort();
		},
		'next port should increment by one ': function(originalport) {
			var nextport = Broadway.getNextPort();
			assert.equal(nextport - originalport, 1);
		}
	},

	'When connecting': {
		topic: function() {
			var broadway = new Broadway({ port: 8080 });
			broadway.connect();
			return broadway;
		},
		'Should spawn a new gtk process': function(broadway) {
			assert.isNotNull(broadway.process.pid, 'process pid was null');
			assert.isFalse(broadway.process.killed, 'process was killed');
		}
	},

	'When disconnecting': {
		topic: function() {
			var broadway = new Broadway({ port: 8080 });
			broadway.connect();
			broadway.on('disconnect', this.callback);
			broadway.disconnect();
		},
		'should emit the disconnect event': function(data) {
			assert.ok(true, 'disconnect event was emitted');
		}
	}
}).export(module);


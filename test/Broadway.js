var vows = require('vows'),
	assert = require('assert'),
	Broadway = require('../Broadway').Broadway;

vows.describe('Broadway').addBatch({
	'When disconnecting': {
		topic: function() {
			var broadway = new Broadway();
			broadway.connect();
			broadway.on('disconnect', this.callback);
			broadway.disconnect();
		},
		'should emit the disconnect event': function(data) {
			assert.ok(true, 'disconnect event was emitted');
		}
	}

}).export(module);


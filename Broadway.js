var util = require('util'),
	events = require('events'),
	spawn = require('child_process').spawn,
	WebSocket = require('websocket-client').WebSocket;

/*
 * Ctor
 */
function Broadway(options) {
	if (!(this instanceof Broadway)) {
		return new Broadway();
	}

	this.options = options || {};
	events.EventEmitter.call(this);
};

util.inherits(Broadway, events.EventEmitter);

/*
 * Properties
 */
Broadway.prototype.getPort = function getPort() {
	return this.options.port  || 8080;	
};

Broadway.prototype.getGtkApplicationExectutable = function getGtkApplicationExectutable() {
	// TODO: Fix hardcoded default gtk app path
	return this.options.app || '/home/raoul/checkout/gnome/gtk+/demos/gtk-demo/gtk3-demo';
};

Broadway.prototype.getGtkApplicationExecutableArgs = function getGtkApplicationExecutableArgs() {
	return this.options.args || [];
};

/*
 * Methods
 */
Broadway.prototype.connect = function connect() {
	// TODO: Copy parent process env?
	var broadwayEnv = { 'GDK_BACKEND': 'broadway', 'BROADWAY_PORT': this.getPort() },
		that = this;
	
	console.log('Spawning broadway process');
	this.process = spawn(this.getGtkApplicationExectutable(), 
						 this.getGtkApplicationExecutableArgs(), 
						 { env: broadwayEnv });

	this.process.stderr.on('data', function onBroadwayError(data) {
		console.log('ERROR from broadway process: ' + data);
		that.disconnect();
	});
	this.process.stdout.on('data', function onBroadwayOutput(data) {
		console.log('Broadway stdout: ' + data);
	});

	setTimeout(function() {
		var self = that;
		console.log('Connecting to broadway via websocket: ' + 'ws://localhost:' + self.getPort() + '/socket');
		self.webSocket = new WebSocket('ws://localhost:' + self.getPort() + '/socket', "broadway");
		self.webSocket.onmessage = function socketDataReceived(event) {
			self.emit('message', event.data);
		};
	}, 1000);
};

Broadway.prototype.disconnect = function disconnect() {
	if (this.webSocket) {
		this.webSocket.close();
	}
	if (this.process && this.process.killed === false) {
		this.process.kill('SIGTERM');
	}
	this.emit('disconnect');
}

Broadway.prototype.send = function send(msg) {
	if (this.webSocket) {
		this.webSocket.send(msg);
	}
}

/*
 * Exports
 */
exports.Broadway = Broadway;

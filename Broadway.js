var util = require('util'),
	events = require('events'),
	spawn = require('child_process').spawn,
	WebSocket = require('websocket-client').WebSocket,
	currentport = 50000;

/*
 * Ctor
 */
function Broadway(options) {
	this.options = options || {};
	if (!this.options.port) {
		this.options.port = Broadway.getNextPort();
	}

	this.processEnv = { 'GDK_BACKEND': 'broadway', 'BROADWAY_DISPLAY': this.getPort() };
	events.EventEmitter.call(this);
};

util.inherits(Broadway, events.EventEmitter);

/*
 * Static Methods
 */
Broadway.getNextPort = function() {
	return currentport++;
}

/*
 * Properties
 */
Broadway.prototype.getPort = function getPort() {
	return this.options.port;	
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
	var that = this,
		processStartDelay = 1000;
	
	this.process = spawn(this.getGtkApplicationExectutable(), 
						 this.getGtkApplicationExecutableArgs(), 
						 { env: this.processEnv });

	this.process.stderr.on('data', function onBroadwayError(data) {
		console.log(this.getPort() + ': BROADWAY STDERR: ' + data);
		that.disconnect();
	});
	this.process.stdout.on('data', function onBroadwayOutput(data) {
		console.log(this.getPort() + ': BROADWAY STDOUT: ' + data);
	});

	setTimeout(function() {
		var self = that;
		console.log(self.getPort() + 'CONNECTED');
		self.webSocket = new WebSocket('ws://localhost:' + self.getPort() + '/socket', "broadway");
		self.webSocket.onmessage = function socketDataReceived(event) {
			self.emit('message', event.data);
		};
	}, processStartDelay);
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

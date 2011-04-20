// Destination Socket Server
var	express = require('express'),
	io = require('socket.io'),
	destSocketServer = express.createServer(),
	socket;


destSocketServer.listen(8080);
console.log('Server started on port 8080');
socket = io.listen(destSocketServer);

socket.on('connection', function(client) {
	console.log('CONNECTION received by destination');

//	client.send('I heard you liked sockets, so I put a socket in your socket!');

	client.on('message', function(msg) {
		console.log('MESSAGE received by destination from proxy: ' + msg);
		//client.send('ECHO: ' + msg);
	});
	
	client.on('disconnect', function() {
		console.log('DISCONNECT received by destination from proxy');
	});
});

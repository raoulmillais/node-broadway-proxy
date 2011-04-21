var http = require('http'),
	io = require('socket.io'),
	express = require('express'),
	server = express.createServer(),
	socket,
	eyes = require('eyes');

server.configure(function(){
	server.set('views', __dirname + '/views');
	server.set('view engine', 'jade');
    server.use(express.methodOverride());
    server.use(express.bodyParser());
    server.use(server.router);
    server.use(express.static(__dirname + '/public'));
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

server.get('/', function(req, res) {
	res.render('index', { layout: false });
});

server.listen(3000);
console.log('Server listening on port 3000');

// Proxy Socket Server
var proxySocket = io.listen(server),
	Broadway = require('./Broadway').Broadway;

proxySocket.on('connection', function(client) {
	console.log('CONNECTION received by proxy from client');

	var broadway = new Broadway();
	broadway.on('message', function(msg) {
		client.send(msg);
	});

	client.on('message', function(msg) {
		broadway.send(msg);
	});
	
	broadway.connect();
});

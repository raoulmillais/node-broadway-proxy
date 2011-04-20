(function($) {

	$(function() {

		var socket = new io.Socket('localhost', { transports: ['websocket', 'flashsocket', 'xhr-multipart', 'jsonp-polling']}); 
			socket.connect();
			socket.on('connect', function(){
				console.log('connected');
			});

			$('form').submit(function(event) {
				event.preventDefault();
				var message = $('#message').val();
				console.log('SENDING: ' + message);
				socket.send(message);
			});

			socket.on('message', function(msg){
				var target = document.getElementById('messages');
				target.innerHTML = target.innerHTML + '<br/>' + msg;
				console.log('message received:' + msg);
			});
	
			socket.on('disconnect', function(){
				console.log('disconnected');
			});

	});

})(jQuery);

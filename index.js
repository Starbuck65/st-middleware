var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var socket;

app.use(bodyParser.json());

app.post('/', function(req, res, next) {
	console.log(req.body.reads);
//	console.log(req.params);
	res.send('Received');
	if (socket !== undefined ){
		var envio = {
			'key': Math.random(),
			'tags': req.body.reads
		}
		console.log(envio);
//		socket.emit('tag', envio);
		socket.emit('tag', req.body.reads);
	}	
//socket.emit('tag', 'nueva etiqueta');
});

console.log('Working');

io.on('connection', function(client) {
	socket = client;
	console.log('Client connected...');

	client.on('join', function(data){
		console.log(data);
		client.emit('messages', 'Hello world');
	});
});

server.listen(4200);


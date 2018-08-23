var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var socket;

function Timer(funct, time) {
	var timerObj = setInterval(funct, time);

	this.stop = function() {
		if(timerObj) {
			clearInterval(timerObj);
			timerObj = null;
		}
		return this;
	}

	this.start = function() {
		if(!timerObj) {
			this.stop();
			timerObj = setInterval(funct, time);
		}
		return this;
	}

	this.reset = function(newTime) {
		time = newTime;
		return this.stop().start();
	}
}

var timer = new Timer(function() {
	console.log("No tags detected, sending default");
	socket.emit('tag', [{"TAG":"0000000000000000"}])
}, 2000000);

var tag_pool ={
	'tags': [{"TAG":'00'}]
} 


app.use(bodyParser.json());

app.post('/', function(req, res, next) {
	timer.reset(2500);

	console.log(">>RECEIVING DETECTION " + String(Date.now()));
	console.log(req.body.reads);

	res.send('Received');
	if (socket !== undefined ){
		
		
		var envio = {
			'key': Math.random(),
			'tags': req.body.reads
		}

		console.log(">>SENDING:");
		console.log(envio.tags);
		console.log('\n');
		socket.emit('tag', req.body.reads);
	}
});

console.log('Working');

io.on('connection', function(client) {
	socket = client;
	console.log('Client connected...');
	timer.start();
	client.on('join', function(data){
		console.log(data);
		client.emit('messages', 'Hello world');
	});
});

server.listen(4200);


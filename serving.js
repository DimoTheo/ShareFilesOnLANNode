var os = require('os');
var fs = require('fs');
var ss = require('socket.io-stream');
var path = require('path');
var mee = require('multicast-eventemitter');
var emitter = mee.getEmitter();

var name = process.argv[2];
var filename = process.argv[3];
sendFileTo(name,filename);

function sendFileTo(name , file){
	emitter.on('imhere' , function(text , time){
		var name2 = text.split(",")[0];
		console.log(name2 + " is alive!");
		if( name2 == name ){
			var ip = text.split(",")[1];
			var port = text.split(",")[2];
			var socket = require('socket.io-client')("http://"+ip+":"+port);
			socket.on('connect', function(){
				console.log("[*]Connected to " + name + "!");
				//Emiting 
				var stream = ss.createStream();
				var filename = file;
				 
				ss(socket).emit('file', stream, {name: filename});
				fs.createReadStream(filename).pipe(stream);
				//socket.disconnect();
				//process.exit(0);
			});
		}
	});
	emitter.emit('anyonethere' , "Want to send a file" , new Date().getTime());
}
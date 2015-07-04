var os = require('os');
var fs = require('fs');
var ss = require('socket.io-stream');
var path = require('path');

var mee = require('multicast-eventemitter');
var emitter = mee.getEmitter();

var name = process.argv[2];
var port = parseInt(process.argv[3]);
var ip = getMyIp();
console.log('My Ip = ' + ip);
//if folder is specified
var upFolder = "upload";
if (process.argv.length >= 5){
	upFolder = process.argv[4];
}

// Stay ALIVE
setupEmitter();
// IO Socket 
var io = require('socket.io')();
io.on('connection', function(socket){
	console.log('New connection');
	ss(socket).on('file', function(stream, data) {
		var filename = upFolder + "/" + path.basename(data.name);
		console.log("> Saving File > " + filename);
	    console.log("File is coming... Filename:" + filename);
	    stream.pipe(fs.createWriteStream(filename));
	});
	socket.on('disconnect', function(){
	 	console.log('disconnect');
	});
});
io.listen(port);
console.log("IO Server is up and listening on port " + port );

function getAddresses(){
	var interfaces = os.networkInterfaces();
	var addresses = [];
	for (var k in interfaces) {
	    for (var k2 in interfaces[k]) {
	        var address = interfaces[k][k2];
	        if (address.family === 'IPv4' && !address.internal) {
	            addresses.push(address.address);
	        }
	    }
	}
	return addresses;
}
function getMyIp(){
	var addresses = getAddresses();
	if( addresses.length == 0 )
		throw "Address not found!";
	return addresses[0];
}
function setupEmitter(){	
	emitter.on('anyonethere', function(text, time) {
		ip = getMyIp();
		console.log('My Ip = ' + ip);
		var now = new Date().getTime();
		emitter.emit('imhere', name+","+ip+","+port , now );  
		console.log("Response to query: " + text + " / " + time );
	});
}
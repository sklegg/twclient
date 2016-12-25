var net = require('net');
var inStream = process.openStdin();

var client = new net.Socket();
client.connect(2002, '127.0.0.1', function() {
    console.log('connected');
    client.write("init::user:password");
});

client.on('data', function(fromServer) {
    console.log(fromServer);
});

client.on('close', function() {
    console.log('connection closed');
});

inStream.addListener('data', function(command) {
    command = command + '';
    command = command.replace(/\n$/, ''); /* dump newline */
    
    console.log('got ' + command + ' from user');    
    
    if (command == 'quit') {        
        client.write('__QUIT__');
        client.destroy();
    } else {
        console.log("sent? " + client.write(command, null, function() {
            console.log('write complete.');
        }));
        
    }
});
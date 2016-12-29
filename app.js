var net = require('net');
var ansi = require('ansi');
var inStream = process.openStdin();

var client = new net.Socket();

cursor = ansi(process.stdout);

sectors = {};

client.connect(2002, '127.0.0.1', function() {
    console.log('connected');
    writeMainHelp();
    writeCursor(2);
});

client.on('data', function(fromServerBuffer) {    
    console.log("got from server:" + fromServerBuffer.toString('utf8'));

    /* update correct state object */

    writeCursor(2);
});

client.on('close', function() {
    console.log('connection closed');
});

inStream.addListener('data', function(command) {
    command = command + '';
    command = command.replace(/\n$/, ''); /* dump newline */
    
    console.log('got ' + command + ' from user');    
    
    if (command == 'Q' || command == 'q') {        
        client.write('__QUIT__');
        client.destroy();
        process.exit();
    } else {
        console.log("sent? " + client.write(command, null, 
        function() {
            //console.log('write complete.');
        }));        
    }
});

function writeCursor(sectorNumber) {
    cursor.reset().bold()
    .hex('#4B0082').write("Command [")
    .hex('#FFD700').write("TL=00:00:00")
    .hex('#4B0082').write("]")
    .white().write(":")
    .hex('#4B0082').write("[")
    .cyan().write(sectorNumber + "")
    .hex('#4B0082').write("] (")
    .hex('#FFD700').write("?=Help")
    .hex('#4B0082').write(")? :")
    .reset();
}

function writeMainHelp() {
    cursor.reset().bold()
    .red().write("<Help>\n\n\n")
    .hex('#00CCCC')
    .write("  <D> Re-Display Sector <C> Onboard Computer <A> Attack Enemy SpaceCraft \n")
    .write("  <P> Port and Trade    <X> Transporter Pad  <E> Use SubSpace EtherProbe \n")
    .write("  <M> Move to a Sector  <I> Ship Information <F> Take or Leave Fighters \n")
    .write("  <L> Land on a Planet  <T> Corporate Menu   <G> Show Deployed Fighters \n")
    .write("  <S> Long Range Scan   <U> Use Genesis Torp <H> Handle Space Mines \n")
    .write("  <R> Release Beacon    <J> Jettison Cargo   <K> Show Deployed Mines \n")
    .write("  <W> Tow SpaceCraft    <B> Interdict Ctrl   <O> Starport Construction \n")
    .write("                        <!> Main Menu Help \n")
    .write("  <Q> Quit and Exit     <Z> DOCS             <V> View Game Status \n\n")
    .reset();
}

function updateState(serverData) {
    var data = serverData || {};

    /* check type */
    if (serverData && serverData.type) {
        if (serverData.type === 'SECTOR') {
            sectors[serverData.id] = new Sector(serverData);
        } else if (serverData.type === 'PORT') {

        }
    }
}
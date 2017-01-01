var net = require('net');       /* socket to server */
var ansi = require('ansi');     /* ANSI colors */
var inStream = process.openStdin();

var client = new net.Socket();

/* add ANSI functionality to stdout */
cursor = ansi(process.stdout);

/* include game objects */
var gameState = require('./game/current_state.js');
var Sector = require('./game/gameobjects/sector.js');
var Port = require('./game/gameobjects/port.js');

/* demos */
var tradeDemo = require('./demos/trade_demo.js');
var navigateDemo = require('./demos/navigate_demo.js');

/* set up objects to hold current state */
var cache = require('./game/object_cache.js');

/* connect to server on startup */
client.connect(2002, '127.0.0.1', function() {
    console.log('connected');
    writeMainHelp();
    writeCursor();
});

/* add handler for data arriving on socket */
client.on('data', function(fromServerBuffer) {    
    var fromServer = fromServerBuffer.toString('utf8');
    //console.log("got from server:" + fromServer);

    /* update correct state object */
    updateState(fromServer);    

    writeCursor();
});

/* add handler for socket close event */
client.on('close', function() {
    console.error('* CONNECTION CLOSED *');
    process.exit();
});

/* listen on stdin for user input */
inStream.addListener('data', function(command) {
    command = command + '';
    command = command.replace(/\n$/, ''); /* dump newline */

    handleCommand(command);
});

function handleCommand(cmd) {
    if (cmd === 'Q' || cmd === 'q') {        
        quitGame();
    } else if (cmd === 'nav.demo') {
        navigateDemo.start(cursor);
    } else if (cmd === 'trade.demo') {
        tradeDemo.start(cursor);
    } else {
        client.write(cmd, null, function() {
            //console.log('write complete.');
        });        
    }
}

function quitGame() {
    client.write('__QUIT__');
    client.destroy();
    process.exit();
}

function writeCursor() {
    cursor.reset().bold()
    .hex('#4B0082').write("Command [")
    .hex('#FFD700').write("TL=00:00:00")
    .hex('#4B0082').write("]")
    .white().write(":")
    .hex('#4B0082').write("[")
    .cyan().write(gameState.sectorId + "")
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
    console.log('--> data:' + data);
    data = JSON.parse(data);

    /* check type */
    if (data && data.type) {
        console.log(data.type);
        if (data.type === 'SECTOR') {
            cache.sectors[data.id] = new Sector(data);
            cache.sectors[data.id].writeSector(cursor);
        } else if (data.type === 'PORT') {
            cache.ports[data.id] = new Port(data);
            cache.ports[data.id].writePortShort(cursor);
        }
    }
}
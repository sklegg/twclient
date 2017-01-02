var net = require('net');               /* socket to server */
var ansi = require('ansi');             /* ANSI colors */
var reader  = require('readline-sync');   /* read input */

/* add ANSI functionality to stdout */
var cursor = ansi(process.stdout);

/* get the fun started */
var inStream = process.openStdin(); 
var outStream = cursor;

/* include game objects */
var gameState = require('./game/current_state.js');
var Sector = require('./game/gameobjects/sector.js');
var Port = require('./game/gameobjects/port.js');

/* demos */
var tradeDemo = require('./demos/trade_demo.js');
var navigateDemo = require('./demos/navigate_demo.js');

/* set up objects to hold current state */
var cache = require('./game/object_cache.js');

var gameIO = {out: cursor, in: reader};

/* connect to server on startup */
var client = new net.Socket();
client.connect(2002, '127.0.0.1', function() {
    console.log('* CONNECTED *');    
    writeCursor();
});

/* add handler for data arriving on socket */
client.on('data', function(fromServerBuffer) {    
    var fromServer = fromServerBuffer.toString('utf8');
    //console.log("got from server:" + fromServer);

    if (fromServer.indexOf('Error') > 0) {
        console.error('Server error!');
    } else {
        /* update correct state object */
        updateState(fromServer);

        writeCursor();
    }    
});

/* add handler for socket close event */
client.on('close', function() {
    console.error('* CONNECTION CLOSED *');
    quitGame();
});

function handleCommand(cmd) {
    if (cmd === 'Q' || cmd === 'q') {        
        quitGame();
    } else if (cmd === '?') {
        writeMainHelp();
    } else if (cmd === 'nav.demo') {
        navigateDemo.start(gameIO, sector, gameState);
    } else if (cmd === 'trade.demo') {        
        tradeDemo.start(gameIO, cache.sectors[gameState.sectorId], gameState);
        writeCursor();
    } else {
        /* for demo/testing, send input directly to server */
        client.write(cmd, null, function() {
            //console.log('write complete.');
        });        
    }
}

function quitGame() {
    client.write('__QUIT__');
    client.destroy();
    reader.close();
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
    .hex('#4B0082').write(")?:")
    .reset();
    
    var answer = reader.question(' ');
    handleMainMenu(answer);        
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

function handleMainMenu(command) {
    console.log("handleMainMenu: " , command);
    handleCommand(command);
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
            gameState.sectorId = data.id;
            cache.sectors[data.id].writeSector(cursor);
        } else if (data.type === 'PORT') {
            cache.ports[data.id] = new Port(data);
            cache.ports[data.id].writePortShort(cursor);
        }
    }
}
module.exports.start = function (gameIO, sector, state) {
    var cursor = gameIO.out, reader = gameIO.in;
    
    if (!sector) {
        console.log('no sector object');
        return;
    }

    if (!sector.port) {
        console.log('no port in this sector');
        return;
    }
    
    --state.turnsRemaining;
    cursor.bold();
    cursor.write('Docking... \nOne turn deducted, ' + state.turnsRemaining + ' turns left.\n\n');

    sector.port.writePortFull(cursor);

    cursor.bold().cyan().write('\nTrade (F)uel, (O)rganics, or (E)quipment? ');

    var tradingResource = reader.question(' ');
    if (tradingResource === 'F' || tradingResource === 'O' || tradingResource === 'E') {
        console.log(tradingResource);
    } else {
        console.log('wtf');
    }
    
    cursor.hex('#4B0082').write('We are buying up to ' + 
        (sector.port.maxFuel - sector.port.currentFuel) + 
        '. You have x in your holds\n');
    cursor.write('How many holds of Fuel do you want to sell? ');
    var tradingAmount = reader.question(' ');

    cursor.cyan().write('Agreed, ' + tradingAmount + ' units.\n\n');

    cursor.hex('#336600').write('We\'ll buy them for ' + tradingAmount * 55 + ' credits.\n');
    cursor.hex('#4B0082').write('Your offer? ');

    var offerAmount = reader.question(' ');
    cursor.write('You\'re robbing me, but we\'ll buy them anyway.');

    cursor.reset();
    console.log('END TRADE DEMO\n\n');
};
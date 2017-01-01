var Port = require('./port.js');

module.exports = class Sector {
    constructor(inSector) {
        this.sectorNumber = inSector.id;
        this.sectorName = inSector.name;
        this.beacon = inSector.beacon;
        this.warps = inSector.neighbors;
        this.port = new Port(inSector.port);
    }

    writeSector(cursor) {
        //console.log('writing sector');
        
        cursor.reset().bold()
            .hex('#32CD32').write('Sector   ')
            .hex('#FFD700').write(': ')
            .cyan().write(this.sectorNumber + " ")
            .green().write("in ")
            .hex('#32CD32').write(this.sectorName + '.\n');

        if (this.beacon) {
            cursor.hex('#4B0082').write("Beacon   ")
                .hex('#FFD700').write(': ')
                .red().write(this.beacon + '\n')
        }

        /* if this sector has a port, fetch and write short desc */
        if (this.port) {
            this.port.writePortShort(cursor);
        }


        cursor.hex('#32CD32').write('Warps to Sector(s) ')
            .hex('#FFD700').write(': ');

        this.warps.forEach(function(s) {
            cursor.cyan().write('(' + s + ')')
                .green().write(' - ');    
        });
    
        cursor.write('\n\n').reset();
    }
}
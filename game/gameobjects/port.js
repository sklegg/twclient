module.exports = class Port {
    constructor(inPort) {
        this.id = inPort.id;
        this.portName = inPort.portName;
        this.portClass = inPort.portClass;
        this.sellsFuel = inPort.sellsFuel;
        this.buysFuel = inPort.buysFuel;
        this.sellsOrganics = inPort.sellsOrganics;
        this.buysOrganics = inPort.buysOrganics;
        this.sellsEquipment = inPort.sellsEquipment;
        this.buysEquipment = inPort.buysEquipment;
        this.dockingLog = 'No current ship docking log on file.';
        
        /* TODO: make this work for real */
        this.currentFuel = 100;
        this.currentOrganics = 100;
        this.currentEquipment = 100;
        this.maxFuel = 500;
        this.maxOrganics = 500;
        this.maxEquipment = 500;

    }

    writePortShort(cursor) {
        cursor.bold()
        .hex('#4B0082').write('Ports    ')
        .hex('#FFD700').write(': ')
        .cyan().write(this.portName)
        .hex('#FFD700').write(', ')
        /* indigo */
        .hex('#4B0082').write('Class ')
        .cyan().write(this.portClass + '')
        .hex('#4B0082').write(' (')
        /* default dark green */
        .hex('#336600').write((this.buysFuel ? 'B' : 'S') + (this.buysOrganics ? 'B' : 'S') + (this.buysEquipment ? 'B' : 'S'))
        .hex('#4B0082').write(')\n')
        .reset();
    }

    writePortFull(cursor) {
        //console.log('writing port (full)');

        /* TODO: finish this */
        cursor.bold()
        .hex('#4B0082').write('Commerce Report for ' + this.portName + '\n\n\n')
        .write('-=-=-       Docking Log       -=-=-\n')
        .write(this.dockingLog + '\n\n')
        .hex('#336600').write(' Items    Status  Trading % of max OnBoard\n')
        .hex('#4B0082').write(' -----    ------  ------- -------- -------\n')
                .cyan().write('Fuel Ore  Buying    ' + this.currentFuel + '     %     ???\n')
                       .write('Organics  Selling   ' + this.currentOrganics + '     %   ???\n')
                       .write('Equipment Selling   ' + this.currentEquipment + '     %   ???\n')
        .reset();
    }
};
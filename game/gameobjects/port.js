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
        console.log('writing port (full)');

        cursor.bold()
        .hex('#4B0082').write('Commerce Report for ' + this.portName + '\n\n\n')
        .write('-=-=-       Docking Log       -=-=-\n')
        .write(this.dockingLog + '\n\n')
        .hex('#336600').write(' Items    Status  Trading % of max OnBoard\n')
        .hex('#4B0082').write(' -----    ------  ------- -------- -------\n')
        .cyan().write('Fuel Ore\nOrganics\nEquipment\n')
        .reset();
    }
};
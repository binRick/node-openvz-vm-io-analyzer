var vzIO = require('./eventEmittingClient');

vzIO.E.on('VMs', function(VMs) {
    console.log('wow so vms', VMs[0]);
});

vzIO.Start();
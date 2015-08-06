var vzIO = require('./eventEmittingClient');


_ = require('underscore');

vzIO.E.on('VMs', function(VMs) {

	var dVMs = VMs.map(function(vm){
		var O = {
			ctid: vm.ctid,
	    lastReads: vm.lastReads,
	    updates: vm.updates,
//	    keys: _.keys(vm),
			Rate: vm.curRatePretty,
		};
		return O;
	});

	console.log(JSON.stringify(dVMs));
});

vzIO.Start();

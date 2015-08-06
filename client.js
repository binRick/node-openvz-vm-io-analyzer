var vzStat = require('./'),
    clear = require('cli-clear'),
    pj = require('prettyjson'),
    pb = require('pretty-bytes'),
    _ = require('underscore'),
    speedometer = require('speedometer');

var Freq = 5000;
var VMs = {};
var debug = true;

setInterval(function() {
    vzStat.collectReads({}, function(e, reads) {
        if (e) throw e;
        _.each(reads, function(read) {
            if (!_.contains(_.keys(VMs), read.ctid))
                VMs[read.ctid] = {
                    ctid: read.ctid,
                    updates: 0,
                    reads: 0,
                    totalReads: 0,
                    startReads: read.reads,
                    speed: new speedometer(Freq / 1000),
                    curRate: 0,
		    curRatePretty: '',
                    rates: []
                };

            else {
                VMs[read.ctid].updates++;
                VMs[read.ctid].curRate = VMs[read.ctid].speed(read.reads - VMs[read.ctid].startReads);
		VMs[read.ctid].curRatePretty = pb(Math.round(VMs[read.ctid].curRate,0)) + '/sec';
		VMs[read.ctid].Frequency = Freq;
                VMs[read.ctid].rates.push({
                    ts: new Date().getTime(),
                    rate: VMs[read.ctid].curRate
                });
            }
        });

VMs = _.toArray(VMs);


        _.each(VMs, function(vm) {
	if(debug){
            if (vm && vm.curRate && vm.curRate > 0)
                console.log(vm.ctid, vm.curRatePretty);
	//	console.log(pj.render(vm));
	}
        });
    });
}, Freq);

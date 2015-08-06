var vzStat = require('./'),
    pb = require('pretty-bytes'),
    _ = require('underscore'),
    speedometer = require('speedometer');





var Freq = 5000;

var VMs = {};

setInterval(function() {
    vzStat.collectReads({}, function(e, reads) {
        if (e) throw e;
        _.each(reads, function(read) {
            if (!_.contains(_.keys(VMs), read.ctid))
                VMs[read.ctid] = {
                    ctid: read.ctid,
                    updates: 0,
                    reads: 0,
                    readsPerSecond: 0,
                    totalReads: 0,
                    startReads: read.reads,
                    speed: new speedometer(Freq / 1000),
                    curSpeed: 0,
                    rates: []
                };

            else {
                VMs[read.ctid].updates++;
                VMs[read.ctid].curSpeed = VMs[read.ctid].speed(read.reads - VMs[read.ctid].startReads);
                VMs[read.ctid].rates.push({
                    ts: new Date().getTime(),
                    rate: VMs[read.ctid].curSpeed
                });
            }
        });
        _.each(VMs, function(vm) {
            if (vm.curSpeed > 0)
                console.log(vm.ctid, pb(Math.round(vm.curSpeed, 0)));
        });
    });
}, Freq);
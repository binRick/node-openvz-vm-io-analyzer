var vzStat = require('./'),
    clear = require('cli-clear'),
    pj = require('prettyjson'),
    pb = require('pretty-bytes'),
    _ = require('underscore'),
    speedometer = require('speedometer');
var EE = require('events').EventEmitter;

module.exports.E = new EE();

module.exports.Start = function(Options) {

    var Freq = 1000;
    var VMs = {};
    var debug = false;

    setInterval(function() {
        vzStat.collectReads({}, function(e, reads) {
            if (e) throw e;
            //	console.log(reads[reads.length-1]);
            //console.log(VMs[ reads[reads.length-1].ctid ]);

            _.each(reads, function(read) {
                if (!VMs[read.ctid])
                    VMs[read.ctid] = {
                        ctid: read.ctid,
                        updates: 0,
                        startReads: read.reads,
		    lastReads: read.reads,
                        speed: new speedometer(Freq / 1000),
                        curRate: 0,
                        intervalReads: read.reads,
                        curRatePretty: '',
                        rates: []
                    };

                else {
                    VMs[read.ctid].updates++;
                    VMs[read.ctid].Frequency = Freq;
		   // - VMs[read.ctid].lastReads;
                    VMs[read.ctid].curRate = VMs[read.ctid].speed(read.reads - VMs[read.ctid].lastReads);
                    VMs[read.ctid].curRatePretty = pb(Math.round(VMs[read.ctid].curRate, 0)) + '/sec';
                    VMs[read.ctid].lastReads = read.reads;
                    VMs[read.ctid].rates.push({
                        ts: new Date().getTime(),
                        rate: VMs[read.ctid].curRate
                    });
                }
            });

            var A = [];
            _.each(VMs, function(vm) {
                A.push(vm);
            });
            A = A.map(function(a) {
                return a;
            });
            sortedVMs = A.sort(function(a, b) {
                return b.curRate - a.curRate;
            });

            var Emitted = {};
            if (debug)
                clear();
            //	module.exports.Events.emit('VMs', sortedVMs);
            module.exports.E.emit('VMs', sortedVMs);
            _.each(sortedVMs, function(vm) {
                if (debug) {
                    console.log(vm.ctid, vm.curRatePretty);
                }
            });
        });
    }, Freq);

};

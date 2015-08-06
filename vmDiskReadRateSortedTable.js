var Table = require("terminal-table"),
    clear = require('cli-clear'),
    humanTime = require('humanize-time'),
    moment = require('moment'),
    pb = require('pretty-bytes'),
    c = require('chalk'),
    child = require('child_process'),
    trim = require('trim'),
    _ = require('underscore');
var vzIO = require('./eventEmittingClient');

vzIO.E.on('VMs', function(VMs) {
    var dVMs = VMs.map(function(vm) {
        var O = {
            ctid: vm.ctid,
            lastReads: vm.lastReads,
            updates: vm.updates,
            Rate: vm.curRatePretty,
        };
        return O;
    });
	if(dVMs[0].Rate=='')return;
    clear();



    var t = new Table({
        borderStyle: 3,
        horizontalLine: true,
        rightPadding: 0,
        leftPadding: 1
    });
    var Bytes = function(i) {
        return pb(parseInt(i));
    };
    var renders = {
        creation: function(i) {
            return i;
            return moment(parseInt(i)).format('YYYY MM DD');
        },
        diff: function(i) {
            return humanTime(parseInt(i));
        },
        used: Bytes,
        available: Bytes,
        referenced: Bytes,
        usedbysnapshots: Bytes,
        logicalused: Bytes,
    };

    var cols = ['ctid', 'Rate'];
    var dCols = ['State', 'CTID', 'Read Rate'];

    t.push(dCols);
    var Rates = [{
        ctid: 1,
        Rate: 'a 1/s'
    }, {
        ctid: 2,
        Rate: 'b 2/s'
    }];
    _.each(dVMs, function(vm, index, arr) {
        var Row = ["✓", c.green.bold(vm.ctid), c.yellow.bold(vm.Rate)];
	if(vm.Rate.length>0)
        t.push(Row);
    });


    t.attrRange({
        row: [0, 1]
    }, {
        align: "center",
        color: "blue",
        bg: "black"
    });

    t.attrRange({
        column: [0, 1]
    }, {
        color: "green"
    });
    t.attrRange({
        column: [5, 6],
    }, {
        color: "green"
    });




    t.attrRange({
        column: [1, 2]
    }, {
        color: "red",
    });

    t.attrRange({
        row: [1],
        column: [1]
    }, {
        leftPadding: 5
    });

    console.log("" + t);








    //    console.log(JSON.stringify(dVMs));
});
vzIO.Start();

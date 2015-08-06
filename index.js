var c = require('chalk'),
    pj = require('prettyjson'),
    _ = require('underscore'),
    child = require('child_process'),
    fs = require('fs');

child.execSync = child.execSync || require('exec-sync');

module.exports.collectReads = function(Options, _cb) {

    var cmd = 'grep read /proc/bc/*/ioacct|  grep ^/proc/bc/[0-9]*.[0-9]/| sed -e \'s/\\// /g\' | sed -e \'s/[[:space:]]\\+/ /g\'| cut -d\' \' -f4,7| uniq | sort -k2 -n';
    var preCmd = 'ssh beo ssh corvus ';
    cmd = preCmd + '\"' + cmd + '\"';
    //    console.log(c.green.bgBlack('Running Command', cmd));
    var out = child.execSync(cmd).toString().split('\n').filter(function(s) {
        return s;
    }).map(function(s) {
        return {
            ctid: parseInt(s.split(' ')[0]),
            reads: parseInt(s.split(' ')[1]),
        };
    }).sort(function(a, b) {
        return a.reads - b.reads;
    });
    //    console.log(out);
    _cb(null, out);
};
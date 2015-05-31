'use strict';

var parseWaveLane = require('./parse-wave-lane');

function data_extract (e) {
    var tmp;

    tmp = e.data;
    if (tmp === undefined) { return null; }
    if (typeof (tmp) === 'string') { return tmp.split(' '); }
    return tmp;
}

function parseWaveLanes (sig, lane) {
    var x,
        sigx,
        content = [],
        tmp0 = [];

    for (x in sig) {
        sigx = sig[x];
        lane.period = sigx.period ? sigx.period    : 1;
        lane.phase  = sigx.phase  ? sigx.phase * 2 : 0;
        content.push([]);
        tmp0[0] = sigx.name  || ' ';
        tmp0[1] = sigx.phase || 0;
        content[content.length - 1][0] = tmp0.slice(0);
        content[content.length - 1][1] = sigx.wave ? parseWaveLane(sigx.wave, lane.period * lane.hscale - 1, lane) : null;
        content[content.length - 1][2] = data_extract(sigx);
    }
    return content;
}

module.exports = parseWaveLanes;

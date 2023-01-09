'use strict';

const parseWaveLane = require('./parse-wave-lane.js');

function data_extract (e, num_unseen_markers) {
    let ret_data = e.data;
    if (ret_data === undefined) { return null; }
    if (typeof (ret_data) === 'string') {
        ret_data = ret_data.trim().split(/\s+/);
    }
    // slice data array after unseen markers
    ret_data = ret_data.slice( num_unseen_markers );
    return ret_data;
}

function parseWaveLanes (sig, lane) {
    const content = [];
    const tmp0 = [];

    sig.map(function (sigx) {
        const current = [];
        content.push(current);

        lane.period = sigx.period || 1;
        // xmin_cfg is min. brick of hbounds, add to lane.phase of all signals
        lane.phase = (sigx.phase ? sigx.phase * 2 : 0) + lane.xmin_cfg;
        tmp0[0] = sigx.name || ' ';
        // xmin_cfg is min. brick of hbounds, add 1/2 to sigx.phase of all sigs
        tmp0[1] = (sigx.phase || 0) + lane.xmin_cfg/2;

        let content_wave = null;
        let num_unseen_markers;
        if (typeof sigx.wave === 'string') {
            const parsed_wave_lane = parseWaveLane(sigx.wave, lane.period * lane.hscale - 1, lane);
            content_wave = parsed_wave_lane[0] ;
            num_unseen_markers = parsed_wave_lane[1];
        }
        current.push(
            tmp0.slice(0),
            content_wave,
            data_extract(sigx, num_unseen_markers),
            sigx
        );
    });
    // content is an array of arrays, representing the list of signals using
    //  the same order:
    // content[0] = [ [name,phase], parsedwavelaneobj, dataextracted ]
    return content;
}

module.exports = parseWaveLanes;

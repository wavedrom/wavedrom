'use strict';

const tt = require('onml/tt.js');

function renderGapUses (text, lane) {
    const res = [];
    const Stack = (text || '').split('');
    let pos = 0;
    let subCycle = false;
    while (Stack.length) {
        let next = Stack.shift();
        if (next === '<') { // sub-cycles on
            subCycle = true;
            next = Stack.shift();
        }
        if (next === '>') { // sub-cycles off
            subCycle = false;
            next = Stack.shift();
        }
        if (subCycle) {
            pos += 1;
        } else {
            pos += (2 * lane.period);
        }
        if (next === '|') {
            res.push(['use', tt(
                lane.xs * ((pos - (subCycle ? 0 : lane.period)) * lane.hscale - lane.phase),
                0,
                {'xlink:href': '#gap'}
            )]);
        }
    }
    return res;
}

function renderGaps (source, index, lane) {
    let res = [];
    if (source) {
        for (const key of Object.keys(source)) {
            const val = source[key];
            lane.period = val.period ? val.period : 1;
            lane.phase  = (val.phase  ? val.phase * 2 : 0) + lane.xmin_cfg;

            if (typeof val.wave === 'string') {
                const gaps = renderGapUses(val.wave, lane);
                res = res.concat([['g', tt(
                    0,
                    lane.y0 + key * lane.yo,
                    {id: 'wavegap_' + key + '_' + index}
                )].concat(gaps)]);
            }
        }
    }
    return ['g', {id: 'wavegaps_' + index}].concat(res);
}

module.exports = renderGaps;

'use strict';

function renderGapUses (text, lane) {
    var res = [];
    var Stack = (text || '').split('');
    var pos = 0;
    var next;
    var subCycle = false;
    while (Stack.length) {
        next = Stack.shift();
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
            res.push(['use', {
                'xlink:href': '#gap',
                transform: 'translate(' + (lane.xs * ((pos - (subCycle ? 0 : lane.period)) * lane.hscale - lane.phase)) + ')'
            }]);
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
                res = res.concat([['g', {
                    id: 'wavegap_' + key + '_' + index,
                    transform: 'translate(0,' + (lane.y0 + key * lane.yo) + ')'
                }].concat(gaps)]);
            }
        }
    }
    return ['g', {id: 'wavegaps_' + index}].concat(res);
}

module.exports = renderGaps;

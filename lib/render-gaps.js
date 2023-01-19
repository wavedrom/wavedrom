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


function renderGaps (lanes, index, source, lane) {
    let res = [];
    if (lanes) {
        const lanesLen = lanes.length;

        const vline = (x) => ['line', {
            x1: x, x2: x,
            y2: lanesLen * lane.yo,
            style: 'stroke:#000;stroke-width:1px'
        }];

        const backDrop = ['rect', {
            width: 4,
            height: lanesLen * lane.yo,
            style: 'fill:#ffffffcc;stroke:none'
        }];

        if (source && typeof source.gaps === 'string') {
            const scale = lane.hscale * lane.xs * 2;

            for (let x = 0; x < source.gaps.length; x++) {
                const c = source.gaps[x];
                if (c.match(/^[.]$/)) {
                    continue;
                }
                const offset = (c === c.toLowerCase()) ? 0.5 : 0;

                let marks = [];
                switch(c) {
                case '0': marks = [backDrop]; break;
                case '1': marks = [backDrop, vline(2)]; break;
                case '2': marks = [backDrop, vline(0), vline(4)]; break;
                case '3': marks = [backDrop, vline(0), vline(2), vline(4)]; break;
                case 's':
                    for (let idx = 0; idx < lanesLen; idx++) {
                        if (lanes[idx] && lanes[idx].wave && lanes[idx].wave.length > x) {
                            marks.push(['use', tt(2, 5 + lane.yo * idx, {'xlink:href': '#gap'})]);
                        }
                    }
                    break;
                }


                res.push(['g', tt(scale * (x + offset) - 2)].concat(marks));
            }
        }
        for (let idx = 0; idx < lanesLen; idx++) {
            const val = lanes[idx];
            lane.period = val.period ? val.period : 1;
            lane.phase  = (val.phase  ? val.phase * 2 : 0) + lane.xmin_cfg;

            if (typeof val.wave === 'string') {
                const gaps = renderGapUses(val.wave, lane);
                res = res.concat([['g', tt(
                    0,
                    lane.y0 + idx * lane.yo,
                    {id: 'wavegap_' + idx + '_' + index}
                )].concat(gaps)]);
            }
        }
    }
    return ['g', {id: 'wavegaps_' + index}].concat(res);
}

module.exports = renderGaps;

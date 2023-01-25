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

        const lineStyle = 'fill:none;stroke:#000;stroke-width:1px';
        const bracket = {
            square: {
                left:  ['path', {d: 'M  2 0 h -4 v ' + (lanesLen * lane.yo - 1) + ' h  4', style: lineStyle}],
                right: ['path', {d: 'M -2 0 h  4 v ' + (lanesLen * lane.yo - 1) + ' h -4', style: lineStyle}]
            },
            round: {
                left:      ['path', {d: 'M  2 0 a 4 4 0 0 0 -4 4 v ' + (lanesLen * lane.yo - 9) + ' a 4 4 0 0 0  4 4', style: lineStyle}],
                right:     ['path', {d: 'M -2 0 a 4 4 1 0 1  4 4 v ' + (lanesLen * lane.yo - 9) + ' a 4 4 1 0 1 -4 4', style: lineStyle}],
                rightLeft: ['path', {
                    d:  'M -5 0 a 4 4 1 0 1  4 4 v ' + (lanesLen * lane.yo - 9) + ' a 4 4 1 0 1 -4 4' +
                        'M  5 0 a 4 4 0 0 0 -4 4 v ' + (lanesLen * lane.yo - 9) + ' a 4 4 0 0 0  4 4',
                    style: lineStyle
                }],
                leftLeft: ['path', {
                    d:  'M  2 0 a 4 4 0 0 0 -4 4 v ' + (lanesLen * lane.yo - 9) + ' a 4 4 0 0 0  4 4' +
                        'M  5 1 a 3 3 0 0 0 -3 3 v ' + (lanesLen * lane.yo - 9) + ' a 3 3 0 0 0  3 3',
                    style: lineStyle
                }],
                rightRight: ['path', {
                    d:  'M -5 1 a 3 3 1 0 1  3 3 v ' + (lanesLen * lane.yo - 9) + ' a 3 3 1 0 1 -3 3' +
                        'M -2 0 a 4 4 1 0 1  4 4 v ' + (lanesLen * lane.yo - 9) + ' a 4 4 1 0 1 -4 4',
                    style: lineStyle
                }]
            }
        };

        const backDrop = (w) => ['rect', {
            x: -w / 2,
            width: w,
            height: lanesLen * lane.yo,
            style: 'fill:#ffffffcc;stroke:none'
        }];

        if (source && typeof source.gaps === 'string') {
            const scale = lane.hscale * lane.xs * 2;

            const gaps = source.gaps.trim().split(/\s+/);

            for (let x = 0; x < gaps.length; x++) {
                const c = gaps[x];
                if (c.match(/^[.]$/)) {
                    continue;
                }
                const offset = (c === c.toLowerCase()) ? 0.5 : 0;

                let marks = [];
                switch(c) {
                case '0': marks = [backDrop(4)]; break;
                case '1': marks = [backDrop(4), vline(0)]; break;
                case '|': marks = [backDrop(4), vline(0)]; break;
                case '2': marks = [backDrop(4), vline(-2), vline(2)]; break;
                case '3': marks = [backDrop(6), vline(-3), vline(0), vline(3)]; break;
                case '[': marks = [backDrop(4), bracket.square.left]; break;
                case ']': marks = [backDrop(4), bracket.square.right]; break;
                case '(': marks = [backDrop(4), bracket.round.left]; break;
                case ')': marks = [backDrop(4), bracket.round.right]; break;
                case ')(': marks = [backDrop(8), bracket.round.rightLeft]; break;
                case '((': marks = [backDrop(8), bracket.round.leftLeft]; break;
                case '))': marks = [backDrop(8), bracket.round.rightRight]; break;
                case 's':
                    for (let idx = 0; idx < lanesLen; idx++) {
                        if (lanes[idx] && lanes[idx].wave && lanes[idx].wave.length > x) {
                            marks.push(['use', tt(2, 5 + lane.yo * idx, {'xlink:href': '#gap'})]);
                        }
                    }
                    break;
                }


                res.push(['g', tt(scale * (x + offset))].concat(marks));
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
} /* eslint complexity: [1, 100] */

module.exports = renderGaps;

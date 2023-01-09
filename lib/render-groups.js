'use strict';

const tspan = require('tspan');
const tt = require('onml/tt.js');

function renderGroups (groups, index, lane) {
    const res = ['g'];

    groups.map((e, i) => {
        res.push(['path',
            {
                id: 'group_' + i + '_' + index,
                d: ('m ' + (e.x + 0.5) + ',' + (e.y * lane.yo + 3.5 + lane.yh0 + lane.yh1)
                    + ' c -3,0 -5,2 -5,5 l 0,' + (e.height * lane.yo - 16)
                    + ' c 0,3 2,5 5,5'),
                style: 'stroke:#0041c4;stroke-width:1;fill:none'
            }
        ]);

        if (e.name === undefined) {
            return;
        }

        const x = e.x - 10;
        const y = lane.yo * (e.y + (e.height / 2)) + lane.yh0 + lane.yh1;
        const ts = tspan.parse(e.name);
        res.push(['g', tt(x, y),
            ['g', {transform: 'rotate(270)'},
                ['text', {
                    'text-anchor': 'middle',
                    class: 'info',
                    'xml:space': 'preserve'
                }].concat(ts)
            ]
        ]);
    });
    return res;
}

module.exports = renderGroups;

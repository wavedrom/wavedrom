'use strict';

var tspan = require('tspan');

function renderGroups (groups, index, lane) {
    var x, y, res = ['g'], ts;

    groups.forEach(function (e, i) {
        res.push(['path',
            {
                id: 'group_' + i + '_' + index,
                d: ('m ' + (e.x + 0.5) + ',' + (e.y * lane.yo + 3.5 + lane.yh0 + lane.yh1)
                    + ' c -3,0 -5,2 -5,5 l 0,' + (e.height * lane.yo - 16)
                    + ' c 0,3 2,5 5,5'),
                style: 'stroke:#0041c4;stroke-width:1;fill:none'
            }
        ]);

        if (e.name === undefined) { return; }

        x = (e.x - 10);
        y = (lane.yo * (e.y + (e.height / 2)) + lane.yh0 + lane.yh1);
        ts = tspan.parse(e.name);
        ts.unshift(
            'text',
            {
                'text-anchor': 'middle',
                class: 'info',
                'xml:space': 'preserve'
            }
        );
        res.push(['g', {transform: 'translate(' + x + ',' + y + ')'}, ['g', {transform: 'rotate(270)'}, ts]]);
    });
    return res;
}

module.exports = renderGroups;

'use strict';

var jsonmlParse = require('./create-element'),
    w3 = require('./w3');

function renderGroups (root, groups, index, lane) {
    var i, group, label, x, y, name;

    for (i in groups) {
        group = document.createElementNS(w3.svg, 'path');
        group.id = ('group_' + i + '_' + index);
        group.setAttribute('d', 'm ' + (groups[i].x + 0.5) + ',' + (groups[i].y * lane.yo + 3.5 + lane.yh0 + lane.yh1) + ' c -3,0 -5,2 -5,5 l 0,' + (groups[i].height * lane.yo - 16) + ' c 0,3 2,5 5,5');
        group.setAttribute('style', 'stroke:#0041c4;stroke-width:1;fill:none');
        root.insertBefore(group, null);

        name = groups[i].name;
        if (typeof name !== 'undefined') {
            if (typeof name === 'number') { name += ''; }
            x = (groups[i].x - 10);
            y = (lane.yo * (groups[i].y + (groups[i].height / 2)) + lane.yh0 + lane.yh1);
            label = jsonmlParse([
                'text',
                {
                    x: x,
                    y: y,
                    'text-anchor': 'middle',
                    // fill: '#0041c4',
                    class: 'info',
                    transform: 'rotate(270,' + x + ',' + y + ')'
                },
                name
            ]);
            label.setAttributeNS(w3.xmlns, 'xml:space', 'preserve');
            root.insertBefore(label, null);
        }
    }
}

module.exports = renderGroups;

/* eslint-env browser */

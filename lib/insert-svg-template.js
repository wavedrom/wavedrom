'use strict';

var w3 = require('./w3');

function insertSVGTemplate (index, source, lane, waveSkin, content, lanes, groups) {
    var first, e;

    for (first in waveSkin) { break; }

    e = waveSkin.default || waveSkin[first];

    if (source && source.config && source.config.skin && waveSkin[source.config.skin]) {
        e = waveSkin[source.config.skin];
    }

    if (index === 0) {
        lane.xs     = Number(e[3][1][2][1].width);
        lane.ys     = Number(e[3][1][2][1].height);
        lane.xlabel = Number(e[3][1][2][1].x);
        lane.ym     = Number(e[3][1][2][1].y);
    } else {
        e = ['svg',
            {
                id: 'svg',
                xmlns: w3.svg,
                'xmlns:xlink': w3.xlink
            },
            ['g', {id: 'waves'},
                ['g', {id: 'lanes'}],
                ['g', {id: 'groups'}]
            ]
        ];
    }

    var width = (lane.xg + (lane.xs * (lane.xmax + 1)));
    var height = (content.length * lane.yo + lane.yh0 + lane.yh1 + lane.yf0 + lane.yf1);

    e[e.length - 1][1].id    = 'waves_'  + index;

    e[e.length - 1][2][1].id = 'lanes_'  + index;
    e[e.length - 1][2][1].transform = 'translate(' + (lane.xg + 0.5) + ', ' + ((lane.yh0 + lane.yh1) + 0.5) + ')';
    e[e.length - 1][2] = e[e.length - 1][2].concat(lanes);

    e[e.length - 1][3][1].id = 'groups_' + index;
    e[e.length - 1][3].push(groups);

    e[1].id = 'svgcontent_' + index;
    e[1].height = height;
    e[1].width = width;
    e[1].viewBox = '0 0 ' + width + ' ' + height;
    e[1].overflow = 'hidden';

    return e;
}

module.exports = insertSVGTemplate;

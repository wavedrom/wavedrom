'use strict';

var tspan = require('tspan');
var textWidth = require('./text-width.js');
var findLaneMarkers = require('./find-lane-markers');

function renderLaneUses (cont, lane) {
    var i, k;
    var res = [];
    var labels = [];
    if (cont[1]) {
        for (i = 0; i < cont[1].length; i += 1) {
            res.push(['use', {
                'xlink:href': '#' + cont[1][i],
                transform: 'translate(' + (i * lane.xs) + ')'
            }]);
        }
        if (cont[2] && cont[2].length) {
            labels = findLaneMarkers(cont[1]);
            if (labels.length) {
                for (k in labels) {
                    if (cont[2] && (cont[2][k] !== undefined)) {
                        res.push(['text', {
                            x: labels[k] * lane.xs + lane.xlabel,
                            y: lane.ym,
                            'text-anchor': 'middle',
                            'xml:space': 'preserve'
                        }].concat(tspan.parse(cont[2][k])));
                    }
                }
            }
        }
    }
    return res;
}

function renderWaveLane (content, index, lane) {
    var // i,
        j,
        name,
        xoffset,
        xmax     = 0,
        xgmax    = 0,
        glengths = [];

    var res = [];

    for (j = 0; j < content.length; j += 1) {
        name = content[j][0][0];
        if (name) { // check name

            xoffset = content[j][0][1];
            xoffset = (xoffset > 0)
                ? (Math.ceil(2 * xoffset) - 2 * xoffset)
                : (-2 * xoffset);

            res.push(['g', {
                id: 'wavelane_' + j + '_' + index,
                transform: 'translate(0,' + ((lane.y0) + j * lane.yo) + ')'
            },
            ['text', {
                x: lane.tgo,
                y: lane.ym,
                class: 'info',
                'text-anchor': 'end',
                'xml:space': 'preserve'
            }].concat(tspan.parse(name)),
            ['g', {
                id: 'wavelane_draw_' + j + '_' + index,
                transform: 'translate(' + (xoffset * lane.xs) + ', 0)'
            }].concat(renderLaneUses(content[j], lane))
            ]);

            xmax = Math.max(xmax, (content[j][1] || []).length);
            glengths.push(textWidth(name, 11));
        }
    }
    // xmax if no xmax_cfg,xmin_cfg, else set to config
    lane.xmax = Math.min(xmax, lane.xmax_cfg - lane.xmin_cfg);
    lane.xg = xgmax + 20;
    return {glengths: glengths, res: res};
}

module.exports = renderWaveLane;

'use strict';

const tt = require('onml/tt.js');
const tspan = require('tspan');
const textWidth = require('./text-width.js');
const findLaneMarkers = require('./find-lane-markers.js');
const renderOverUnder = require('./render-over-under.js');

function renderLaneUses (cont, lane) {
    const res = [];

    if (cont[1]) {
        cont[1].map(function (ref, i) {
            res.push(['use', tt(i * lane.xs, 0, {'xlink:href': '#' + ref})]);
        });
        if (cont[2] && cont[2].length) {
            const labels = findLaneMarkers(cont[1]);
            if (labels.length) {
                labels.map(function (label, i) {
                    if (cont[2] && (cont[2][i] !== undefined)) {
                        res.push(['text', {
                            x: label * lane.xs + lane.xlabel,
                            y: lane.ym,
                            'text-anchor': 'middle',
                            'xml:space': 'preserve'
                        }].concat(tspan.parse(cont[2][i])));
                    }
                });
            }
        }
    }
    return res;
}

function renderWaveLane (content, index, lane) {
    let xmax = 0;
    const glengths = [];
    const res = [];

    content.map(function (el, j) {
        const name = el[0][0];
        if (name) { // check name
            let xoffset = el[0][1];
            xoffset = (xoffset > 0)
                ? (Math.ceil(2 * xoffset) - 2 * xoffset)
                : (-2 * xoffset);

            res.push(['g', tt(
                0,
                lane.y0 + j * lane.yo,
                {id: 'wavelane_' + j + '_' + index}
            )]
                .concat([['text', {
                    x: lane.tgo,
                    y: lane.ym,
                    class: 'info',
                    'text-anchor': 'end',
                    'xml:space': 'preserve'
                }]
                    .concat(tspan.parse(name))
                ])
                .concat([['g', tt(
                    xoffset * lane.xs,
                    0,
                    {id: 'wavelane_draw_' + j + '_' + index}
                )]
                    .concat(renderLaneUses(el, lane))
                ])
                .concat(
                    renderOverUnder(el[3], 'over', lane),
                    renderOverUnder(el[3], 'under', lane)
                )
            );
            xmax = Math.max(xmax, (el[1] || []).length);
            glengths.push(name.textWidth ? name.textWidth : name.charCodeAt ? textWidth(name, 11) : 0);
        }
    });
    // xmax if no xmax_cfg,xmin_cfg, else set to config
    lane.xmax = Math.min(xmax, lane.xmax_cfg - lane.xmin_cfg);
    const xgmax = 0;
    lane.xg = xgmax + 20;
    return {glengths: glengths, res: res};
}

module.exports = renderWaveLane;

'use strict';

var jsonmlParse = require('./create-element'),
    findLaneMarkers = require('./find-lane-markers');

function renderWaveLane (root, content, index, lane) {
    var i, j, k, g, gg, title, b, labels = [1], name,

    xmax     = 0,
    xgmax    = 0,
    glengths = [],
    svgns    = 'http://www.w3.org/2000/svg',
    xlinkns  = 'http://www.w3.org/1999/xlink',
    xmlns    = 'http://www.w3.org/XML/1998/namespace';

    for (j = 0; j < content.length; j += 1) {
        name = content[j][0][0];
        if (name) { // check name
            g = jsonmlParse([
                'g',
                {
                    id: 'wavelane_' + j + '_' + index,
                    transform: 'translate(0,' + ((lane.y0) + j * lane.yo) + ')'
                }
            ]);
            root.insertBefore(g, null);
            if (typeof name === 'number') { name += ''; }
            title = jsonmlParse([
                'text',
                {
                    x: lane.tgo,
                    y: lane.ym,
                    class: 'info',
                // fill: '#0041c4', // Pantone 288C
                    'text-anchor': 'end'
                },
                name // + '') // name
            ]);
            title.setAttributeNS(xmlns, 'xml:space', 'preserve');
            g.insertBefore(title, null);

            // scale = lane.xs * (lane.hscale) * 2;

            glengths.push(title.getBBox().width);

            var xoffset;
            xoffset = content[j][0][1];
            xoffset = (xoffset > 0) ? (Math.ceil(2 * xoffset) - 2 * xoffset) :
            (-2 * xoffset);
            gg = jsonmlParse([
                'g',
                {
                    id: 'wavelane_draw_' + j + '_' + index,
                    transform: 'translate(' + (xoffset * lane.xs) + ', 0)'
                }
            ]);
            g.insertBefore(gg, null);

            if (content[j][1]) {
                for (i = 0; i < content[j][1].length; i += 1) {
                    b    = document.createElementNS(svgns, 'use');
                    // b.id = 'use_' + i + '_' + j + '_' + index;
                    b.setAttributeNS(xlinkns, 'xlink:href', '#' + content[j][1][i]);
                    // b.setAttribute('transform', 'translate(' + (i * lane.xs) + ')');
                    b.setAttribute('transform', 'translate(' + (i * lane.xs) + ')');
                    gg.insertBefore(b, null);
                }
                if (content[j][2] && content[j][2].length) {
                    labels = findLaneMarkers(content[j][1]);

                    if (labels.length !== 0) {
                        for (k in labels) {
                            if (content[j][2] && (typeof content[j][2][k] !== 'undefined')) {
                                title = jsonmlParse([
                                    'text',
                                    {
                                        x: labels[k] * lane.xs + lane.xlabel,
                                        y: lane.ym,
                                        'text-anchor': 'middle'
                                    },
                                    content[j][2][k] // + '')
                                ]);
                                title.setAttributeNS(xmlns, 'xml:space', 'preserve');
                                gg.insertBefore(title, null);
                            }
                        }
                    }
                }
                if (content[j][1].length > xmax) {
                    xmax = content[j][1].length;
                }
            }
        }
    }
    lane.xmax = xmax;
    lane.xg = xgmax + 20;
    return glengths;
}

module.exports = renderWaveLane;

/* eslint-env browser */

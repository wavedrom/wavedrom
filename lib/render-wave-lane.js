'use strict';

var jsonmlParse = require('./create-element'),
    w3 = require('./w3'),
    findLaneMarkers = require('./find-lane-markers'),
    renderDraggableGaps = require('./render-draggable-gaps');

function renderWaveLane (root, content, index, lane) {
    var i,
        j,
        k,
        g,
        gg,
        title,
        b,
        hitRect,
        labels = [1],
        name,
        xoffset,
        xmax     = 0,
        xgmax    = 0,
        glengths = [];

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
                    'text-anchor': 'end'
                },
                name // + '') // name
            ]);
            title.setAttributeNS(w3.xmlns, 'xml:space', 'preserve');
            g.insertBefore(title, null);

            // scale = lane.xs * (lane.hscale) * 2;

            glengths.push(title.getBBox().width);

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
                    b = document.createElementNS(w3.svg, 'use');
                    // b.id = 'use_' + i + '_' + j + '_' + index;
                    b.setAttributeNS(w3.xlink, 'xlink:href', '#' + content[j][1][i]);
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
                                title.setAttributeNS(w3.xmlns, 'xml:space', 'preserve');
                                gg.insertBefore(title, null);
                            }
                        }
                    }
                }
                if (content[j][1].length > xmax) {
                    xmax = content[j][1].length;
                }
            }


            renderDraggableGaps(gg, content[j].wave, index,lane,j);


            //assign draggables
            if(content[j].draggable){
              g.setAttribute( 'class', 'wavedrom-draggable');
              g.setAttribute('transform', 'matrix(1 0 0 1 0 ' + ((lane.y0) + j * lane.yo) + ')');
              if(content[j][1]){
                hitRect = document.createElementNS(w3.svg, 'rect');
                hitRect.setAttribute( 'fill', 'transparent');
                hitRect.setAttribute( 'height', '24');
                hitRect.setAttribute( 'width', content[j][1].length*lane.xs);
                hitRect.setAttribute( 'x', '0');
                hitRect.setAttribute( 'y', '0');
                hitRect.setAttribute( 'class', 'wavedrom-draggable-hitbox');
              }
              g.appendChild(hitRect);

            }
        }
    }
    lane.xmax = xmax;
    lane.xg = xgmax + 20;
    return glengths;
}

module.exports = renderWaveLane;

/* eslint-env browser */

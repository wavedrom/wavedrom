'use strict';

const arcShape = require('./arc-shape.js');
const renderLabel = require('./render-label.js');

const renderArc = (Edge, from, to, shapeProps) =>
    ['path', {
        id: 'gmark_' + Edge.from + '_' + Edge.to,
        d: shapeProps.d || 'M ' + from.x + ',' + from.y + ' ' + to.x + ',' + to.y,
        style: shapeProps.style || 'fill:none;stroke:#00F;stroke-width:1'
    }];

const labeler = (lane, Events) => (element, i) => {
    const text = element.node;
    lane.period = element.period ? element.period : 1;
    lane.phase  = (element.phase ? element.phase * 2 : 0) + lane.xmin_cfg;
    if (text) {
        const stack = text.split('');
        let pos = 0;
        while (stack.length) {
            const eventname = stack.shift();
            if (eventname !== '.') {
                Events[eventname] = {
                    x: lane.xs * (2 * pos * lane.period * lane.hscale - lane.phase) + lane.xlabel,
                    y: i * lane.yo + lane.y0 + lane.ys * 0.5
                };
            }
            pos += 1;
        }
    }
};

const archer = (res, Events, arcFontSize) => (element) => {
    const words = element.trim().split(/\s+/);
    const Edge = {
        words: words,
        label: element.substring(words[0].length).substring(1),
        from:  words[0].substr(0, 1),
        to:    words[0].substr(-1, 1),
        shape: words[0].slice(1, -1)
    };
    const from = Events[Edge.from];
    const to = Events[Edge.to];

    if (from && to) {
        const shapeProps = arcShape(Edge, from, to);
        const lx = shapeProps.lx;
        const ly = shapeProps.ly;
        res.push(renderArc(Edge, from, to, shapeProps));
        if (Edge.label) {
            res.push(renderLabel({x: lx, y: ly}, Edge.label, arcFontSize));
        }
    }
};

function renderArcs (lanes, index, source, lane) {
    const arcFontSize = (source && source.config && source.config.arcFontSize)
        ? source.config.arcFontSize
        : 11;

    const res = ['g', {id: 'wavearcs_' + index}];
    const Events = {};
    if (Array.isArray(lanes)) {
        lanes.map(labeler(lane, Events));
        if (Array.isArray(source.edge)) {
            source.edge.map(archer(res, Events, arcFontSize));
        }
        Object.keys(Events).map(function (k) {
            if (k === k.toLowerCase()) {
                if (Events[k].x > 0) {
                    res.push(renderLabel({
                        x: Events[k].x,
                        y: Events[k].y
                    }, k + '', arcFontSize));
                }
            }
        });
    }
    return res;
}

module.exports = renderArcs;

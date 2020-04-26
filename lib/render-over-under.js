'use strict';

var styles = {
    0: 'stroke:#000',
    1: 'stroke:#000',
    2: 'stroke:#F00',
    3: 'stroke:#00F',
    4: 'stroke:#0F0',
    5: 'stroke:#FF0',
    6: 'stroke:#0FF',
    7: 'stroke:#F0F'
};

function renderOverUnder (el, key, lane) {
    var xs = lane.xs;
    var ys = lane.ys;
    var period = (el.period || 1) * 2 * xs;
    var xoffset = -(el.phase || 0) * 2 * xs;
    var gap1 = 12;
    var style;

    var y = (key === 'under') ? ys : 0;

    if (el[key]) {
        var res = ['g', {
            transform: 'translate(' + xoffset + ',' + y + ')',
            style: 'stroke-width:3'
        }];

        let start;
        const arr = el[key].split('');
        arr.map(function (dot, i) {
            if ((dot !== '.') && (start !== undefined)) {
                res.push(['line', {
                    style: style,
                    x1: period * start + gap1,
                    x2: period * i // + gap2
                }]);
            }
            if (dot === '0') {
                start = undefined;
            } else
            if (dot !== '.') {
                start = i;
                style = styles[dot] || styles[0];
            }
        });
        if (start !== undefined) {
            res.push(['line', {
                style: style,
                x1: period * start + gap1,
                x2: period * arr.length // + gap2
            }]);
        }
        return [res];
    }
    return [];
}

module.exports = renderOverUnder;

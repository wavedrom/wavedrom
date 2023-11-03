'use strict';

const tt = require('onml/tt.js');

const colors = {
    1: '#000000',
    2: '#e90000',
    3: '#3edd00',
    4: '#0074cd',
    5: '#ff15db',
    6: '#af9800',
    7: '#00864f',
    8: '#a076ff'
};

function renderOverUnder (el, key, lane) {
    const xs = lane.xs;
    const ys = lane.ys;
    const period = (el.period || 1) * 2 * xs;
    const xoffset = -(el.phase || 0) * 2 * xs;
    const gap1 = 12;
    const serif = 7;
    let color;
    const y = (key === 'under') ? ys : 0;
    let start;

    function line (x) {
        return (start === undefined) ? [] : [['line', {
            style: 'stroke:' + color,
            x1: period * start + gap1,
            x2: period * x
        }]];
    }

    if (el[key]) {
        let res = ['g', tt(
            xoffset,
            y,
            {style: 'stroke-width:3'}
        )];
        const arr = el[key].split('');
        arr.map(function (dot, i) {
            if ((dot !== '.') && (start !== undefined)) {
                res = res.concat(line(i));
                if (key === 'over') {
                    res.push(['path', {
                        style: 'stroke:none;fill:' + color,
                        d: 'm' + (period * i - serif) + ' 0 l' + serif + ' ' + serif + ' v-' + serif + ' z'
                    }]);
                }
            }
            if (dot === '0') {
                start = undefined;
            } else if (dot !== '.') {
                start = i;
                color = colors[dot] || colors[1];
            }
        });
        if (start !== undefined) {
            res = res.concat(line(arr.length));
        }
        return [res];
    }
    return [];
}

module.exports = renderOverUnder;

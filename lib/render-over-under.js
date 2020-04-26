'use strict';

function renderOverUnder (el, key, lane) {
    var xs = lane.xs;
    var ys = lane.ys;
    var period = (el.period || 1) * 2 * xs;
    var xoffset = -(el.phase || 0) * 2 * xs;
    var gap1 = 12;

    var y = (key === 'under') ? ys : 0;

    if (el[key]) {
        var res = ['g', {
            transform: 'translate(' + xoffset + ',' + y + ')',
            style: 'stroke:#000;stroke-width:3'
        }];

        let start = undefined;
        const arr = el[key].split('');
        arr.map(function (dot, i) {
            if ((dot === '0' || dot === '1') && start !== undefined) {
                res.push(['line', {
                    x1: period * start + gap1,
                    x2: period * i // + gap2
                }]);
            }
            if (dot === '1') {
                start = i;
            } else
            if (dot === '0') {
                start = undefined;
            }
        });
        const last = arr[arr.length - 1];
        if (last !== '0' && last !== '1') {
            res.push(['line', {
                x1: period * start + gap1,
                x2: period * arr.length // + gap2
            }]);
        }
        return [res];
    }
    return [];
}

module.exports = renderOverUnder;

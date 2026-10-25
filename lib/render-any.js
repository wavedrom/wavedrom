'use strict';

const renderAssign = require('logidrom/lib/render-assign.js');

const renderReg = require('./render-reg.js');
const renderSignal = require('./render-signal.js');
const w3 = require('./w3.js');

function renderAny (index, source, waveSkin, notFirstSignal, notFirstAssign) {
    const res = source.signal
        ? renderSignal(index, source, waveSkin, notFirstSignal)
        : source.assign
            ? renderAssign(index, source, notFirstAssign)
            : source.reg
                ? renderReg(index, source)
                : ['div', {}];

    if (res[0] === 'svg') {
        res[1].xmlns = w3.svg;
        res[1]['xmlns:xlink'] = w3.xlink;
    }
    res[1].class = 'WaveDrom';
    return res;
}

module.exports = renderAny;

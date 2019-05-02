'use strict';

var renderAssign = require('./render-assign.js');
var renderReg = require('./render-reg.js');
var renderSignal = require('./render-signal.js');

function renderAny (index, source, waveSkin) {
    if (source.signal) {
        return renderSignal(index, source, waveSkin);
    }
    if (source.assign) {
        return renderAssign(index, source);
    }
    if (source.reg) {
        return  renderReg(index, source);
    }
    return ['div'];
}

module.exports = renderAny;

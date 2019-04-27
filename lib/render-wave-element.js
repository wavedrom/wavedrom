'use strict';

var renderAssign = require('./render-assign.js');
var renderReg = require('./render-reg.js');
var renderSignal = require('./render-signal.js');
var jsonmlParse = require('./create-element');

function renderWaveElement (index, source, outputElement, waveSkin) {

    // cleanup
    while (outputElement.childNodes.length) {
        outputElement.removeChild(outputElement.childNodes[0]);
    }

    var res = ['div'];
    if (source.signal) {
        res = renderSignal(index, source, waveSkin);
    } else if (source.assign) {
        res = renderAssign(index, source);
    } else if (source.reg) {
        res = renderReg(index, source);
    }

    outputElement.insertBefore(jsonmlParse(res), null);
}

module.exports = renderWaveElement;

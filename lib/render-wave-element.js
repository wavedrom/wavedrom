'use strict';

var renderAny = require('./render-any.js');
var jsonmlParse = require('./create-element');

function renderWaveElement (index, source, outputElement, waveSkin, firstSignal) {

    // cleanup
    while (outputElement.childNodes.length) {
        outputElement.removeChild(outputElement.childNodes[0]);
    }

    outputElement.insertBefore(jsonmlParse(
        renderAny(index, source, waveSkin, firstSignal)
    ), null);
}

module.exports = renderWaveElement;

'use strict';

const renderAny = require('./render-any.js');
const createElement = require('./create-element.js');

function renderWaveElement (index, source, outputElement, waveSkin, notFirstSignal, notFirstAssign) {

    // cleanup
    while (outputElement.childNodes.length) {
        outputElement.removeChild(outputElement.childNodes[0]);
    }

    outputElement.insertBefore(createElement(
        renderAny(index, source, waveSkin, notFirstSignal, notFirstAssign)
    ), null);
}

module.exports = renderWaveElement;

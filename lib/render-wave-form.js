'use strict';

var renderWaveElement = require('./render-wave-element');

function renderWaveForm (index, source, output, firstSignal) {
    renderWaveElement(index, source, document.getElementById(output + index), window.WaveSkin, firstSignal);
}

module.exports = renderWaveForm;

/* eslint-env browser */

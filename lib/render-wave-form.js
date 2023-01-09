'use strict';

const renderWaveElement = require('./render-wave-element.js');

function renderWaveForm (index, source, output, notFirstSignal) {
    renderWaveElement(index, source, document.getElementById(output + index), window.WaveSkin, notFirstSignal);
}

module.exports = renderWaveForm;

/* eslint-env browser */

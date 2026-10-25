'use strict';

const renderWaveElement = require('./render-wave-element.js');

function renderWaveForm (index, source, output, notFirstSignal, notFirstAssign) {
    renderWaveElement(index, source, document.getElementById(output + index), window.WaveSkin, notFirstSignal, notFirstAssign);
}

module.exports = renderWaveForm;

/* eslint-env browser */

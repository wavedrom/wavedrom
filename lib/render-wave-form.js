'use strict';

var renderWaveElement = require('./render-wave-element');

function renderWaveForm (index, source, output) {
    renderWaveElement(index, source, document.getElementById(output + index), window.WaveSkin);
}

module.exports = renderWaveForm;

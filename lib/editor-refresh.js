'use strict';

const eva = require('./eva.js');
const renderWaveForm = require('./render-wave-form.js');

function editorRefresh () {
    // let svg,
    // ser,
    // ssvg,
    // asvg,
    // sjson,
    // ajson;

    renderWaveForm(0, eva('InputJSON_0'), 'WaveDrom_Display_');

    /*
    svg = document.getElementById('svgcontent_0');
    ser = new XMLSerializer();
    ssvg = '<?xml version='1.0' standalone='no'?>\n' +
    '<!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'>\n' +
    '<!-- Created with WaveDrom -->\n' +
    ser.serializeToString(svg);

    asvg = document.getElementById('download_svg');
    asvg.href = 'data:image/svg+xml;base64,' + window.btoa(ssvg);

    sjson = localStorage.waveform;
    ajson = document.getElementById('download_json');
    ajson.href = 'data:text/json;base64,' + window.btoa(sjson);
    */
}

module.exports = editorRefresh;

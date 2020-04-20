'use strict';

var eva = require('./eva.js');
var appendSaveAsDialog = require('./append-save-as-dialog.js');
var renderWaveForm = require('./render-wave-form.js');

function processAll () {
    var points,
        i,
        index,
        notFirstSignal,
        obj,
        node0;
        // node1;

    // first pass
    index = 0; // actual number of valid anchor
    points = document.querySelectorAll('*');
    for (i = 0; i < points.length; i++) {
        if (points.item(i).type && points.item(i).type === 'WaveDrom') {
            points.item(i).setAttribute('id', 'InputJSON_' + index);

            node0 = document.createElement('div');
            // node0.className += 'WaveDrom_Display_' + index;
            node0.id = 'WaveDrom_Display_' + index;
            points.item(i).parentNode.insertBefore(node0, points.item(i));
            // WaveDrom.InsertSVGTemplate(i, node0);
            index += 1;
        }
    }
    // second pass
    for (i = 0; i < index; i += 1) {
        obj = eva('InputJSON_' + i);
        renderWaveForm(i, obj, 'WaveDrom_Display_', notFirstSignal);
        if (obj && obj.signal && !notFirstSignal) {
            notFirstSignal = true;
        }
        appendSaveAsDialog(i, 'WaveDrom_Display_');
    }
    // add styles
    document.head.innerHTML += '<style type="text/css">div.wavedromMenu{position:fixed;border:solid 1pt#CCCCCC;background-color:white;box-shadow:0px 10px 20px #808080;cursor:default;margin:0px;padding:0px;}div.wavedromMenu>ul{margin:0px;padding:0px;}div.wavedromMenu>ul>li{padding:2px 10px;list-style:none;}div.wavedromMenu>ul>li:hover{background-color:#b5d5ff;}</style>';
}

module.exports = processAll;

/* eslint-env browser */

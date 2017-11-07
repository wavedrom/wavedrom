'use strict';

var jsonmlParse = require('./create-element'),
    render = require('bit-field/lib/render');

function renderReg (index, source, parent) {
    // cleanup
    while (parent.childNodes.length) {
        parent.removeChild(parent.childNodes[0]);
    }
    var e = render(source.reg);
    var node = jsonmlParse(e);
    parent.insertBefore(node, null);
}

module.exports = renderReg;

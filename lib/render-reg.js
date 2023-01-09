'use strict';

const render = require('bit-field/lib/render.js');

function renderReg (index, source) {
    return render(source.reg, source.config);
}

module.exports = renderReg;

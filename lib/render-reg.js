'use strict';

var render = require('bit-field/lib/render');

function renderReg (index, source) {
    return render(source.reg, source.config);
}

module.exports = renderReg;

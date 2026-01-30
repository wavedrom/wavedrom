'use strict';

const renderAssign = require('logidrom/lib/render-assign.js');

const renderReg = require('./render-reg.js');
const renderSignal = require('./render-signal.js');

function renderAny (index, source, waveSkin, notFirstSignal) {
    const res = source.signal
        ? renderSignal(index, source, waveSkin, notFirstSignal)
        : source.assign
            ? renderAssign(index, source)
            : source.reg
                ? renderReg(index, source)
                : ['div', {}];
    
    // PCART
    if (source.usersvg){
        res.push(
          ['g', 
               ['text', source.usersvg]
          ]
        );
      }
     
    res[1].class = 'WaveDrom';
    return res;
}

module.exports = renderAny;

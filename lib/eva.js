'use strict';

function erra (e) {
    console.log('Error in WaveJS: ', e) /* eslint no-console: 0 */;
    const msg = ['tspan', ['tspan', {class:'error h5'}, 'Error: '], e.message];
    msg.textWidth = 1000;  // set dummy width because we cannot measure tspans
    return {signal: [{name: msg}]};
}

function eva (id) {
    const TheTextBox = document.getElementById(id);

    /* eslint-disable no-eval */
    let source;
    if (TheTextBox.type && TheTextBox.type === 'textarea') {
        try {
            source = eval('(' + TheTextBox.value + ')');
        } catch (e) {
            return erra(e);
        }
    } else {
        try {
            source = eval('(' + TheTextBox.innerHTML + ')');
        } catch (e) {
            return erra(e);
        }
    }
    /* eslint-enable  no-eval */

    if (Object.prototype.toString.call(source) !== '[object Object]') {
        return erra({ message: '[Semantic]: The root has to be an Object: "{signal:[...]}"'});
    }
    if (source.signal) {
        if (!Array.isArray(source.signal)) {
            return erra({ message: '[Semantic]: "signal" object has to be an Array "signal:[]"'});
        }
    } else if (source.assign) {
        if (!Array.isArray(source.assign)) {
            return erra({ message: '[Semantic]: "assign" object hasto be an Array "assign:[]"'});
        }
    } else if (source.reg) {
        // test register
    } else {
        return erra({ message: '[Semantic]: "signal:[...]" or "assign:[...]" property is missing inside the root Object'});
    }
    return source;
}

module.exports = eva;

/* eslint-env browser */

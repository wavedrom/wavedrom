'use strict';

const charWidth = require('./char-width.json');

/**
    Calculates text string width in pixels.

    @param {String} str text string to be measured
    @param {Number} size font size used
    @return {Number} text string width
*/

module.exports = function (str, size) {
    size = size || 11; // default size 11pt
    let width = 0;
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        let w = charWidth.chars[c];
        if (w === undefined) {
            w = charWidth.other;
        }
        width += w;
    }
    return (width * size) / 100; // normalize
};

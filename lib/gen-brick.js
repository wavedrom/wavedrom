'use strict';

const genBrick = (texts, extra, times) => {
    const R = [];

    if (!Array.isArray(texts)) {
        texts = [texts];
    }

    if (texts.length === 4) {
        for (let j = 0; j < times; j += 1) {
            R.push(texts[0]);
            for (let i = 0; i < extra; i += 1) {
                R.push(texts[1]);
            }
            R.push(texts[2]);
            for (let i = 0; i < extra; i += 1) {
                R.push(texts[3]);
            }
        }
        return R;
    }
    if (texts.length === 1) {
        texts.push(texts[0]);
    }
    R.push(texts[0]);
    for (let i = 0; i < (times * (2 * (extra + 1)) - 1); i += 1) {
        R.push(texts[1]);
    }
    return R;
};

module.exports = genBrick;

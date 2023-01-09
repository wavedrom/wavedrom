'use strict';

const genBrick = require('./gen-brick.js');

const lookUpTable = {
    p:       ['pclk', '111', 'nclk', '000'],
    n:       ['nclk', '000', 'pclk', '111'],
    P:       ['Pclk', '111', 'nclk', '000'],
    N:       ['Nclk', '000', 'pclk', '111'],
    l:       '000',
    L:       '000',
    0:       '000',
    h:       '111',
    H:       '111',
    1:       '111',
    '=':     'vvv-2',
    2:       'vvv-2',
    3:       'vvv-3',
    4:       'vvv-4',
    5:       'vvv-5',
    6:       'vvv-6',
    7:       'vvv-7',
    8:       'vvv-8',
    9:       'vvv-9',
    d:       'ddd',
    u:       'uuu',
    z:       'zzz',
    default: 'xxx'
};

const genFirstWaveBrick = (text, extra, times) =>
    genBrick((lookUpTable[text] || lookUpTable.default), extra, times);

module.exports = genFirstWaveBrick;

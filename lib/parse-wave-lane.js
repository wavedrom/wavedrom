'use strict';

var genFirstWaveBrick = require('./gen-first-wave-brick'),
    genWaveBrick = require('./gen-wave-brick');

function parseWaveLane (text, extra, lane) {
    var Repeats, Top, Next, Stack = [], R = [], i;

    Stack = text.split('');
    Next  = Stack.shift();

    Repeats = 1;
    while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
        Stack.shift();
        Repeats += 1;
    }
    R = R.concat(genFirstWaveBrick(Next, extra, Repeats));

    while (Stack.length) {
        Top = Next;
        Next = Stack.shift();
        Repeats = 1;
        while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
            Stack.shift();
            Repeats += 1;
        }
        R = R.concat(genWaveBrick((Top + Next), extra, Repeats));
    }
    for (i = 0; i < lane.phase; i += 1) {
        R.shift();
    }
    return R;
}

module.exports = parseWaveLane;

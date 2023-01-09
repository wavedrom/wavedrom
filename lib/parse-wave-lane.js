'use strict';

const genFirstWaveBrick = require('./gen-first-wave-brick.js');
const genWaveBrick = require('./gen-wave-brick.js');
const findLaneMarkers = require('./find-lane-markers.js');

// src is the wave member of the signal object
// extra = hscale-1 ( padding )
// lane is an object containing all properties for this waveform
function parseWaveLane (src, extra, lane) {
    const Stack = src.split('');
    let Next  = Stack.shift();

    let Repeats = 1;
    while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
        Stack.shift();
        Repeats += 1;
    }
    let R = [];
    R = R.concat(genFirstWaveBrick(Next, extra, Repeats));

    let Top;
    let subCycle = false;
    while (Stack.length) {
        Top = Next;
        Next = Stack.shift();
        if (Next === '<') { // sub-cycles on
            subCycle = true;
            Next = Stack.shift();
        }
        if (Next === '>') { // sub-cycles off
            subCycle = false;
            Next = Stack.shift();
        }
        Repeats = 1;
        while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
            Stack.shift();
            Repeats += 1;
        }
        if (subCycle) {
            R = R.concat(genWaveBrick((Top + Next), 0, Repeats - lane.period));
        } else {
            R = R.concat(genWaveBrick((Top + Next), extra, Repeats));
        }
    }
    // shift out unseen bricks due to phase shift, and save them in
    const unseen_bricks = [];
    for (let i = 0; i < lane.phase; i += 1) {
        unseen_bricks.push(R.shift());
    }

    let num_unseen_markers;
    if (unseen_bricks.length > 0) {
        num_unseen_markers = findLaneMarkers( unseen_bricks ).length;
        // if end of unseen_bricks and start of R both have a marker,
        //  then one less unseen marker
        if (findLaneMarkers( [unseen_bricks[unseen_bricks.length-1]] ).length == 1 &&
            findLaneMarkers( [R[0]] ).length == 1
        ) {
            num_unseen_markers -= 1;
        }
    } else {
        num_unseen_markers = 0;
    }

    // R is array of half brick types, each is item is string
    // num_unseen_markers is how many markers are now unseen due to phase
    return [R, num_unseen_markers];
}

module.exports = parseWaveLane;

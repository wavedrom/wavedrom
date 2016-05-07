'use strict';

var genFirstWaveBrick = require('./gen-first-wave-brick'),
    genWaveBrick = require('./gen-wave-brick'),
    findLaneMarkers = require('./find-lane-markers');

// text is the wave member of the signal object
// extra = hscale-1 ( padding )
// lane is an object containing all properties for this waveform
function parseWaveLane (text, extra, lane) {
    var Repeats, Top, Next, Stack = [], R = [], i;
    var unseen_bricks = [], num_unseen_markers;
    var effective_phase;

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
    // xmin_cfg is minimum tick based on hbounds, can add to phase to all signals to
    //  view at a later time
    // shift out unseen bricks due to phase shift + xmin_cfg, and save them in
    //  unseen_bricks array
    effective_phase = lane.phase + lane.xmin_cfg;
    for (i = 0; i < effective_phase; i += 1) {
        unseen_bricks.push(R.shift());
    }
    if (unseen_bricks.length > 0) {
        num_unseen_markers = findLaneMarkers( unseen_bricks ).length;
        // if end of unseen_bricks and start of R both have a marker,
        //  then one less unseen marker
        if ( findLaneMarkers( [unseen_bricks[unseen_bricks.length-1]] ).length == 1 &&
             findLaneMarkers( [R[0]] ).length == 1 ) {
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

'use strict';

var genFirstWaveBrick = require('./gen-first-wave-brick.js');
var genWaveBrick = require('./gen-wave-brick.js');
var findLaneMarkers = require('./find-lane-markers.js');

// text is the wave member of the signal object
// extra = hscale-1 ( padding )
// lane is an object containing all properties for this waveform
function parseWaveLane (text, extra, lane) {
    var Repeats, Top, Next, Stack = [], R = [], i, subCycle ;
    var doGenFWB, numSegments, halfCycleRender ;
    var unseen_bricks = [], num_unseen_markers;

    Stack = text.split('');
    subCycle = false;
    doGenFWB = true ;

    while (Stack.length) {
        
        Top = (doGenFWB) ? '' : Next; // Top is empty for the first wave brick
        Next = Stack.shift(); 

        if (Next === '<') { // sub-cycles on
            subCycle = true;
            Next = Stack.shift(); 
            // If the first char in a sub-cycle is a dot or gap, the prev char
            // needs to be carried over, and the rendering must be as if it is a 
            // first wave brick to ensure seamless transition to the sub-cycle set
            if (Next === '.' || Next === '|') { 
                Next = Top ; 
                doGenFWB = true ;
            }
        }
        if (Next === '>') { // sub-cycles off
            subCycle = false;
            Next = Stack.shift();
            // If the first char following a sub-cycle is a dot or gap, the last 
            // char within the sub-cycle set must be carried over, and the next
            // rendering must be as if it is a first wave brick to ensure seamless
            // transition out of the sub-cycle set
            if (Next === '.' || Next === '|') { 
                Next = Top ; 
                doGenFWB = true ;
            }
            // Handling back-to-back sub-cycles involves skipping the current rendering cycle
            // and putting the begin marker back into the stack
            if (Next === '<') {
                Stack.unshift(Next);
                Next = undefined ;
            }
        }
        // A gating condition for rendering is the need for Next to be valid.
        // This helps handle wave strings ending with a sub-cycle set
        if (Next !== undefined) {
            // For rendering the first of a sub-cycle's members or follow-ups
            // which do NOT require a seamless transition, 
            // the first brick is the 'combined' render involving the previous character.
            // So, we reduce the number of repetitions by 1 in that case
            Repeats = (subCycle & !doGenFWB) ? 0 : 1;
            while (Stack[0] === '.' || Stack[0] === '|') { // repeaters parser
                Stack.shift();
                Repeats += 1;
            }
            if (subCycle) {
                // The number of segments / bricks that need to be rendered in a sub-cycle case
                // depends on the period: each period is 2 bricks - so, we have 2*period segments
                // We first translate the number of desired reptitions to the number of bricks
                // to be rendered based on that. One of the key requirements with the sub-cycle feature
                // is the ability to break off the sub-cycle at an odd boundary (middle of a period).
                // If the number of repetitions is odd, we need to do that.
                numSegments = Repeats >> 1 ;
                halfCycleRender = Repeats & 0x1 ;
                if (!doGenFWB) {
                    // Handling an abrupt transition from one type of brick to another
                    // by first rendering the single brick dependent on both the old and current characters
                    R = R.concat(genWaveBrick((Top + Next), extra, 0));
                }
                // Rendering a seamless transition or starting of the wave lane
                // for the desired number of repetitions (translated based on the period)
                if (numSegments != 0) {
                    R = R.concat(genFirstWaveBrick(Next, 0, numSegments));
                }
                // Add a single brick render of the same type as the previously rendered ones
                // to handle the odd-boundary case
                if (halfCycleRender) {
                    R = R.concat(genFirstWaveBrick(Next, 0, 0)); 
                }
            } else {
                // We need to handle things differently if we are just exiting out of a sub-cycle block
                // or it is the rendering for the first character in the wave lane - the doGenFWB is true 
                // in both of those cases, and we call the genFirstWaveBrick function with just one character. 
                // There is no translation needed for the Repeats parameter because
                // we have exited out of the sub-cycle block. 
                // For the regular case, we call the genWaveBrick function with two characters to generate
                // a rendering with the appropriate transitions
                if (doGenFWB) {
                    R = R.concat(genFirstWaveBrick(Next, extra, Repeats)); 
                } else {
                    R = R.concat(genWaveBrick((Top + Next), extra, Repeats));
                }
            }
        } else {
            // The only case of interest where Next is undefined, but, we would still loop back
            // is the back-to-back sub-cycles case - we need to save up the last rendered character
            // for the output to match the input wave string.
            Next = Top ;
        }
        doGenFWB = false ;
        // Once we have done one pass through the loop, we no longer need to 'generate the first wave brick' -
        // except under special circumstances as indicated in the comments above.
    }
    // shift out unseen bricks due to phase shift, and save them in
    //  unseen_bricks array
    for (i = 0; i < lane.phase; i += 1) {
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

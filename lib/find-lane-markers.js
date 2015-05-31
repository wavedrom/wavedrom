'use strict';

function findLaneMarkers (lanetext) {
    var i, gcount = 0, lcount = 0, ret = [];

    for (i in lanetext) {
        if (
            (lanetext[i] === 'vvv-2') ||
            (lanetext[i] === 'vvv-3') ||
            (lanetext[i] === 'vvv-4') ||
            (lanetext[i] === 'vvv-5')
        ) {
            lcount += 1;
        } else {
            if (lcount !== 0) {
                ret.push(gcount - ((lcount + 1) / 2));
                lcount = 0;
            }
        }
        gcount += 1;
    }
    if (lcount !== 0) {
        ret.push(gcount - ((lcount + 1) / 2));
    }

    return ret;
}

module.exports = findLaneMarkers;

'use strict';

function findLaneMarkers (lanetext) {
    let gcount = 0;
    let lcount = 0;
    const ret = [];

    lanetext.forEach(function (e) {
        if (
            (e === 'vvv-2') ||
            (e === 'vvv-3') ||
            (e === 'vvv-4') ||
            (e === 'vvv-5') ||
            (e === 'vvv-6') ||
            (e === 'vvv-7') ||
            (e === 'vvv-8') ||
            (e === 'vvv-9')
        ) {
            lcount += 1;
        } else {
            if (lcount !== 0) {
                ret.push(gcount - ((lcount + 1) / 2));
                lcount = 0;
            }
        }
        gcount += 1;

    });

    if (lcount !== 0) {
        ret.push(gcount - ((lcount + 1) / 2));
    }

    return ret;
}

module.exports = findLaneMarkers;

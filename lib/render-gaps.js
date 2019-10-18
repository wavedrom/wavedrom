'use strict';

function renderGapUses (text, lane) {
    var res = [];
    var Stack = (text || '').split('');
    var numRegularNodes = 0;
    var numSubCycleNodes = 0;
    var xlatedPos = 0;
    var pos = 0;
    var next;
    var subCycle = false;
    while (Stack.length) {
        next = Stack.shift();
        // Skip over the sub-cycle delimiters and ensure correct status (subcycle or not) is
        // inferred for the next non-delimiter character
        while ((next === '<') || (next === '>')) {
            subCycle = (next === '<') ? true : false ;
            next = Stack.shift();
        }
        if (subCycle) {
            numSubCycleNodes ++ ;
        } else {
            numRegularNodes ++ ;
        }
        if (next === '|') {
            // subCycleNodes are rendered with a single brick, and should not be subject to hscale or period
            // regularNodes are rendered based on both the period and scale
            pos = numSubCycleNodes + (((numRegularNodes * 2 * lane.period) - (subCycle ? 0 : lane.period)) * lane.hscale) ;
            // When rendering gaps in subCycle mode, the gap is placed right at the end of the single brick
            // In regular mode, we need to offset by a single period to make it appear in the middle of the cycle
            // The subCycle term in the above assignment handles that aspect
            xlatedPos = lane.xs * (pos - lane.phase) ;
            res.push(['use', {
                'xlink:href': '#gap',
                transform: 'translate(' + xlatedPos + ')'
            }]);
        }
    }
    return res;
}

function renderGaps (source, index, lane) {
    var i, gaps;

    var res = [];
    if (source) {
        for (i in source) {
            lane.period = source[i].period ? source[i].period : 1;
            lane.phase  = (source[i].phase  ? source[i].phase * 2 : 0) + lane.xmin_cfg;

            gaps = renderGapUses(source[i].wave, lane);
            res = res.concat([['g', {
                id: 'wavegap_' + i + '_' + index,
                transform: 'translate(0,' + (lane.y0 + i * lane.yo) + ')'
            }].concat(gaps)]);
        }
    }
    return ['g', {id: 'wavegaps_' + index}].concat(res);
}

module.exports = renderGaps;

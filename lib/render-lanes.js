'use strict';

var renderMarks = require('./render-marks');
var renderArcs = require('./render-arcs');
var renderGaps = require('./render-gaps');

function renderLanes (index, content, waveLanes, ret, source, lane) {
    return [renderMarks(content, index, lane)]
        .concat(waveLanes.res)
        .concat([renderArcs(ret.lanes, index, source, lane)])
        .concat([renderGaps(ret.lanes, index, lane)]);
}

module.exports = renderLanes;

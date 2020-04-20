'use strict';

var renderMarks = require('./render-marks.js');
var renderArcs = require('./render-arcs.js');
var renderGaps = require('./render-gaps.js');

function renderLanes (index, content, waveLanes, ret, source, lane) {
    return [renderMarks(content, index, lane, source)]
        .concat(waveLanes.res)
        .concat([renderArcs(ret.lanes, index, source, lane)])
        .concat([renderGaps(ret.lanes, index, lane)]);
}

module.exports = renderLanes;

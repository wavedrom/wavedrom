'use strict';

var renderMarks = require('./render-marks.js');
var renderArcs = require('./render-arcs.js');
var renderGaps = require('./render-gaps.js');
var renderPieceWise = require('./render-piece-wise.js');

function renderLanes (index, content, waveLanes, ret, source, lane) {
    return [renderMarks(content, index, lane, source)].concat(waveLanes.res, [
        renderArcs(ret.lanes, index, source, lane),
        renderGaps(ret.lanes, index, lane),
        renderPieceWise(ret.lanes, index, lane)
    ]);
}

module.exports = renderLanes;

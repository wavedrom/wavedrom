'use strict';

const renderMarks = require('./render-marks.js');
const renderArcs = require('./render-arcs.js');
const renderGaps = require('./render-gaps.js');
const renderPieceWise = require('./render-piece-wise.js');

function renderLanes (index, content, waveLanes, ret, source, lane) {
    return [
        renderMarks(content, index, lane, source)
    ].concat(
        waveLanes.res,
        [
            renderArcs(ret.lanes, index, source, lane),
            renderGaps(ret.lanes, index, source, lane),
            renderPieceWise(ret.lanes, index, lane)
        ]
    );
}

module.exports = renderLanes;

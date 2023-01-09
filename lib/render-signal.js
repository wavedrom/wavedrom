'use strict';

const rec = require('./rec.js');
const lane = require('./lane.js');
const parseConfig = require('./parse-config.js');
const parseWaveLanes = require('./parse-wave-lanes.js');
const renderGroups = require('./render-groups.js');
const renderLanes = require('./render-lanes.js');
const renderWaveLane = require('./render-wave-lane.js');

const insertSVGTemplate = require('./insert-svg-template.js');

function laneParamsFromSkin (index, source, lane, waveSkin) {

    if (index !== 0) {
        return;
    }

    const waveSkinNames = Object.keys(waveSkin);
    if (waveSkinNames.length === 0) {
        throw new Error('no skins found');
    }

    let skin = waveSkin.default || waveSkin[waveSkinNames[0]];

    if (source && source.config && source.config.skin && waveSkin[source.config.skin]) {
        skin = waveSkin[source.config.skin];
    }

    const socket = skin[3][1][2][1];

    lane.xs     = Number(socket.width);
    lane.ys     = Number(socket.height);
    lane.xlabel = Number(socket.x);
    lane.ym     = Number(socket.y);
}

function renderSignal (index, source, waveSkin, notFirstSignal) {

    laneParamsFromSkin (index, source, lane, waveSkin);

    parseConfig(source, lane);
    const ret = rec(source.signal, {x: 0, y: 0, xmax: 0, width: [], lanes: [], groups: []});
    const content = parseWaveLanes(ret.lanes, lane);

    const waveLanes = renderWaveLane(content, index, lane);
    const waveGroups = renderGroups(ret.groups, index, lane);

    const xmax = waveLanes.glengths.reduce((res, len, i) =>
        Math.max(res, len + ret.width[i]), 0);

    lane.xg = Math.ceil((xmax - lane.tgo) / lane.xs) * lane.xs;

    return insertSVGTemplate(
        index, source, lane, waveSkin, content,
        renderLanes(index, content, waveLanes, ret, source, lane),
        waveGroups,
        notFirstSignal
    );

}

module.exports = renderSignal;

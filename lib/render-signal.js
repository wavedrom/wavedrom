'use strict';

var rec = require('./rec');
var lane = require('./lane');
var parseConfig = require('./parse-config');
var parseWaveLanes = require('./parse-wave-lanes');
var renderGroups = require('./render-groups');
var renderLanes = require('./render-lanes');
var renderWaveLane = require('./render-wave-lane');

var insertSVGTemplate = require('./insert-svg-template');

function laneParamsFromSkin (index, source, lane, waveSkin) {

    if (index !== 0) { return; }

    var first, skin, socket;

    for (first in waveSkin) { break; }

    skin = waveSkin.default || waveSkin[first];

    if (source && source.config && source.config.skin && waveSkin[source.config.skin]) {
        skin = waveSkin[source.config.skin];
    }

    socket = skin[3][1][2][1];

    lane.xs     = Number(socket.width);
    lane.ys     = Number(socket.height);
    lane.xlabel = Number(socket.x);
    lane.ym     = Number(socket.y);
    console.log(lane.xs); /* eslint no-console: 0 */
}

function renderSignal (index, source, waveSkin) {

    laneParamsFromSkin (index, source, lane, waveSkin);

    parseConfig(source, lane);
    var ret = rec(source.signal, {'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]});
    var content = parseWaveLanes(ret.lanes, lane);

    var waveLanes = renderWaveLane(content, index, lane);
    var waveGroups = renderGroups(ret.groups, index, lane);

    var xmax = waveLanes.glengths.reduce(function (res, len, i) {
        return Math.max(res, len + ret.width[i]);
    }, 0);

    lane.xg = Math.ceil((xmax - lane.tgo) / lane.xs) * lane.xs;

    return insertSVGTemplate(
        index, source, lane, waveSkin, content,
        renderLanes(index, content, waveLanes, ret, source, lane),
        waveGroups
    );

}

module.exports = renderSignal;

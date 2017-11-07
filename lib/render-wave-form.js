'use strict';

var rec = require('./rec'),
    lane = require('./lane'),
    jsonmlParse = require('./create-element'),
    parseConfig = require('./parse-config'),
    parseWaveLanes = require('./parse-wave-lanes'),
    renderMarks = require('./render-marks'),
    renderGaps = require('./render-gaps'),
    renderGroups = require('./render-groups'),
    renderWaveLane = require('./render-wave-lane'),
    renderAssign = require('./render-assign'),
    renderReg = require('./render-reg'),
    renderArcs = require('./render-arcs'),
    insertSVGTemplate = require('./insert-svg-template'),
    insertSVGTemplateAssign = require('./insert-svg-template-assign');

function renderWaveForm (index, source, output) {
    var ret,
    root, groups, svgcontent, content, width, height,
    glengths, xmax = 0, i;

    if (source.signal) {
        insertSVGTemplate(index, document.getElementById(output + index), source, lane);
        parseConfig(source, lane);
        ret = rec(source.signal, {'x':0, 'y':0, 'xmax':0, 'width':[], 'lanes':[], 'groups':[]});
        root = document.getElementById('lanes_' + index);
        groups = document.getElementById('groups_' + index);
        content  = parseWaveLanes(ret.lanes, lane);
        glengths = renderWaveLane(root, content, index, lane);
        for (i in glengths) {
            xmax = Math.max(xmax, (glengths[i] + ret.width[i]));
        }
        renderMarks(root, content, index, lane);
        renderArcs(root, ret.lanes, index, source, lane);
        renderGaps(root, ret.lanes, index, lane);
        groups.insertBefore(jsonmlParse(renderGroups(ret.groups, index, lane)), null);
        lane.xg = Math.ceil((xmax - lane.tgo) / lane.xs) * lane.xs;
        width  = (lane.xg + (lane.xs * (lane.xmax + 1)));
        height = (content.length * lane.yo +
        lane.yh0 + lane.yh1 + lane.yf0 + lane.yf1);

        svgcontent = document.getElementById('svgcontent_' + index);
        svgcontent.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
        svgcontent.setAttribute('width', width);
        svgcontent.setAttribute('height', height);
        svgcontent.setAttribute('overflow', 'hidden');
        root.setAttribute('transform', 'translate(' + (lane.xg + 0.5) + ', ' + ((lane.yh0 + lane.yh1) + 0.5) + ')');
    } else if (source.assign) {
        insertSVGTemplateAssign(index, document.getElementById(output + index), source);
        renderAssign(index, source);
    } else if (source.reg) {
        renderReg(index, source, document.getElementById(output + index));
    }
}

module.exports = renderWaveForm;

/* eslint-env browser */

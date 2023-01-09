'use strict';

const stringify = require('onml/stringify.js');
const tt = require('onml/tt.js');

const pkg = require('../package.json');
const processAll = require('./process-all.js');
const eva = require('./eva.js');
const renderWaveForm = require('./render-wave-form.js');
const renderWaveElement = require('./render-wave-element.js');
const renderAny = require('./render-any.js');
const editorRefresh = require('./editor-refresh.js');
const def = require('../skins/default.js');

exports.version = pkg.version;
exports.processAll = processAll;
exports.eva = eva;
exports.renderAny = renderAny;
exports.renderWaveForm = renderWaveForm;
exports.renderWaveElement = renderWaveElement;
exports.editorRefresh = editorRefresh;
exports.waveSkin = def;
exports.onml = {
    stringify: stringify,
    tt: tt
};

'use strict';

window.WaveDrom = window.WaveDrom || {};

const pkg = require('../package.json');
const processAll = require('./process-all.js');
const eva = require('./eva.js');
const renderWaveForm = require('./render-wave-form.js');
const editorRefresh = require('./editor-refresh.js');

window.WaveDrom.ProcessAll = processAll;
window.WaveDrom.RenderWaveForm = renderWaveForm;
window.WaveDrom.EditorRefresh = editorRefresh;
window.WaveDrom.eva = eva;
window.WaveDrom.version = pkg.version;

/* eslint-env browser */

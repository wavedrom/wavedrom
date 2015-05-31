'use strict';

window.WaveDrom = window.WaveDrom || {};

var processAll = require('./process-all'),
    renderWaveForm = require('./render-wave-form'),
    editorRefresh = require('./editor-refresh');

window.WaveDrom.ProcessAll = processAll;
window.WaveDrom.RenderWaveForm = renderWaveForm;
window.WaveDrom.EditorRefresh = editorRefresh;

/* eslint-env browser */

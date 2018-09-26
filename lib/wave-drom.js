'use strict';

window.WaveDrom = window.WaveDrom || {};

var processAll = require('./process-all');
var eva = require('./eva');
var renderWaveForm = require('./render-wave-form');
var editorRefresh = require('./editor-refresh');

window.WaveDrom.ProcessAll = processAll;
window.WaveDrom.RenderWaveForm = renderWaveForm;
window.WaveDrom.EditorRefresh = editorRefresh;
window.WaveDrom.eva = eva;

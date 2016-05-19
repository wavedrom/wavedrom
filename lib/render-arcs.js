'use strict';

var tspan = require('tspan'),
    jsonmlParse = require('./create-element'),
    w3 = require('./w3');

 function renderArcs (root, source, index, top, lane) {
     var gg,
         i,
         k,
         text,
         Stack = [],
         Edge = {words: [], from: 0, shape: '', to: 0, label: ''},
         Events = {},
         pos,
         eventname,
         // labeltext,
         label,
         underlabel,
         from,
         to,
         dx,
         dy,
         lx,
         ly,
         gmark,
         lwidth;

     function t1 () {
         if (from && to) {
             gmark = document.createElementNS(w3.svg, 'path');
             gmark.id = ('gmark_' + Edge.from + '_' + Edge.to);
             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + to.x   + ',' + to.y);
             gmark.setAttribute('style', 'fill:none;stroke:#00F;stroke-width:1');
             gg.insertBefore(gmark, null);
         }
     }

     if (source) {
         for (i in source) {
             lane.period = source[i].period ? source[i].period    : 1;
             lane.phase  = (source[i].phase  ? source[i].phase * 2 : 0) + lane.xmin_cfg;
             text = source[i].node;
             if (text) {
                 Stack = text.split('');
                 pos = 0;
                 while (Stack.length) {
                     eventname = Stack.shift();
                     if (eventname !== '.') {
                         Events[eventname] = {
                             'x' : lane.xs * (2 * pos * lane.period * lane.hscale - lane.phase) + lane.xlabel,
                             'y' : i * lane.yo + lane.y0 + lane.ys * 0.5
                         };
                     }
                     pos += 1;
                 }
             }
         }
         gg = document.createElementNS(w3.svg, 'g');
         gg.id = 'wavearcs_' + index;
         root.insertBefore(gg, null);
         if (top.edge) {
             for (i in top.edge) {
                 Edge.words = top.edge[i].split(' ');
                 Edge.label = top.edge[i].substring(Edge.words[0].length);
                 Edge.label = Edge.label.substring(1);
                 Edge.from  = Edge.words[0].substr(0, 1);
                 Edge.to    = Edge.words[0].substr(-1, 1);
                 Edge.shape = Edge.words[0].slice(1, -1);
                 from  = Events[Edge.from];
                 to    = Events[Edge.to];
                 t1();
                 if (from && to) {
                     if (Edge.label) {
                         label = tspan.parse(Edge.label);
                         label.unshift(
                             'text',
                             {
                                 style: 'font-size:10px;',
                                 'text-anchor': 'middle',
                                 'xml:space': 'preserve'
                             }
                         );
                         label = jsonmlParse(label);
                         underlabel = jsonmlParse(['rect',
                             {
                                 height: 9,
                                 style: 'fill:#FFF;'
                             }
                         ]);
                         gg.insertBefore(underlabel, null);
                         gg.insertBefore(label, null);

                         lwidth = label.getBBox().width;

                         underlabel.setAttribute('width', lwidth);
                     }
                     dx = to.x - from.x;
                     dy = to.y - from.y;
                     lx = ((from.x + to.x) / 2);
                     ly = ((from.y + to.y) / 2);

                     switch (Edge.shape) {
                         case '-'  : {
                             break;
                         }
                         case '~'  : {
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                             break;
                         }
                         case '-~' : {
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + (0.7 * dx) + ', 0 ' +         dx + ', ' + dy + ' ' + dx + ', ' + dy);
                             if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
                             break;
                         }
                         case '~-' : {
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' c ' + 0          + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                             if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
                             break;
                         }
                         case '-|' : {
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
                             if (Edge.label) { lx = to.x; }
                             break;
                         }
                         case '|-' : {
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' 0,' + dy + ' ' + dx + ',0');
                             if (Edge.label) { lx = from.x; }
                             break;
                         }
                         case '-|-': {
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
                             break;
                         }
                         case '->' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             break;
                         }
                         case '~>' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + 0.3 * dx + ', ' + dy + ' ' + dx + ', ' + dy);
                             break;
                         }
                         case '-~>': {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx + ', ' + dy + ' ' + dx + ', ' + dy);
                             if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
                             break;
                         }
                         case '~->': {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + 0      + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                             if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.25); }
                             break;
                         }
                         case '-|>' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
                             if (Edge.label) { lx = to.x; }
                             break;
                         }
                         case '|->' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' 0,' + dy + ' ' + dx + ',0');
                             if (Edge.label) { lx = from.x; }
                             break;
                         }
                         case '-|->': {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
                             break;
                         }
                         case '<->' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                             break;
                         }
                         case '<~>' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' + (0.3 * dx) + ', ' + dy + ' ' + dx + ', ' + dy);
                             break;
                         }
                         case '<-~>': {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'M ' + from.x + ',' + from.y + ' ' + 'c ' + (0.7 * dx) + ', 0 ' +     dx + ', ' + dy + ' ' + dx + ', ' + dy);
                             if (Edge.label) { lx = (from.x + (to.x - from.x) * 0.75); }
                             break;
                         }
                         case '<-|>' : {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + dx + ',0 0,' + dy);
                             if (Edge.label) { lx = to.x; }
                             break;
                         }
                         case '<-|->': {
                             gmark.setAttribute('style', 'marker-end:url(#arrowhead);marker-start:url(#arrowtail);stroke:#0041c4;stroke-width:1;fill:none');
                             gmark.setAttribute('d', 'm ' + from.x + ',' + from.y + ' ' + (dx / 2) + ',0 0,' + dy + ' ' + (dx / 2) + ',0');
                             break;
                         }
                         default   : { gmark.setAttribute('style', 'fill:none;stroke:#F00;stroke-width:1'); }
                     }
                     if (Edge.label) {
                         label.setAttribute('x', lx);
                         label.setAttribute('y', ly + 3);
                         underlabel.setAttribute('x', lx - lwidth / 2);
                         underlabel.setAttribute('y', ly - 5);
                     }
                 }
             }
         }
         for (k in Events) {
             if (k === k.toLowerCase()) {
                 if (Events[k].x > 0) {
                     underlabel = jsonmlParse(['rect',
                         {
                             y: Events[k].y - 4,
                             height: 8,
                             style: 'fill:#FFF;'
                         }
                     ]);
                     label = jsonmlParse(['text',
                         {
                             style: 'font-size:8px;',
                             x: Events[k].x,
                             y: Events[k].y + 2,
                             'text-anchor': 'middle'
                         },
                         (k + '')
                     ]);

                     gg.insertBefore(underlabel, null);
                     gg.insertBefore(label, null);

                     lwidth = label.getBBox().width + 2;

                     underlabel.setAttribute('x', Events[k].x - lwidth / 2);
                     underlabel.setAttribute('width', lwidth);
                 }
             }
         }
     }
 }

module.exports = renderArcs;

/* eslint-env browser */

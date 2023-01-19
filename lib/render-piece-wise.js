'use strict';

const tt = require('onml/tt.js');

const scaled = (d, sx, sy) => {
    if (sy === undefined) {
        sy = sx;
    }
    let i = 0;
    while (i < d.length) {
        switch (d[i].toLowerCase()) {
        case 'h':
            while ((i < d.length) && !isNaN(d[i + 1])) {
                d[i + 1] *= sx; i++;
            }
            break;
        case 'v':
            while ((i < d.length) && !isNaN(d[i + 1])) {
                d[i + 1] *= sy; i++;
            }
            break;
        case 'm':
        case 'l':
        case 't':
            while (((i + 1) < d.length) && !isNaN(d[i + 1])) {
                d[i + 1] *= sx; d[i + 2] *= sy; i += 2;
            }
            break;
        case 'q':
            while (((i + 3) < d.length) && !isNaN(d[i + 1])) {
                d[i + 1] *= sx; d[i + 2] *= sy; d[i + 3] *= sx; d[i + 4] *= sy; i += 4;
            }
            break;
        case 'a':
            while (((i + 6) < d.length) && !isNaN(d[i + 1])) {
                d[i + 1] *= sx; d[i + 2] *= sy; d[i + 6] *= sx; d[i + 7] *= sy; i += 7;
            }
            break;
        }
        i++;
    }
    return d;
};

function scale (d, cfg) {
    if (typeof d === 'string') {
        d = d.trim().split(/[\s,]+/);
    }

    if (!Array.isArray(d)) {
        return;
    }

    return scaled(d, 2 * cfg.xs, -cfg.ys);
}

function renderLane (wave, idx, cfg) {
    if (Array.isArray(wave)) {
        const tag = wave[0];
        const attr = wave[1];
        if (tag === 'pw' && (typeof attr === 'object')) {
            const d = scale(attr.d, cfg);
            return ['g',
                tt(0, cfg.yo * idx + cfg.ys + cfg.y0),
                ['path', {style: 'fill:none;stroke:#000;stroke-width:1px;', d: d}]
            ];
        }
    }
}

function renderPieceWise (lanes, index, cfg) {
    let res = ['g'];
    lanes.map((row, idx) => {
        const wave = row.wave;
        if (Array.isArray(wave)) {
            res.push(renderLane(wave, idx, cfg));
        }
    });
    return res;
}

module.exports = renderPieceWise;

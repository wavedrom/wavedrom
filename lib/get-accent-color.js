'use strict';

// Reads the fill color of the 'arrowhead' marker that svg2js.js bakes into
// every skin's defs (derived from the skin's own 'arrow0' icon). This keeps
// the edge/arc line color in sync with the marker triangle color, instead of
// a fixed color that ignores the selected skin.
function getAccentColor (skin) {
    try {
        const defs = skin[3];
        const markerNode = defs.find((n) =>
            Array.isArray(n) && n[0] === 'marker' && n[1] && n[1].id === 'arrowhead');
        const style = markerNode && markerNode[1] && markerNode[1].style;
        const m = style && style.match(/fill:(#[0-9a-fA-F]+)/);
        return m ? m[1] : null;
    } catch (e) {
        return null;
    }
}

module.exports = getAccentColor;

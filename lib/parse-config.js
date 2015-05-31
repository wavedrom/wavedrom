'use strict';

function parseConfig (source, lane) {
    var hscale;

    function tonumber (x) {
        return x > 0 ? Math.round(x) : 1;
    }

    lane.hscale = 1;
    if (lane.hscale0) {
        lane.hscale = lane.hscale0;
    }
    if (source && source.config && source.config.hscale) {
        hscale = Math.round(tonumber(source.config.hscale));
        if (hscale > 0) {
            if (hscale > 100) {
                hscale = 100;
            }
            lane.hscale = hscale;
        }
    }
    lane.yh0 = 0;
    lane.yh1 = 0;
    lane.head = source.head;
    if (source && source.head) {
        if (source.head.tick || source.head.tick === 0) { lane.yh0 = 20; }
        if (source.head.tock || source.head.tock === 0) { lane.yh0 = 20; }
        if (source.head.text) { lane.yh1 = 46; lane.head.text = source.head.text; }
    }
    lane.yf0 = 0;
    lane.yf1 = 0;
    lane.foot = source.foot;
    if (source && source.foot) {
        if (source.foot.tick || source.foot.tick === 0) { lane.yf0 = 20; }
        if (source.foot.tock || source.foot.tock === 0) { lane.yf0 = 20; }
        if (source.foot.text) { lane.yf1 = 46; lane.foot.text = source.foot.text; }
    }
}

module.exports = parseConfig;

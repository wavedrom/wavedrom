'use strict';

function rec (tmp, state) {
    let deltaX = 10;

    let name;
    if (typeof tmp[0] === 'string' || typeof tmp[0] === 'number') {
        name = tmp[0];
        deltaX = 25;
    }
    state.x += deltaX;
    for (let i = 0; i < tmp.length; i++) {
        if (typeof tmp[i] === 'object') {
            if (Array.isArray(tmp[i])) {
                const oldY = state.y;
                state = rec(tmp[i], state);
                state.groups.push({x: state.xx, y: oldY, height: (state.y - oldY), name: state.name});
            } else {
                state.lanes.push(tmp[i]);
                state.width.push(state.x);
                state.y += 1;
            }
        }
    }
    state.xx = state.x;
    state.x -= deltaX;
    state.name = name;
    return state;
}

module.exports = rec;

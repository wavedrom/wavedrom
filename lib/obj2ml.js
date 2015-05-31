'use strict';

function isObject (o) {
    return o && Object.prototype.toString.call(o) === '[object Object]';
}

function isString (s) {
    return typeof s === 'string' || s instanceof String;
}

function indent (txt) {
    var arr, res;

    if (!isString(txt)) { return txt; }

    arr = txt.split('\n');

    if (arr.length === 1) { return '  ' + txt; }

    res = [];
    arr.forEach(function (e) {
        if (e === '') {
            res.push(e);
            return;
        }
        res.push('  ' + e);
    });

    return res.join('\n');
}

function rec (obj) {
    var res, tmp, tag, start, i;

    tag = obj[0];
    res = '<' + tag;

    if (isObject(obj[1])) {
        Object.keys(obj[1]).forEach(function (key) {
            res += ' ' + key + '="' + obj[1][key] + '"';
        });
        // if (obj.length === 2) {
        //     return res + '/>\n';
        // }
        start = 2;
    } else {
        // if (obj.length === 1) {
        //     return res + '/>\n';
        // }
        start = 1;
    }

    res += '>\n';

    tmp = '';
    for (i = start; i < obj.length; i++) {
        if (isString(obj[i])) {
            tmp += obj[i] + '\n';
        } else {
            tmp += rec(obj[i]);
        }
    }
    res += indent(tmp);
    res += '</' + tag + '>\n';

    return res;
}

module.exports = rec;

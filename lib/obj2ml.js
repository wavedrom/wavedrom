'use strict';

function isObject (o) {
    return o && Object.prototype.toString.call(o) === '[object Object]';
}

function indent (txt) {
    var arr, res = [];

    if (typeof txt !== 'string') {
        return txt;
    }

    arr = txt.split('\n');

    if (arr.length === 1) {
        return '  ' + txt;
    }

    arr.forEach(function (e) {
        if (e === '') {
            res.push(e);
            return;
        }
        res.push('  ' + e);
    });

    return res.join('\n');
}

function obj2ml (a) {
    var res, body;

    body = '';
    if (a.some(function (e, i, arr) {
        if (i === 0) {
            res = '<' + e;
            if (arr.length === 1) {
                return true;
            }
            return;
        }

        if (i === 1) {
            if (isObject(e)) {
                Object.keys(e).forEach(function (key) {
                    res += ' ' + key + '="' + e[key] + '"';
                });
                if (arr.length === 2) {
                    return true;
                }
                res += '>\n';
                return;
            } else {
                res += '>\n';
            }
        }

        if (typeof e === 'string') {
            body += e + '\n';
            return;
        }

        body += obj2ml(e);
    })) {
        return res + '/>\n'; // short form
    } else {
        return res + indent(body) + '</' + a[0] + '>\n';
    }
}

module.exports = obj2ml;

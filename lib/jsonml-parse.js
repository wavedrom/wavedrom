'use strict';

var hydrate = require('./jsonml-hydrate'),
    w3 = require('./w3'),
    appendChild = require('./jsonml-append-child'),
    addAttributes = require('./jsonml-add-attributes'),
    trimWhitespace = require('./jsonml-trim-whitespace');

var patch,
    parse,
    onerror = null;

/*bool*/ function isElement (/*JsonML*/ jml) {
    return (jml instanceof Array) && (typeof jml[0] === 'string');
}

/*DOM*/ function onError (/*Error*/ ex, /*JsonML*/ jml, /*function*/ filter) {
    return document.createTextNode('[' + ex + '-' + filter + ']');
}

patch = /*DOM*/ function (/*DOM*/ elem, /*JsonML*/ jml, /*function*/ filter) {
    for (var i = 1; i < jml.length; i++) {

        if (
            (jml[i] instanceof Array) ||
            (typeof jml[i] === 'string')
        ) {
            // append children
            appendChild(elem, parse(jml[i], filter));
        // } else if (jml[i] instanceof Unparsed) {
        } else if (
            jml[i] &&
            jml[i].value
        ) {
            appendChild(elem, hydrate(jml[i].value));
        } else if (
            (typeof jml[i] === 'object') &&
            (jml[i] !== null) &&
            elem.nodeType === 1
        ) {
            // add attributes
            elem = addAttributes(elem, jml[i]);
        }
    }

    return elem;
};

parse = /*DOM*/ function (/*JsonML*/ jml, /*function*/ filter) {
    var elem;

    try {
        if (!jml) {
            return null;
        }

        if (typeof jml === 'string') {
            return document.createTextNode(jml);
        }

        // if (jml instanceof Unparsed) {
        if (jml && jml.value) {
            return hydrate(jml.value);
        }

        if (!isElement(jml)) {
            throw new SyntaxError('invalid JsonML');
        }

        var tagName = jml[0]; // tagName
        if (!tagName) {
            // correctly handle a list of JsonML trees
            // create a document fragment to hold elements
            var frag = document.createDocumentFragment ?
                document.createDocumentFragment() :
                document.createElement('');
            for (var i = 2; i < jml.length; i++) {
                appendChild(frag, parse(jml[i], filter));
            }

            // trim extraneous whitespace
            trimWhitespace(frag);

            // eliminate wrapper for single nodes
            if (frag.childNodes.length === 1) {
                return frag.firstChild;
            }
            return frag;
        }

        if (
            tagName.toLowerCase() === 'style' &&
            document.createStyleSheet
        ) {
            // IE requires this interface for styles
            patch(document.createStyleSheet(), jml, filter);
            // in IE styles are effective immediately
            return null;
        }

        elem = patch(document.createElementNS(w3.svg, tagName), jml, filter);

        // trim extraneous whitespace
        trimWhitespace(elem);
        // return (elem && (typeof filter === 'function')) ? filter(elem) : elem;
        return elem;
    } catch (ex) {
        try {
            // handle error with complete context
            var err = (typeof onerror === 'function') ? onerror : onError;
            return err(ex, jml, filter);
        } catch (ex2) {
            return document.createTextNode('[' + ex2 + ']');
        }
    }
};

module.exports = parse;

/* eslint-env browser */
/* eslint yoda:1 */

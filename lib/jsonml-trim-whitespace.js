'use strict';

/*bool*/ function isWhitespace(/*DOM*/ node) {
    return node &&
        (node.nodeType === 3) &&
        (!node.nodeValue || !/\S/.exec(node.nodeValue));
}

/*void*/ function trimWhitespace(/*DOM*/ elem) {
    if (elem) {
        while (isWhitespace(elem.firstChild)) {
            // trim leading whitespace text nodes
            elem.removeChild(elem.firstChild);
        }
        while (isWhitespace(elem.lastChild)) {
            // trim trailing whitespace text nodes
            elem.removeChild(elem.lastChild);
        }
    }
}

module.exports = trimWhitespace;

/* eslint-env browser */

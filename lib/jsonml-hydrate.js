'use strict';

var trimWhitespace = require('./jsonml-trim-whitespace');

/*DOM*/ function hydrate(/*string*/ value) {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = value;

    // trim extraneous whitespace
    trimWhitespace(wrapper);

    // eliminate wrapper for single nodes
    if (wrapper.childNodes.length === 1) {
        return wrapper.firstChild;
    }

    // create a document fragment to hold elements
    var frag = document.createDocumentFragment ?
        document.createDocumentFragment() :
        document.createElement('');

    while (wrapper.firstChild) {
        frag.appendChild(wrapper.firstChild);
    }
    return frag;
}

module.exports = hydrate;

/* eslint-env browser */

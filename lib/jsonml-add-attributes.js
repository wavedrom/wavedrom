'use strict';

//attribute name mapping
var ATTRMAP = {
        rowspan : 'rowSpan',
        colspan : 'colSpan',
        cellpadding : 'cellPadding',
        cellspacing : 'cellSpacing',
        tabindex : 'tabIndex',
        accesskey : 'accessKey',
        hidefocus : 'hideFocus',
        usemap : 'useMap',
        maxlength : 'maxLength',
        readonly : 'readOnly',
        contenteditable : 'contentEditable'
        // can add more attributes here as needed
    },
    // attribute duplicates
    ATTRDUP = {
        enctype : 'encoding',
        onscroll : 'DOMMouseScroll'
        // can add more attributes here as needed
    },
    // event names
    EVTS = (function (/*string[]*/ names) {
        var evts = {}, evt;
        while (names.length) {
            evt = names.shift();
            evts['on' + evt.toLowerCase()] = evt;
        }
        return evts;
    })('blur,change,click,dblclick,error,focus,keydown,keypress,keyup,load,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,resize,scroll,select,submit,unload'.split(','));

/*void*/ function addHandler(/*DOM*/ elem, /*string*/ name, /*function*/ handler) {
    if (typeof handler === 'string') {
        handler = new Function('event', handler);
    }

    if (typeof handler !== 'function') {
        return;
    }

    elem[name] = handler;
}

/*DOM*/ function addAttributes(/*DOM*/ elem, /*object*/ attr) {
    if (attr.name && document.attachEvent) {
        try {
            // IE fix for not being able to programatically change the name attribute
            var alt = document.createElement('<' + elem.tagName + ' name=\'' + attr.name + '\'>');
            // fix for Opera 8.5 and Netscape 7.1 creating malformed elements
            if (elem.tagName === alt.tagName) {
                elem = alt;
            }
        } catch (ex) {
            console.log(ex);
        }
    }

    // for each attributeName
    for (var name in attr) {
        if (attr.hasOwnProperty(name)) {
            // attributeValue
            var value = attr[name];
            if (
                name &&
                value !== null &&
                typeof value !== 'undefined'
            ) {
                name = ATTRMAP[name.toLowerCase()] || name;
                if (name === 'style') {
                    if (typeof elem.style.cssText !== 'undefined') {
                        elem.style.cssText = value;
                    } else {
                        elem.style = value;
                    }
//                    } else if (name === 'class') {
//                        elem.className = value;
//                        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//                        elem.setAttribute(name, value);
//                        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                } else if (EVTS[name]) {
                    addHandler(elem, name, value);

                    // also set duplicated events
                    if (ATTRDUP[name]) {
                        addHandler(elem, ATTRDUP[name], value);
                    }
                } else if (
                     typeof value === 'string' ||
                     typeof value === 'number' ||
                     typeof value === 'boolean'
                ) {
                    elem.setAttribute(name, value);

                    // also set duplicated attributes
                    if (ATTRDUP[name]) {
                        elem.setAttribute(ATTRDUP[name], value);
                    }
                } else {

                    // allow direct setting of complex properties
                    elem[name] = value;

                    // also set duplicated attributes
                    if (ATTRDUP[name]) {
                        elem[ATTRDUP[name]] = value;
                    }
                }
            }
        }
    }
    return elem;
}

module.exports = addAttributes;

/* eslint-env browser */
/* eslint no-new-func:0 */

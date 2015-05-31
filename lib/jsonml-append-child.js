'use strict';

/*void*/ function appendChild(/*DOM*/ elem, /*DOM*/ child) {
    if (child) {
        // if (
        //     elem.tagName &&
        //     elem.tagName.toLowerCase() === 'table' &&
        //     elem.tBodies
        // ) {
        //     if (!child.tagName) {
        //         // must unwrap documentFragment for tables
        //         if (child.nodeType === 11) {
        //             while (child.firstChild) {
        //                 appendChild(elem, child.removeChild(child.firstChild));
        //             }
        //         }
        //         return;
        //     }
        //     // in IE must explicitly nest TRs in TBODY
        //     var childTag = child.tagName.toLowerCase();// child tagName
        //     if (childTag && childTag !== "tbody" && childTag !== "thead") {
        //         // insert in last tbody
        //         var tBody = elem.tBodies.length > 0 ? elem.tBodies[elem.tBodies.length - 1] : null;
        //         if (!tBody) {
        //             tBody = document.createElement(childTag === "th" ? "thead" : "tbody");
        //             elem.appendChild(tBody);
        //         }
        //         tBody.appendChild(child);
        //     } else if (elem.canHaveChildren !== false) {
        //         elem.appendChild(child);
        //     }
        // } else
        if (
            elem.tagName &&
            elem.tagName.toLowerCase() === 'style' &&
            document.createStyleSheet
        ) {
            // IE requires this interface for styles
            elem.cssText = child;
        } else

        if (elem.canHaveChildren !== false) {
            elem.appendChild(child);
        }
        // else if (
        //     elem.tagName &&
        //     elem.tagName.toLowerCase() === 'object' &&
        //     child.tagName &&
        //     child.tagName.toLowerCase() === 'param'
        // ) {
        //         // IE-only path
        //     try {
        //         elem.appendChild(child);
        //     } catch (ex1) {
        //
        //     }
        //     try {
        //         if (elem.object) {
        //             elem.object[child.name] = child.value;
        //         }
        //     } catch (ex2) {}
        // }
    }
}

module.exports = appendChild;

/* eslint-env browser */

'use strict';

const stringify = require('onml/stringify.js');

const eva = require('./eva.js');
const renderAny = require('./render-any.js');

// UTF-8 safe base64
function b64 (str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
    ));
}

function appendSaveAsDialog (index, output) {
    let menu;

    // Exported file must be standalone: re-render from source with
    // notFirstSignal / notFirstAssign = false so own skin / <style> is embedded.
    function svgString () {
        const src = document.getElementById('InputJSON_' + index);
        if (src) {
            return stringify(renderAny(index, eva('InputJSON_' + index), window.WaveSkin, false, false));
        }
        return div.innerHTML; // no source element: best effort
    }

    function closeMenu(e) {
        const left = parseInt(menu.style.left, 10);
        const top = parseInt(menu.style.top, 10);
        if (
            e.x < left ||
            e.x > (left + menu.offsetWidth) ||
            e.y < top ||
            e.y > (top + menu.offsetHeight)
        ) {
            menu.parentNode.removeChild(menu);
            document.body.removeEventListener('mousedown', closeMenu, false);
        }
    }

    const div = document.getElementById(output + index);

    div.childNodes[0].addEventListener('contextmenu',
        function (e) {
            menu = document.createElement('div');

            menu.className = 'wavedromMenu';
            menu.style.top = e.y + 'px';
            menu.style.left = e.x + 'px';

            const list = document.createElement('ul');
            const savePng = document.createElement('li');
            savePng.innerHTML = 'Save as PNG';
            list.appendChild(savePng);

            const saveSvg = document.createElement('li');
            saveSvg.innerHTML = 'Save as SVG';
            list.appendChild(saveSvg);

            //const saveJson = document.createElement('li');
            //saveJson.innerHTML = 'Save as JSON';
            //list.appendChild(saveJson);

            menu.appendChild(list);

            document.body.appendChild(menu);

            savePng.addEventListener('click',
                function () {
                    const svgdata = 'data:image/svg+xml;base64,' + b64(svgString());
                    const img = new Image();
                    img.src = svgdata;
                    img.onload = function () {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const context = canvas.getContext('2d');
                        context.drawImage(img, 0, 0);

                        const pngdata = canvas.toDataURL('image/png');

                        const a = document.createElement('a');
                        a.href = pngdata;
                        a.download = 'wavedrom.png';
                        a.click();

                        menu.parentNode.removeChild(menu);
                        document.body.removeEventListener('mousedown', closeMenu, false);
                    };
                },
                false
            );

            saveSvg.addEventListener('click',
                function () {
                    const svgdata = 'data:image/svg+xml;base64,' + b64(svgString());
                    const a = document.createElement('a');
                    a.href = svgdata;
                    a.download = 'wavedrom.svg';
                    a.click();

                    menu.parentNode.removeChild(menu);
                    document.body.removeEventListener('mousedown', closeMenu, false);
                },
                false
            );

            menu.addEventListener('contextmenu',
                function (ee) {
                    ee.preventDefault();
                },
                false
            );

            document.body.addEventListener('mousedown', closeMenu, false);

            e.preventDefault();
        },
        false
    );
}

module.exports = appendSaveAsDialog;

/* eslint-env browser */

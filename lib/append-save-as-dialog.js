'use strict';

function appendSaveAsDialog (index, output) {
    let menu;

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
                    let html = '';
                    if (index !== 0) {
                        const firstDiv = document.getElementById(output + 0);
                        html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
                    }
                    html = [div.innerHTML.slice(0, 166), html, div.innerHTML.slice(166)].join('');
                    const svgdata = 'data:image/svg+xml;base64,' + btoa(html);
                    const img = new Image();
                    img.src = svgdata;
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
                },
                false
            );

            saveSvg.addEventListener('click',
                function () {
                    let html = '';
                    if (index !== 0) {
                        const firstDiv = document.getElementById(output + 0);
                        html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
                    }
                    html = [div.innerHTML.slice(0, 166), html, div.innerHTML.slice(166)].join('');
                    const svgdata = 'data:image/svg+xml;base64,' + btoa(html);

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

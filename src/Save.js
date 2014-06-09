
WaveDrom.AppendSaveAsDialog =  function (index, output) {
  "use strict";
  var div = document.getElementById(output + index);
  div.childNodes[0].addEventListener(
    'contextmenu',
    function (e) {

      var menu = document.createElement('div');
      menu.className = 'wavedromMenu';
      menu.style.top = e.pageY + 'px';
      menu.style.left = e.pageX + 'px';

      var list = document.createElement('ul');
      var savePng = document.createElement('li');
      savePng.innerHTML = 'Save as PNG';
      list.appendChild(savePng);

      var saveSvg = document.createElement('li');
      saveSvg.innerHTML = 'Save as SVG';
      list.appendChild(saveSvg);

      //var saveJson = document.createElement('li');
      //saveJson.innerHTML = 'Save as JSON';
      //list.appendChild(saveJson);

      menu.appendChild(list);

      document.body.appendChild(menu);

      savePng.addEventListener(
        'click',
        function (e) {
          var html = '';
          if (index !== 0) {
              var firstDiv = document.getElementById(output + 0);
              html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
          }
          html = [div.innerHTML.slice(0, 166), html, div.innerHTML.slice(166)].join('');
          var svgdata = 'data:image/svg+xml;base64,' + btoa(html);
          var img = new Image ();
          img.src = svgdata;
          var canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          var context = canvas.getContext('2d');
          context.drawImage(img, 0, 0);

          var pngdata = canvas.toDataURL('image/png');

          var a = document.createElement('a');
          a.href = pngdata;
          a.download = 'wavedrom.png';
          a.click();

          menu.parentNode.removeChild(menu);
          document.body.removeEventListener('mousedown', closeMenu, false);
        },
        false
      );

      saveSvg.addEventListener(
        'click',
        function (e) {
          var html = '';
          if (index !== 0) {
              var firstDiv = document.getElementById(output + 0);
              html += firstDiv.innerHTML.substring(166, firstDiv.innerHTML.indexOf('<g id="waves_0">'));
          }
          html = [div.innerHTML.slice(0, 166), html, div.innerHTML.slice(166)].join('');
          var svgdata = 'data:image/svg+xml;base64,' + btoa(html);

          var a = document.createElement('a');
          a.href = svgdata;
          a.download = 'wavedrom.svg';
          a.click();

          menu.parentNode.removeChild(menu);
          document.body.removeEventListener('mousedown', closeMenu, false);
        },
        false
      );

      /*saveJson.addEventListener('click', function(e) {
          menu.parentNode.removeChild(menu);
          document.body.removeEventListener('mousedown', closeMenu, false);
      }, false);
      */

      menu.addEventListener(
        'contextmenu',
        function (e) {
          e.preventDefault();
        },
        false
      );

      var closeMenu = function(e) {
        var left = parseInt(menu.style.left, 10);
        var top = parseInt(menu.style.top, 10);
        if (e.pageX < left || e.pageX > (left + menu.offsetWidth) || e.pageY < top || e.pageY > (top + menu.offsetHeight)) {
          menu.parentNode.removeChild(menu);
          document.body.removeEventListener('mousedown', closeMenu, false);
        }
      };

      document.body.addEventListener('mousedown', closeMenu, false);

      e.preventDefault();
    },
    false
  );
};

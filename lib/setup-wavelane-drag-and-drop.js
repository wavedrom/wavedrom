'use strict';

var interact = require('interact.js'),
    snap = require('snapsvg');

//sets up the wavelanes to be drag and droppable
function setupWavelaneDragAndDrop(){
  var waveLanes,
      i,
      root,
      dragTransform = 'none',
      dragIndex = -1,
      x = 0,
      y = 0,
      isAnimating = false,
      doNotDoAnything = false,
      point,
      newpoint,
      boundingBox,
      newWidth,
      newHeight,
      dropTarget,
      dropped,
      snapCache = [],

  //process the dragging
  waveLanes = document.getElementsByClassName('wavedrom-draggable');

  //cache the snap constructors for performance
  for (i = 0; i < waveLanes.length; i++) {
      waveLanes.item(i).setAttribute('snapCacheIndex', i);
      snapCache[i] = snap(waveLanes.item(i));
  }
  root = document.getElementById('svgcontent_0');

  //uses interact.js to make the wavelanes interactable
  interact('.wavedrom-draggable')
      .draggable({
          onstart: function (event) {
              //if it is animating ignore all interactions
              if (!isAnimating) {
                  dragIndex = event.target.getAttribute('snapCacheIndex');

                  //get the start position so it can swap with a drop target
                  //or return to its orignal position
                  dragTransform = event.target.getAttribute('transform');

                  //get the mouse position in the wavelane coordinate system
                  point = root.createSVGPoint();
                  //event.clientX;
                  //page
                  point.x = event.clientX;
                  point.y = event.clientY;
                  newpoint = point.matrixTransform(event.target.parentElement.getScreenCTM().inverse());

                  //get wavelane height and width
                  boundingBox = event.target.getBBox();
                  newWidth = boundingBox.width;
                  newHeight = boundingBox.height;

                  //move the wavelane so that it is centered on the mouse position
                  //and is half the original size
                  snapCache[dragIndex]
                  .animate({ transform: 'matrix(.5 0 0 .5 ' + (newpoint.x - newWidth / 4) + ' ' + (newpoint.y - newHeight / 4) + ')' }, 100);

                  //save the xand y positions for updating
                  x = (newpoint.x - newWidth / 4);
                  y = (newpoint.y - newHeight / 4);
                  dropped = false;

                  //move the elemnt farthest down the svg tree so that
                  //it will be rendered ontopt of all other wavelanes
                  event.target.parentElement.appendChild(event.target);
              }
              else {
                  doNotDoAnything = true;
              }
          },
          onmove: function (event) {
              if (!isAnimating && !doNotDoAnything) {
                 // update the position
                  x = x + event.dx;
                  y = y + event.dy;
                  event.target.setAttribute('transform', 'matrix(.5 0 0 .5 ' + x + ',' + y + ')');
              }
          },
          onend: function () {

              if (doNotDoAnything) {
                  doNotDoAnything = false;
              }
              else {
                  if (!isAnimating) {
                      if (!dropped) {
                          //if the wavelane was not dropped then
                          //return to starting position and size
                          isAnimating = true;

                          snapCache[dragIndex]
                          .animate({ transform: dragTransform }, 500, null, function () {
                              isAnimating = false;
                          });

                          dragIndex = -1;
                      }
                  }
              }
          }
      })
      .dropzone({
          ondrop: function (event) {
              if (!isAnimating && !doNotDoAnything) {
                  //switch positions
                  dropTarget = event.target.getAttribute('transform');
                  isAnimating = true;


                  snapCache[event.target.getAttribute('snapCacheIndex')]
                      .animate({ transform: dragTransform }, 500, null, function () {
                          isAnimating = false;
                      });

                  snapCache[dragIndex]
                      .animate({ transform: dropTarget }, 250);
                  dropped = true;

              }
          }
      })
      .allowFrom('.wavedrom-draggable-hitbox');

  document.addEventListener('dragstart', function (event) {
      event.preventDefault();
  });

}

module.exports = setupWavelaneDragAndDrop;

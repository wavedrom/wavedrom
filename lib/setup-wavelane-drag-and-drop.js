'use strict';

var animate = require('animateplus');

//sets up the wavelanes to be drag and droppable
function setupWavelaneDragAndDrop(){
  var waveLanes,
      hitbox,
      hitboxes,
      i,
      root,
      dragTransform = 'none',
      dragIndex = -1,
      dropIndex = -1,
      isAnimating = false,
      doNotDoAnything = false,
      point,
      newpoint,
      boundingBox,
      newWidth,
      newHeight,
      dropTarget,
      onStartPoints,
      onDropPoints,
      oldPointerEvents,
      dropped,
      dragging = false,
      snapCache = [];

  //process the dragging
  waveLanes = document.getElementsByClassName('wavedrom-draggable');

  hitboxes = document.getElementsByClassName('wavedrom-draggable-hitbox');


  //cache the snap constructors for performance
  for (i = 0; i < waveLanes.length; i++) {
      waveLanes.item(i).setAttribute('snapCacheIndex', i);
      hitbox = waveLanes.item(i).getElementsByClassName('wavedrom-draggable-hitbox');
      hitbox.item(0).setAttribute('snapCacheIndex', i);

      snapCache[i] = waveLanes.item(i);
  }


  root = document.getElementById('svgcontent_0');

  point = root.createSVGPoint();


  for(i = 0; i < hitboxes.length; i++){
    hitboxes.item(i).addEventListener('mousedown', function (event){
        console.log('hit box mouse down');
        if (!isAnimating) {
            dragIndex = event.target.getAttribute('snapCacheIndex');
            oldPointerEvents = snapCache[dragIndex].getAttribute('pointer-events');
            snapCache[dragIndex].setAttribute('pointer-events', 'none');

            //get the start position so it can swap with a drop target
            //or return to its orignal position
            dragTransform = snapCache[dragIndex].getAttribute('transform');

            //get the mouse position in the wavelane coordinate system
            point.x = event.clientX;
            point.y = event.clientY;
            newpoint = point.matrixTransform(snapCache[dragIndex].parentElement.getScreenCTM().inverse());

            //get wavelane height and width
            boundingBox = snapCache[dragIndex].getBBox();
            newWidth = boundingBox.width;
            newHeight = boundingBox.height;

            //move the wavelane so that it is centered on the mouse position
            //and is half the original size
            //snapCache[dragIndex]
            //.animate({ transform: 'matrix(.5 0 0 .5 ' + (newpoint.x - newWidth / 4) + ' ' + (newpoint.y - newHeight / 4) + ')' }, 100);

            onStartPoints = [
              dragTransform,
              'matrix(.5 0 0 .5 ' + (newpoint.x - newWidth / 4) + ' ' + (newpoint.y - newHeight / 4) + ')'
            ];
            animate({
              el: snapCache[dragIndex],
              transform: onStartPoints,
              duration: 100,
              easing: 'easeInOutBack'
            });

            //save the xand y positions for updating
            //x = (newpoint.x - newWidth / 4);
            //y = (newpoint.y - newHeight / 4);
            dropped = false;
            dragging = true;
            //move the elemnt farthest down the svg tree so that
            //it will be rendered ontopt of all other wavelanes
            snapCache[dragIndex].parentElement.appendChild(snapCache[dragIndex]);

            //cancel bubbling
            if(event.stopPropagation) event.stopPropagation();
            if(event.preventDefault) event.preventDefault();
            event.cancelBubble=true;
            event.returnValue=false;
            return false;
        }
        else {
            doNotDoAnything = true;
        }
    });

    hitboxes.item(i).addEventListener('mouseup', function (event){
      console.log('hitbox #'+i+ 'dropped on');

      if (!isAnimating && !doNotDoAnything) {
          //switch positions

          dropIndex = event.target.getAttribute('snapCacheIndex');
          console.log('drop index #'+i+ 'dropped on');


          dropTarget = snapCache[dropIndex].getAttribute('transform');
          isAnimating = true;


          onStartPoints = [
            snapCache[dropIndex].getAttribute('transform'),
            dragTransform,
          ];
          animate({
            el: snapCache[dropIndex],
            transform: onStartPoints,
            duration: 500,
            easing: 'easeOutCubic',
            complete: function () {
                isAnimating = false;
            }
          });

          //snapCache[event.target.getAttribute('snapCacheIndex')]
          //    .animate({ transform: dragTransform }, 500, null, function () {
          //        isAnimating = false;
          //    });




          onDropPoints = [
             snapCache[dragIndex].getAttribute('transform'),
             dropTarget
          ],
          animate({
            el: snapCache[dragIndex],
            duration: 250,
            easing: 'easeOutCubic',
            transform: onDropPoints
          });
          //snapCache[dragIndex]
          //    .animate({ transform: dropTarget }, 250);
          dropped = true;
          dragging = false;
          snapCache[dragIndex].setAttribute('pointer-events', oldPointerEvents);

      }
  });
}

  document.addEventListener('mousemove', function (event) {
    if(dragging){
      if (!isAnimating && !doNotDoAnything) {


        point.x = event.clientX;
        point.y = event.clientY;
        newpoint = point.matrixTransform(snapCache[dragIndex].parentElement.getScreenCTM().inverse());

        //get wavelane height and width
        boundingBox = snapCache[dragIndex].getBBox();
        newWidth = boundingBox.width;
        newHeight = boundingBox.height;

        snapCache[dragIndex].setAttribute('transform','matrix(.5 0 0 .5 ' + (newpoint.x - newWidth / 4) + ' ' + (newpoint.y - newHeight / 4) + ')');

      }
    }
  });

  document.addEventListener('mouseup', function (){
    console.log('global mouse up');

    if(dragging && !dropped){
      if (doNotDoAnything) {
          doNotDoAnything = false;
      }
      else {
          if (!isAnimating) {
              if (!dropped) {
                  //if the wavelane was not dropped then
                  //return to starting position and size
                  isAnimating = true;



                  onStartPoints = [
                    snapCache[dragIndex].getAttribute('transform'),
                    dragTransform
                  ];
                  animate({
                    el: snapCache[dragIndex],
                    transform: onStartPoints,
                    duration: 500,
                    easing: 'easeOutCubic',
                    complete: function () {
                        isAnimating = false;
                    }
                  });
                  //snapCache[dragIndex]
                  //.animate({ transform: dragTransform }, 500, null, function () {
                  //    isAnimating = false;
                  //});


                  dragging = false;

                  snapCache[dragIndex].setAttribute('pointer-events', oldPointerEvents);

                  dragIndex = -1;

              }
          }
      }
    }
  });

  document.addEventListener('dragstart', function (event) {
      event.preventDefault();
  });

}

module.exports = setupWavelaneDragAndDrop;

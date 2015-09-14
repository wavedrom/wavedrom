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
      point,
      newpoint,
      boundingBox,
      newWidth,
      newHeight,
      dropTarget,
      onStartPoints,
      onDropPoints,
      oldPointerEvents,
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


  var state = 'waitForDrag';
  var exceptionState = 'none';
  for(i = 0; i < hitboxes.length; i++){
     hitboxes.item(i).addEventListener('mousedown', function (event){
        if(state ===  'waitForDrag' && event.detail === 1){
              console.log('in waitForDrag detail is '+event.detail);
              state = 'processMouseDown';


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

              onStartPoints = [
                dragTransform,
                'matrix(.5 0 0 .5 ' + (newpoint.x - newWidth / 4) + ' ' + (newpoint.y - newHeight / 4) + ')'
              ];
              animate({
                el: snapCache[dragIndex],
                transform: onStartPoints,
                duration: 100,
                easing: 'easeInOutBack',
                complete: function () {
                  if(exceptionState !== 'none'){
                    console.log('in mousedown exceptionState: '+ exceptionState);
                    exceptionState = 'none';

                    //reset state
                    snapCache[dragIndex].setAttribute('pointer-events', oldPointerEvents);
                    snapCache[dragIndex].setAttribute('transform', dragTransform);
                    state = 'ignoreMouseUp';
                  }else{
                    state = 'readyToMove';
                  }
                }
              });

              //move the elemnt farthest down the svg tree so that
              //it will be rendered ontopt of all other wavelanes
              snapCache[dragIndex].parentElement.appendChild(snapCache[dragIndex]);



        //cancel bubbling
        if(event.stopPropagation) event.stopPropagation();
        if(event.preventDefault) event.preventDefault();
        event.cancelBubble=true;
        event.returnValue=false;
      }
    });

    hitboxes.item(i).addEventListener('mouseup', function (event){
      if(state === 'moving'){

        state = 'swapLanes';
        //switch positions

        dropIndex = event.target.getAttribute('snapCacheIndex');
        //console.log('drop index #'+dropIndex+ 'dropped on');


        dropTarget = snapCache[dropIndex].getAttribute('transform');


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
              if(exceptionState !== 'none'){
                console.log('in mouseup exceptionState: '+ exceptionState);
                //reset state
                state = 'waitForDrag';
                exceptionState = 'none';
              }else{
                state = 'waitForDrag';
              }
              snapCache[dragIndex].setAttribute('pointer-events', oldPointerEvents);

          }
        });


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


        //cancel bubbling
        if(event.stopPropagation) event.stopPropagation();
        if(event.preventDefault) event.preventDefault();
        event.cancelBubble=true;
        event.returnValue=false;
      }


  });
}

   document.addEventListener('mousemove', function (event) {
     if(state === 'readyToMove'){
       state = 'moving';
     }
     if(state === 'moving'){
       point.x = event.clientX;
       point.y = event.clientY;
       newpoint = point.matrixTransform(snapCache[dragIndex].parentElement.getScreenCTM().inverse());

       //get wavelane height and width
       boundingBox = snapCache[dragIndex].getBBox();
       newWidth = boundingBox.width;
       newHeight = boundingBox.height;

       snapCache[dragIndex].setAttribute('transform','matrix(.5 0 0 .5 ' + (newpoint.x - newWidth / 4) + ' ' + (newpoint.y - newHeight / 4) + ')');
     }

  });



   document.addEventListener('mouseup', function (){
    //console.log('global mouse up');


    //if the wavelane was not dropped then
    //return to starting position and size
    if(state === 'moving' ) {
      onDropPoints = [
        snapCache[dragIndex].getAttribute('transform'),
        dragTransform
      ];
      animate({
        el: snapCache[dragIndex],
        transform: onDropPoints,
        duration: 500,
        easing: 'easeOutCubic',
        complete: function () {
            state = 'waitForDrag';
        }
      });



      snapCache[dragIndex].setAttribute('pointer-events', oldPointerEvents);
   }else{

       console.log('in exception, state is '+ state);
       if(state !== 'ignoreMouseUp' && state !== 'waitForDrag'){
         exceptionState ='globalMouseUpNotMoving';
       }else{
         exceptionState ='none';
         state = 'waitForDrag';
       }
   }


  });



}

module.exports = setupWavelaneDragAndDrop;

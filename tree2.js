var $canv = $("#treecanvas");
var canv = $canv[0];
var w = $("#box").width();
var h = $("#box").height();
canv.width = w;
canv.height = h;

//光标复位
$(document).off('mouseup.canv').on('mouseup.canv', function (ev) {
  if ($canv.css("cursor") === "move") {
    $canv.css({
      cursor: "auto"
    });
  }
});

// $canv.drawRect({
//   layer: true,
//   draggable: true,
//   fillStyle: '#555',
//   x: -2 * w, y: -2 * h,
//   width: 5 * w, height: 5 * h,
//   fromCenter: false,
//   dragstart: function (layer) {
//     $canv.css({
//       cursor: "move"
//     });
//   },
//   drag: function (layer) {
//   },
//   dragstop: function (layer) {
//     $canv.setLayer(layer, {
//       x: -2 * w, y: -2 * h,
//     })
//       .drawLayers();
//   }
// });


$('canvas').translateCanvas({
  translateX: 200, translateY: 100
})
  .drawRect({
    fillStyle: '#76e219',
    x: 50, y: 50,
    width: 100, height: 50
  })
  .restoreCanvas();

$canv.drawRect({
  layer: true,
  draggable: true,
  fillStyle: '#555',
  x: 0, y: 0,
  width: 100, height: 200,
  fromCenter: false,
});
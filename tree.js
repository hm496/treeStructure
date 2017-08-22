var $canv = $("#treecanvas");
var canv = $canv[0];
var winW = $("#box").width();
var winH = $("#box").height();
canv.width = winW;
canv.height = winH;

canv.width = $("#box").width();
canv.height = $("#box").height();

window.addEventListener('resize', function (ev) {
  setTimeout(function () {
    winW = $("#box").width();
    winH = $("#box").height();
    canv.width = winW;
    canv.height = winH;
    $canv.drawLayers();
  }, 150);
});

render($("#box").width(), $("#box").height());

var mockData = {
  name: "云南省公安厅",
  nodes: [
    {
      name: "昆明市公安局",
      nodes: [
        { name: "五华区公安分局" },
      ]
    },
    {
      name: "丽江市公安局",
      nodes: [
        {
          name: "古城区公安分局",
        },
        {
          name: "永胜县公安局",
          nodes: [
            {
              name: "永北镇派出所",
            },
            {
              name: "三川镇派出所",
            },
          ]
        }
      ],
    },
  ],
};

//光标复位
$(document).off('mouseup.canv').on('mouseup.canv', function (ev) {
  if ($canv.css("cursor") === "move") {
    $canv.css({
      cursor: "auto"
    });
  }
});

function render(w, h) {
  $canv.drawRect({
    layer: true,
    draggable: true,
    dragGroups: ['maxBox'],
    groups: ['maxBox'],
    name: "maxBox",
    fillStyle: '#555',
    x: -2 * w, y: -2 * h,
    width: 5 * w, height: 5 * h,
    fromCenter: false,
    dragstart: function (layer) {
      $canv.css({
        cursor: "move"
      });
    },
    drag: function (layer) {
    },
    dragstop: function (layer) {
      $canv.setLayer(layer, {
        x: -2 * w, y: -2 * h,
      })
        .drawLayers();
    }
  });

  //绘制 文字和矩形
  rectItem("五华区公安分局", {
    x: 0,
    y: 0,
  }, $canv);

  rectItem("永北镇派出所", {
    x: 200,
    y: 300,
  }, $canv);
}

function rectItem(text, pos, $canv) {
  //传进来data
  //文字,坐标
  //坐标为 顶边中点

  //绘制 文字和矩形
  //返回 {data,layer}
  var rectW = 110;
  var rectH = 44;
  var posRes = $.extend({
    x: 0,
    y: 0
  }, pos);

  $canv.translateCanvas({
    layer: true,
    translateX: posRes.x - rectW / 2, translateY: posRes.y
  })
    .drawRect({
      layer: true,
      groups: ["maxBox"],
      fillStyle: '#0092df',
      x: 0, y: 0,
      width: rectW,
      height: rectH,
      cornerRadius: 10,
      fromCenter: false,
      mouseover: function (layer) {
        $canv.css({
          cursor: "pointer"
        })
      },
      mouseout: function (layer) {
        $canv.css({
          cursor: "auto"
        })
      },
    })
    .drawText({
      layer: true,
      groups: ["maxBox"],
      fillStyle: '#fff',
      strokeWidth: 2,
      x: rectW / 2, y: rectH / 2,
      fontSize: '14px',
      fontFamily: 'Verdana, sans-serif',
      lineHeight: 1.2,
      text: text
    });
  
  $canv.restoreCanvas({
    layer: true
  });
}

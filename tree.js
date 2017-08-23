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


var mockData = [
  {
    id: 1,
    name: "云南省公安厅",
    nodes: [
      {
        id: 2,
        name: "昆明市公安局",
        nodes: [
          {
            id: 8,
            name: "五华区公安分局"
          },
        ]
      },
      {
        id: 3,
        name: "丽江市公安局",
        nodes: [
          {
            id: 4,
            name: "古城区公安分局",
            nodes: [
              {
                id: 10,
                name: "古城区公安01",
              },
              {
                id: 11,
                name: "古城区公安02",
              },
            ]
          },
          {
            id: 5,
            name: "永胜县公安局",
            nodes: [
              {
                id: 6,
                name: "永胜县公安01",
              },
              {
                id: 7,
                name: "永胜县公安02",
              },
            ]
          }
        ],
      },
    ],
  }
];
var DATA = [];

function stepFnY(mockData, deep, parentData) {
  //每个节点宽高
  var itemW = 110;
  var itemH = 44;

  //每个节点位置差
  var disItmeY = 70;
  var disItmeX = 136;

  for (var i = 0; i < mockData.length; i++) {
    var item = mockData[i];
    var itemPos = {
      x: 0,
      y: deep * disItmeY
    };
    item.text = item.name;
    var pid = null;
    if (parentData) {
      pid = parentData.id || null;
    }

    DATA[deep] = DATA[deep] || [];
    DATA[deep].push(
      Object.assign({}, item, {
        pid: pid,
        pos: itemPos,
        parentData: parentData,
      })
    );
    if (item.nodes) {
      //parent传给child
      var P2C_Data = Object.assign({}, item, {
        pos: itemPos,
        nodes: true
      });
      stepFnY(item.nodes, (deep + 1), P2C_Data);
    }
  }
}

stepFnY(mockData, 0, null);
console.log(DATA);//纵坐标生成END

//前提条件:数组中子集先后顺序,与相应父级先后顺序一致;相同父级的子元素相互紧靠
//横坐标(只往右移)
//先遍历最下边一行
//向右移优先级: 先移子行 > 最后移父行

//向右移,需要将其右边元素全部右移,(找到需要右移的最左侧元素)
//移动从最左侧元素开始
//第一步找到这一行全部相同父级的子元素
for (var i = 0; i < DATA[DATA.length - 1].length; i++) {
  var arrT = DATA[DATA.length - 1];
  var parentDataObj = {};

  for (var i = 0; i < arrT.length; i++) {
    var pid = arrT[i].parentData.id;
    //parentDataObj.pid
  }

}

render($("#box").width(), $("#box").height());
//光标复位
$(document).off('mouseup.canv').on('mouseup.canv', function (ev) {
  if ($canv.css("cursor") === "move") {
    $canv.css({
      cursor: "auto"
    });
  }
});

function render(w, h) {
  //每个节点宽高
  var itemW = 110;
  var itemH = 44;

  //每个节点位置差
  var disItmeY = 70;
  var disItmeX = 136;


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
  for (var i = 0; i < DATA.length; i++) {
    var arr = DATA[i];
    for (var j = 0; j < arr.length; j++) {
      var item = arr[j];
      item.pos.x = j * disItmeX + itemW / 2;
      rectItem(item, $canv);
    }
  }

  // rectItem("五华区公安分局", {
  //   x: 0,
  //   y: 0,
  // }, $canv);
  //
  // rectItem("永北镇派出所", {
  //   x: 200,
  //   y: 300,
  // }, $canv);
}

function rectItem(item, $canv) {
  //传进来data
  //文字,坐标
  //坐标为 顶边中点
  var pos = item.pos;
  var text = item.text;

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
    groups: ["maxBox", "element"],
    translateX: posRes.x - rectW / 2, translateY: posRes.y
  })
    .drawRect({
      layer: true,
      groups: ["maxBox", "element"],
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
      click: function (layer) {
        //console.log(item);
      }
    })
    .drawText({
      layer: true,
      groups: ["maxBox", "element"],
      fillStyle: '#fff',
      strokeWidth: 2,
      x: rectW / 2, y: rectH / 2,
      fontSize: '14px',
      fontFamily: 'Verdana, sans-serif',
      lineHeight: 1.2,
      text: text
    });

  $canv.restoreCanvas({
    layer: true,
    groups: ["maxBox", "element"],
  });
}

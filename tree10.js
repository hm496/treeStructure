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


// var mockData = [
//   {
//     id: 1,
//     name: "云南省公安厅",
//     nodes: [
//       {
//         id: 2,
//         name: "昆明市公安局",
//         nodes: [
//           {
//             id: 8,
//             name: "五华区公安分局"
//           },
//         ]
//       },
//       {
//         id: 3,
//         name: "丽江市公安局",
//         nodes: [
//           {
//             id: 4,
//             name: "古城区公安分局",
//             nodes: [
//               {
//                 id: 10,
//                 name: "古城区公安01",
//               },
//               {
//                 id: 11,
//                 name: "古城区公安02",
//               },
//             ]
//           },
//           {
//             id: 5,
//             name: "永胜县公安局",
//             nodes: [
//               {
//                 id: 6,
//                 name: "永胜县公安01",
//               },
//               {
//                 id: 7,
//                 name: "永胜县公安02",
//               },
//             ]
//           }
//         ],
//       },
//     ],
//   }
// ];

var mockData = [
  {
    id: "0",
    name: "0",
    nodes: [
      {
        id: "01",
        name: "01",
        nodes: [
          {
            id: "011",
            name: "011",
            nodes: [
              {
                id: "0111",
                name: "0111",
                nodes: [
                  {
                    id: "01111",
                    name: "01111",
                  },
                  {
                    id: "01112",
                    name: "01112",
                  },
                ]
              }
            ]
          },
          {
            id: "012",
            name: "012",
            nodes: [
              {
                id: "0121",
                name: "0121",
              },
              // {
              //   id: "0122",
              //   name: "0122",
              // },
              // {
              //   id: "0123",
              //   name: "0123",
              // },
            ]
          }
        ],
      },
      {
        id: "02",
        name: "02",
        nodes: [
          {
            id: "021",
            name: "021",
          }
        ],
      },
      {
        id: "03",
        name: "03",
        nodes: [
          {
            id: "031",
            name: "031",
            nodes: [
              {
                id: "0311",
                name: "0311",
              },
              {
                id: "0312",
                name: "0312",
              },
            ],
          },
          {
            id: "032",
            name: "032",
            nodes: [
              {
                id: "0321",
                name: "0321",
              }
            ],
          },
        ],
      },
    ]
  }
];
var DATA = [];

//遍历所有子节点
function eachChild(parent, fn) {
  if (parent.nodes) {
    for (var i = 0; i < parent.nodes.length; i++) {
      var child = parent.nodes[i];
      fn && fn(child);
      eachChild(child, fn);
    }
  }
}
//计算中点坐标
function getMid(x1, x2) {
  if (x1 > x2) {
    var greater = x1;
    var less = x2;
  } else {
    greater = x2;
    less = x1;
  }
  return (greater - less) / 2 + less;
}
function findMid(arr) {
  var min = Math.min.apply(Math, arr);
  var max = Math.max.apply(Math, arr);
  return getMid(min, max);
}
function getFarLeft(node) {
  var item = node;
  while (item.nodes) {
    item = item.nodes[0];
  }
  return item;
}

function stepFnY(mockData, deep, parentData) {
  //每个节点宽高
  var itemW = 110;
  var itemH = 44;
  //每个节点位置差
  var marginX = 20;
  var marginY = 26;

  var disItmeX = itemW + marginX;
  var disItmeY = itemH + marginY;

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
      $.extend(item, {
        pid: pid,
        pos: itemPos,
        parentData: parentData,
      })
    );
    if (item.nodes) {
      //parent传给child (item)
      stepFnY(item.nodes, (deep + 1), item);
    }
  }
}

stepFnY(mockData, 0, null);

//每个节点宽高
var itemW = 110;
var itemH = 44;
//每个节点位置差
var marginX = 20;
var marginY = 26;

var disItmeX = itemW + marginX;
var disItmeY = itemH + marginY;

var finalIndex = DATA.length - 1;//最后一行
function dealDataLine(DATA, lineNum) {
  var lastPid = null;
  var lastParentData = null;
  var sumXArr = [];
  var sumWidth = 0;
  var lastX = 0;
  var lineIndex = lineNum;
  for (var i = 0; i < DATA[lineIndex].length; i++) {
    var tempData = DATA[lineIndex][i];
    if (lastPid !== tempData.pid) {
      if (lastPid) {
        lastParentData.pos.x = findMid(sumXArr);

        lastParentData.sumWidth = lastParentData.sumWidth || 0;
        lastParentData.sumWidth = lastParentData.sumWidth + sumWidth;
      }
      lastPid = tempData.pid;
      lastParentData = tempData.parentData;
      sumXArr = [];
      sumWidth = 0;
    }
    if (tempData.sumWidth) {
      //1,计算整体最左侧坐标(子节点最左侧)
      //2,计算距离合适位置的 差值changedX
      //最左侧
      var leftItemX = getFarLeft(tempData).pos.x;
      //合适位置
      var toPosX = lastX + itemW / 2;
      var changedX = toPosX - leftItemX;
      tempData.pos.x = tempData.pos.x + changedX;
      //调整子节点
      eachChild(tempData, function (child) {
        child.pos.x += changedX;
      });
      lastX += tempData.sumWidth;
    } else {
      tempData.pos.x = lastX + itemW / 2;
      lastX += disItmeX;
    }
    sumWidth += DATA[lineIndex][i].sumWidth || disItmeX;
    sumXArr.push(tempData.pos.x);
  }
  if (lastPid) {
    lastParentData.pos.x = findMid(sumXArr);
    lastParentData.sumWidth = lastParentData.sumWidth || 0;
    lastParentData.sumWidth = lastParentData.sumWidth + sumWidth;
  }
}

for (var i = DATA.length - 1; i > -1; i--) {
  dealDataLine(DATA, i);
}


//渲染canvas
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
  var marginX = 20;
  var marginY = 26;

  var disItmeX = itemW + marginX;
  var disItmeY = itemH + marginY;


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
      rectItem(item, $canv);
    }
  }
}

function rectItem(item, $canv) {
  //传进来data
  //文字,坐标
  //坐标为 顶边中点
  //item原始数据对象
  var pos = item.pos;
  var text = item.text;

  //绘制 文字和矩形
  //返回 {data,layer}

  //每个节点宽高
  var itemW = 110;
  var itemH = 44;
  //每个节点位置差
  var marginX = 20;
  var marginY = 26;

  var disItmeX = itemW + marginX;
  var disItmeY = itemH + marginY;

  var posRes = $.extend({
    x: 0,
    y: 0
  }, pos);

  //如果有父级,连线至父级
  // $canv.drawLine({
  //   layer: true,
  //   groups: ["maxBox", "element"],
  //   strokeStyle: '#000',
  //   strokeWidth: 2,
  //   rounded: true,
  //   startArrow: true,
  //   arrowRadius: 12,
  //   arrowAngle: 60,
  //   x1: 100, y1: 100,
  //   x2: 150, y2: 125,
  //   x3: 200, y3: 75,
  //   x4: 500, y4: 75,
  // });
  //起点:
  if (item.parentData) {
    var pData = item.parentData;
    var linePoints = {
      x1: posRes.x, y1: posRes.y - 2,
      x2: posRes.x, y2: posRes.y - marginY / 2,
      x3: pData.pos.x, y3: posRes.y - marginY / 2,
      x4: pData.pos.x, y4: pData.pos.y + itemH + 1,
    }

    var drawLineData = {
      layer: true,
      groups: ["maxBox", "element"],
      strokeStyle: '#ddd',
      strokeWidth: 2,
      rounded: true,
      startArrow: true,
      arrowRadius: 5,
      arrowAngle: 90,
    };
    $.extend(drawLineData, linePoints);
    $canv.drawLine(drawLineData);
  }


  $canv.translateCanvas({
    layer: true,
    groups: ["maxBox", "element"],
    translateX: posRes.x - itemW / 2, translateY: posRes.y
  })
    .drawRect({
      layer: true,
      groups: ["maxBox", "element"],
      fillStyle: '#0092df',
      x: 0, y: 0,
      width: itemW,
      height: itemH,
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
        console.log(item);
      }
    })
    .drawText({
      layer: true,
      groups: ["maxBox", "element"],
      fillStyle: '#fff',
      strokeWidth: 2,
      x: itemW / 2, y: itemH / 2,
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

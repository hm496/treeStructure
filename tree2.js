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
          },
          {
            id: "012",
            name: "012",
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
          },
          {
            id: "022",
            name: "022",
          },
        ],
      },
      {
        id: "03",
        name: "03",
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
      Object.assign(item, {
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
console.log(DATA);//生成纵坐标END

//前提条件:数组中子级先后顺序,与相应父级先后顺序一致;相同父级的子元素相互紧靠
//横坐标(只往右移)
//先遍历最下边一行
//向右移优先级: 先移子行 > 最后移父行

//向右移,需要将其右边元素全部右移,(找到需要右移的最左侧元素)
//移动从最左侧元素开始
//第一步找到这一行全部相同父级的子元素


//每个节点宽高
var itemW = 110;
var itemH = 44;
//每个节点位置差
var marginX = 20;
var marginY = 26;

var disItmeX = itemW + marginX;
var disItmeY = itemH + marginY;
//生成横坐标

//生成父级初始 横坐标

//找到相同父级的元素,设置父级横坐标pos.x和sumWidth
var lastPid = null;
var lastParentData = null;
var sumX = 0;
var sumWidth = 0;
var childLength = 0;//同父级子级数量

for (var i = 0; i < DATA[2].length; i++) {
  //因为是最后一行,直接i * disItmeX + itemW / 2;
  DATA[2][i].pos.x = i * disItmeX + itemW / 2;
  if (lastPid !== DATA[2][i].pid) {
    if (lastPid) {
      console.log(lastParentData, childLength, sumX);
      lastParentData.pos.x = sumX / childLength;
      lastParentData.sumWidth = lastParentData.sumWidth || 0;
      lastParentData.sumWidth = lastParentData.sumWidth + sumWidth;
    }
    sumX = 0;
    sumWidth = 0;
    childLength = 0;
    lastParentData = DATA[2][i].parentData;
    lastPid = DATA[2][i].pid;
  }
  childLength++;
  sumWidth += DATA[2][i].sumWidth || disItmeX;
  sumX += DATA[2][i].pos.x;
}

console.log(lastParentData, childLength, sumX);
if (lastPid) {
  lastParentData.pos.x = sumX / childLength;
  lastParentData.sumWidth = lastParentData.sumWidth || 0;
  lastParentData.sumWidth = lastParentData.sumWidth + sumWidth;
}

// var sumX = 0;
// for (var i = 0; i < DATA[2].length; i++) {
//   DATA[2][i].pos.x = i * disItmeX + itemW / 2;
//   sumX += DATA[2][i].pos.x;
// }
// DATA[2][0].parentData.sumWidth = DATA[2][0].parentData.sumWidth || 0;
// DATA[2][0].parentData.sumWidth = DATA[2][0].parentData.sumWidth + DATA[2].length * disItmeX;
// DATA[2][0].parentData.pos.x = sumX / DATA[2].length;
console.log(DATA[2][0].parentData);
//调整父级和子级 横坐标
var sumX = 0;
var lastX = 0;
for (var i = 0; i < DATA[1].length; i++) {
  // debugger
  var tempData = DATA[1][i];
  if (tempData.sumWidth) {
    tempData.pos.lastX = tempData.pos.x;
    tempData.pos.x = lastX + (tempData.sumWidth - marginX) / 2;
    var changedX = tempData.pos.x - tempData.pos.lastX;
    //遍历所有子节点变化changedX
    eachChild(tempData, function (child) {
      child.pos.x += changedX;
    });
    lastX += tempData.sumWidth;
  } else {
    tempData.pos.x = lastX + itemW / 2;
    lastX += disItmeX;
  }
  sumX += tempData.pos.x;
}
DATA[1][0].parentData.pos.x = sumX / DATA[1].length;
// console.log(DATA[1][0].parentData);


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
      // item.pos.x = j * disItmeX + itemW / 2;
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
  //item原始数据对象
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
        // console.log(item);
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

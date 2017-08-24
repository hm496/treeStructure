function treeStructure($canv, options, data) {
  var options = options || {};

  //每个节点宽高设置,间距设置-------------
  //每个节点宽高
  var itemW = options.itemW || 110;
  var itemH = options.itemH || 44;
  //每个节点位置差
  var marginX = options.marginX || 20;
  var marginY = options.marginY || 26;
  //相邻节点坐标间距
  var disItmeX = itemW + marginX;
  var disItmeY = itemH + marginY;
  //每个节点宽高设置,间距设置-------------END

  //原始数据
  var mockData = data || [];

  var NODES = options.nodesName || "nodes";
  var ID = options.idName || "id";
  var TEXT = options.textName || "name";

  var $canv = $("#treecanvas");
  var canv = $canv[0];
  var $canvParentDom = $canv.parent();

  var winW = $canvParentDom.width();
  var winH = $canvParentDom.height();
  canv.width = winW;
  canv.height = winH;

  canv.width = $canvParentDom.width();
  canv.height = $canvParentDom.height();

  window.addEventListener('resize', function (ev) {
    setTimeout(function () {
      winW = $canvParentDom.width();
      winH = $canvParentDom.height();
      canv.width = winW;
      canv.height = winH;
      $canv.drawLayers();
    }, 150);
  });

  var DATA = [];

//工具函数----START
  //遍历所有子节点
  function eachChild(parent, fn) {
    if (parent[NODES]) {
      for (var i = 0; i < parent[NODES].length; i++) {
        var child = parent[NODES][i];
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

//找到数组中点
  function findMid(arr) {
    var min = Math.min.apply(Math, arr);
    var max = Math.max.apply(Math, arr);
    return getMid(min, max);
  }

//找到最左侧节点
  function getFarLeft(node) {
    var item = node;
    while (item[NODES]) {
      item = item[NODES][0];
    }
    return item;
  }

//工具函数----END


//遍历所有节点,分行,生成纵坐标y
  stepFnY(mockData, 0, null);
  function stepFnY(mockData, deep, parentData) {


    for (var i = 0; i < mockData.length; i++) {
      var item = mockData[i];
      var itemPos = {
        x: 0,
        y: deep * disItmeY
      };
      if (item[TEXT] === undefined || item[TEXT] === null) {
        item[TEXT] = "";
      }
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
      if (item[NODES]) {
        //parent传给child (item)
        stepFnY(item[NODES], (deep + 1), item);
      }
    }
  }


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
  render($canvParentDom.width(), $canvParentDom.height());

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
    var text = item[TEXT];

    //绘制 文字和矩形
    //返回 {data,layer}

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
        x1: posRes.x, y1: posRes.y - 3,
        x2: posRes.x, y2: posRes.y - marginY / 2,
        x3: pData.pos.x, y3: posRes.y - marginY / 2,
        x4: pData.pos.x, y4: pData.pos.y + itemH,
      }
      //绘制连线
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
      });

    $canv.translateCanvas({
      layer: true,
      groups: ["maxBox", "element"],
      translateX: itemW / 2, translateY: itemH / 2
    })
    $canv.drawText({
      layer: true,
      groups: ["maxBox", "element"],
      fillStyle: '#fff',
      strokeWidth: 2,
      x: 0, y: 0,
      fontSize: '14px',
      fontFamily: 'Verdana, sans-serif',
      lineHeight: 1.2,
      text: text
    });
    $canv.restoreCanvas({
      layer: true,
      groups: ["maxBox", "element"],
    });

    $canv.restoreCanvas({
      layer: true,
      groups: ["maxBox", "element"],
    });
  }


}

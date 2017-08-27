;(function() {
  function StructureCanv(options) {
    var op = options || {};
    this.initOptions(op);
    this.initCanvas();
    this.computePosition();
    this.render();
  }

  StructureCanv.prototype = {
    constructor: StructureCanv,
    initOptions: function(op) {
      this.op = {
        idName: 'id',
        nodesName: 'nodes',
        textName: 'text',
        itemW: 110,
        itemH: 44,
        marginX: 16,
        marginY: 26,
        data: null,
        $canv: null,
      }
      $.extend(this.op, op);
      this.op.disItmeX = this.op.itemW + this.op.marginX;
      this.op.disItmeY = this.op.itemH + this.op.marginY;
    },
    initCanvas: function() {
      if (this.op.$canv && this.op.$canv.length > 0) {
        this.$canv = this.op.$canv;
        this.canv = this.op.$canv[0];
        this.ctx = this.canv.getContext("2d");
        this.$canvParentDom = this.$canv.parent();
      } else {
        throw "Error: where is options.$canv ?";
      }

      this.initCursor();
      this.canv.width = this.$canvParentDom.width();
      this.canv.height = this.$canvParentDom.height();
    },
    initCursor: function() {
      var _this = this;
      //光标图标复位
      $(document).off('mouseup.canv').on('mouseup.canv', function(ev) {
        if (_this.$canv.css("cursor") === "move") {
          _this.$canv.css({
            cursor: "auto"
          });
        }
      });
    },
    computePosition: function() {
      this.DATA = null;
      if (this.op.data) {
        this.DATA = [];
        this.dealDataY(this.op.data, 0, null);
        this.dealDataX();
      } else {
        throw "Error: where is options.data ?";
      }
    },
    dealDataY: function(originData, deep, parentData) {
      var disItmeY = this.op.disItmeY;
      var TEXT = this.op.textName;
      var NODES = this.op.nodesName;
      for (var i = 0; i < originData.length; i++) {
        var item = originData[i];
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

        this.DATA[deep] = this.DATA[deep] || [];

        $.extend(item, {
          row: deep,
          col: this.DATA[deep].length,
          pid: pid,
          pos: itemPos,
          parentData: parentData,
        })

        if (!isHedden(item)) {
          this.DATA[deep].push(item);
          if (item[NODES]) {
            //parent传给child (item)
            this.dealDataY(item[NODES], (deep + 1), item);
          }
        }
      }
    },
    dealDataX: function() {
      //从最后一行计算
      dealDataLineX = dealDataLineX.bind(this);
      for (var i = this.DATA.length - 1; i > -1; i--) {
        dealDataLineX(this.DATA, i);
      }

      function dealDataLineX(DATA, lineNum) {
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

            //合适位置
            var changedX = this.findMinChangeX(tempData);

            if (changedX !== 0) {
              tempData.pos.x = tempData.pos.x + changedX;
              //调整子节点
              this.eachChild(tempData, function(child) {
                child.pos.x += changedX;
              });
            }
            if (tempData.pos.x < this.op.itemW / 2) {
              tempData.pos.x = this.op.itemW / 2;
            }

            // lastX += tempData.sumWidth;
          } else {
            tempData.pos.x = lastX + this.op.itemW / 2;
            // lastX += disItmeX;
          }
          lastX = tempData.pos.x + this.op.itemW / 2 + this.op.marginX;
          sumWidth += DATA[lineIndex][i].sumWidth || this.op.disItmeX;
          sumXArr.push(tempData.pos.x);
        }
        if (lastPid) {
          lastParentData.pos.x = findMid(sumXArr);
          lastParentData.sumWidth = lastParentData.sumWidth || 0;
          lastParentData.sumWidth = lastParentData.sumWidth + sumWidth;
        }
      }
    },
    render: function() {
      //渲染this.DATA
      var $canv = this.op.$canv;
      var w = this.canv.width;
      var h = this.canv.height;

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
        dragstart: function(layer) {
          $canv.css({
            cursor: "move"
          });
        },
        drag: function(layer) {
        },
        dragstop: function(layer) {
          $canv.setLayer(layer, {
            x: -2 * w, y: -2 * h,
          })
            .drawLayers();
        }
      });

      //绘制 文字和矩形
      this.renderItem();
      this.$canv.drawLayers();
    },
    //渲染节点
    renderItem: function() {
      for (var i = 0; i < this.DATA.length; i++) {
        var arr = this.DATA[i];
        for (var j = 0; j < arr.length; j++) {
          var item = arr[j];
          this.rectItem(item);
        }
      }
    },
    rectItem: function(item) {
      var _this = this;

      var $canv = this.op.$canv;
      var TEXT = this.op.textName;
      //传进来数据
      //文字,坐标
      //坐标为 顶边中点
      //item原始数据对象
      var pos = item.pos;
      var text = item[TEXT];

      //换行
      text = this.textWarp(text, this.op.itemW - 10);

      //绘制 文字和矩形
      var posRes = $.extend({
        x: 0,
        y: 0
      }, pos);

      var itemPos = {
        x: posRes.x,
        y: posRes.y,
      }

      //如果有父级,连线至父级
      if (item.parentData) {
        var pData = item.parentData;

        var itemParPos = {
          x: pData.pos.x,
          y: pData.pos.y,
        }

        var linePoints = {
          x1: itemPos.x, y1: itemPos.y - 3,
          x2: itemPos.x, y2: itemPos.y - this.op.marginY / 2,
          x3: itemParPos.x, y3: itemPos.y - this.op.marginY / 2,
          x4: itemParPos.x, y4: itemParPos.y + this.op.itemH,
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
        translateX: itemPos.x - this.op.itemW / 2, translateY: itemPos.y
      })
        .drawRect({
          layer: true,
          groups: ["maxBox", "element"],
          fillStyle: '#0092df',
          x: 0, y: 0,
          width: this.op.itemW,
          height: this.op.itemH,
          cornerRadius: 10,
          fromCenter: false,
          mouseover: function(layer) {
            $canv.css({
              cursor: "pointer"
            })
          },
          mouseout: function(layer) {
            $canv.css({
              cursor: "auto"
            })
          },
          click: function(layer) {
            var NODES = _this.op.nodesName;
            var oldPos = {
              x: item.pos.x + layer.x,
              y: item.pos.y + layer.y
            }

            if (item[NODES] && item[NODES].length > 0) {
              item.hiddenNodes = !item.hiddenNodes;
              _this.refresh(oldPos, item);
            }
          }
        });

      $canv.translateCanvas({
        layer: true,
        groups: ["maxBox", "element"],
        translateX: this.op.itemW / 2, translateY: this.op.itemH / 2
      })
      $canv.drawText({
        layer: true,
        groups: ["maxBox", "element"],
        fillStyle: '#fff',
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

    },
    //textWarp
    textWarp: function(text, maxWidth) {
      var temp = "";
      var lastTemp = "";
      var row = [];

      this.ctx.font = "14px Verdana, sans-serif";

      for (var i = 0; i < text.length; i++) {
        lastTemp = temp;
        temp += text[i];
        if (this.ctx.measureText(temp).width > maxWidth) {
          row.push(lastTemp);
          temp = text[i];
        }
      }
      row.push(temp);

      var res = row.join("\n");
      return res;
    },
    //清空
    clearItem: function() {
      this.$canv.removeLayerGroup('element');
    }

    ,
    //刷新
    refresh: function(oldPos, item) {
      this.computePosition();
      this.clearItem();
      this.renderItem();
      if (oldPos && item) {
        var changeXY = {
          x: oldPos.x - item.pos.x,
          y: oldPos.y - item.pos.y,
        };
        this.$canv.setLayerGroup('element', {
          x: "+=" + changeXY.x,
          y: "+=" + changeXY.y,
        });
      }
      this.$canv.drawLayers();
    }
    ,
    //工具函数--------
    findMinChangeX: function(item) {
      var NODES = this.op.nodesName;

      var MinPosXArr = [];
      MinPosXArr.push(this.calcX(item));
      while (item[NODES] && item[NODES].length > 0 && !item.hiddenNodes) {
        item = item[NODES][0];
        MinPosXArr.push(this.calcX(item));
      }
      return Math.max.apply(Math, MinPosXArr);

    }
    ,
    calcX: function(item) {
      var toPosX = 0;//pos.x要去的位置
      if (item.col === 0) {
        return 0;
      } else {
        toPosX = this.DATA[item.row][item.col - 1].pos.x + this.op.disItmeX;
      }
      return thisChangeX = toPosX - item.pos.x;
    }
    ,
    eachChild: function(parent, fn) {
      var NODES = this.op.nodesName;

      if (parent[NODES] && !parent.hiddenNodes) {
        for (var i = 0; i < parent[NODES].length; i++) {
          var child = parent[NODES][i];
          fn && fn(child);
          this.eachChild(child, fn);
        }
      }
    }
    //工具函数--------END


  };


//工具函数--------
  function isHedden(node) {
    var isHedden = false;
    var item = node;
    while (item.parentData) {
      item = item.parentData;
      if (item.hiddenNodes === true) {
        isHedden = true;
        break;
      }
    }
    return isHedden;
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

//找到坐标数组中,边界中点
  function findMid(arr) {
    var min = Math.min.apply(Math, arr);
    var max = Math.max.apply(Math, arr);
    return getMid(min, max);
  }

//工具函数--------END


//全局
  window.StructureCanv = StructureCanv;
})
();

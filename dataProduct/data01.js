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
// console.log(DATA);//纵坐标生成END

//前提条件:数组中子集先后顺序,与相应父级先后顺序一致;相同父级的子元素相互紧靠
//横坐标(只往右移)
//先遍历最下边一行
//向右移优先级: 先移子行 > 最后移父行

//向右移,需要将其右边元素全部右移,(找到需要右移的最左侧元素)
//移动从最左侧元素开始
//第一步找到这一行全部相同父级的子元素
for (var i = 0; i < DATA[DATA.length - 1].length; i++) {
  var childArr = DATA[DATA.length - 1];

  var pidArr = [];
  for (var i = 0; i < childArr.length; i++) {
    var pid = childArr[i].parentData.id;
    if (pidArr.length > 0) {
      var lastPid = pidArr[pidArr.length - 1];
      if (lastPid === pid) {
        continue;
      }
    }
    pidArr.push(childArr[i].parentData.id);
  }

  for (var i = 0; i < pidArr.length; i++) {
    //取出一个pid
    var pid = pidArr[i];
    for (var i = 0; i < childArr.length; i++) {
      childArr[i];


    }

  }

}

console.log(pidArr);
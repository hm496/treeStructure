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
          },
          {
            id: 5,
            name: "永胜县公安局",
            nodes: [
              {
                id: 6,
                name: "永北镇派出所",
              },
              {
                id: 7,
                name: "三川镇派出所",
              },
            ]
          }
        ],
      },
    ],
  },
  {
    id: 9,
    name: "云南省听听听"
  }
];

//盒子总宽度
var boxW = 800;
//每个节点宽高
var itemW = 110;
var itemH = 44;

//每个节点高度差
var disItmeY = 142;


var DATA = [];
var deep = 0;
//第一次只生成纵坐标y
// for (var i = 0; i < mockData.length; i++) {
//   var item = mockData[i];
//   DATA[deep] = DATA[deep] || [];
//   DATA[deep].push({
//     id: item.id,
//     text: item.name,
//     parentPos: null,
//     pos: {
//       x: 0,
//       y: deep * disItmeY
//     }
//   });
//   if (item.nodes) {
//     //深度加1
//     var adeep = (deep + 1);
//     for (var i = 0; i < mockData.length; i++) {
//       var item = mockData[i];
//       DATA[adeep] = DATA[adeep] || [];
//       DATA[adeep].push({
//         id: item.id,
//         text: item.name,
//         parentPos: null,
//         pos: {
//           x: 0,
//           y: adeep * disItmeY
//         }
//       });
//     }
//   }
// }

function stepFnY(mockData, deep, parentData) {
  //每个节点宽高
  var itemW = 110;
  var itemH = 44;

  //每个节点位置差
  var disItmeY = 142;
  var disItmeX = 136;

  for (var i = 0; i < mockData.length; i++) {
    var item = mockData[i];
    var itemPos = {
      x: i * disItmeX + itemW / 2,
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
        nodes: null
      });
      stepFnY(item.nodes, (deep + 1), P2C_Data);
    }
  }
}

stepFnY(mockData, 0, null);

console.log(DATA);


//希望生成数组
/*
 每一行是一个数组

 //整体结构
 [
 []
 ,
 []
 ,
 []
 ]
 //具体包含
 id,父级坐标,自己坐标,文字
 {


 }
 */

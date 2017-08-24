var mockData = [
  {
    id: 1,
    text: "云南省公安厅",
    nodes: [
      {
        id: 2,
        text: "昆明市公安局",
        nodes: [
          {
            id: 8,
            text: "五华区公安分局"
          },
        ]
      },
      {
        id: 3,
        text: "丽江市公安局",
        nodes: [
          {
            id: 4,
            text: "古城区公安分局",
            nodes: [
              {
                id: 10,
                text: "古城区公安01",
              },
              {
                id: 11,
                text: "古城区公安02",
              },
            ]
          },
          {
            id: 5,
            text: "永胜县公安局",
            nodes: [
              {
                id: 6,
                text: "永胜县公安01",
              },
              {
                id: 7,
                text: "永胜县公安02",
              },
            ]
          }
        ],
      },
    ],
  }
];

treeStructure($("#treecanvas"), {
  idName: 'id',
  nodesName: 'nodes',
  textName: 'text',
}, mockData);
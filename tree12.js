var mockData = [
  {
    id: "0",
    text: "云南省公安厅",
    nodes: [
      {
        id: "01",
        text: "昆明市公安局",
        nodes: [
          {
            id: "011",
            text: "五华区公安分局"
          },
        ]
      },
      {
        id: "02",
        text: "丽江市公安局",
        nodes: [
          {
            id: "021",
            text: "古城区公安分局",
            nodes: [
              {
                id: "0211",
                text: "古城区公安01",
              },
              {
                id: "0212",
                text: "古城区公安02",
              }
            ]
          },
          {
            id: "022",
            text: "永胜县公安局",
            hiddenNodes: true,
            nodes: [
              {
                id: "0221",
                text: "永胜县公安01",
              },
              {
                id: "0222",
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
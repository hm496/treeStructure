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
            hiddenNodes: true,
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
var mockData2 = [
  {
    id: "0",
    text: "0",
    nodes: [
      {
        id: "01",
        text: "01",
        nodes: [
          {
            id: "011",
            text: "011",
            nodes: [
              {
                id: "0111",
                text: "0111",
                nodes: [
                  {
                    id: "01111",
                    text: "01111",
                  },
                  {
                    id: "01112",
                    text: "01112",
                  },
                ]
              }
            ]
          },
          {
            id: "012",
            text: "012",
            nodes: [
              {
                id: "0121",
                text: "0121",
              },
              {
                id: "0122",
                text: "0122",
              },
              {
                id: "0123",
                text: "0123",
              },
            ]
          }
        ],
      },
      {
        id: "02",
        text: "02",
        nodes: [
          {
            id: "021",
            text: "021",
          }
        ],
      },
      {
        id: "03",
        text: "03",
        nodes: [
          {
            id: "031",
            text: "031",
            nodes: [
              {
                id: "0311",
                text: "0311",
              },
              {
                id: "0312",
                text: "0312",
              },
            ],
          },
          {
            id: "032",
            text: "032",
            nodes: [
              {
                id: "0321",
                text: "0321",
              }
            ],
          },
        ],
      },
    ]
  }
];
treeStructure($("#treecanvas"), {
  idName: 'id',
  nodesName: 'nodes',
  textName: 'text',
  itemW: 110,
  itemH: 44,
  marginX: 16,
  marginY: 26,
}, mockData);
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

treeStructure($("#treecanvas"), null, mockData);
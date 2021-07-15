/**
 * 测试数据 create by dongmm 2021/01/26
 */
const treeDataOne = [{
    title: '待完成',
    key: '0-0',
    count: 1000,
    status: "1",
    slots: {
      icon: 'smile',
    },
    children: [{
        title: '工种清单未完成',
        key: '0-0-0',
        count: 100,
        status: "1",
      },
      {
        title: '合同扫描件缺失',
        key: '0-0-1',
        count: 200,
        status: "1",
      },
      {
        title: '项目计划进行中',
        key: '0-0-2',
        count: 700,
        status: "1",
      }
    ]
  },
  {
    title: '已完成',
    key: '0-1',
    count: 1000,
    status: "1",
  },
  {
    title: '全部',
    key: '0-2',
    count: 2000,
    status: "1",
  }
]

const treeDataTwo = [{
    title: '待完成',
    key: '1-0',
    count: 1000,
    status: "0",
    children: [{
        title: '未报名登记',
        key: '1-0-0',
        count: 300,
        status: "0",
      },
      {
        title: '报名资料缺失',
        key: '1-0-1',
        count: 700,
        status: "1",
      }
    ]
  },
  {
    title: '已完成',
    key: '1-1',
    count: 1000,
    status: "1",
  },
  {
    title: '全部',
    key: '1-2',
    count: 2000,
    status: "0",
  }
]

const treeDataThree = [{
    title: '待完成',
    key: '3-0',
    count: 1000,
    status: "0",
    children: [{
        title: '学习计划待制定',
        key: '3-0-0',
        count: 300,
        status: "1",
      },
      {
        title: '学习进行中',
        key: '3-0-1',
        count: 500,
        status: "1",
      },
      {
        title: '待完成报名',
        key: '3-0-2',
        count: 200,
        status: "0",
      }
    ]
  },
  {
    title: '已完成',
    key: '3-1',
    count: 1000,
    status: "1",
  },
  {
    title: '全部',
    key: '3-2',
    count: 2000,
    status: "0",
  }
]

const treeDataFour = [{
    title: '待完成',
    key: '4-0',
    count: 1000,
    status: "0",
    children: [{
        title: '待安排考试',
        key: '4-0-0',
        count: 300,
        status: "1",
      },
      {
        title: '考试未通过',
        key: '4-0-1',
        count: 500,
        status: "1",
      },
      {
        title: '待完成学习',
        key: '4-0-2',
        count: 200,
        status: "0",
      }
    ]
  },
  {
    title: '已完成',
    key: '4-1',
    count: 1000,
    status: "1",
  },
  {
    title: '全部',
    key: '4-2',
    count: 2000,
    status: "0",
  }
]

const treeDataFive = [{
    title: '待完成',
    key: '5-0',
    count: 1000,
    status: "0",
    children: [{
        title: '尾款未结清',
        key: '5-0-0',
        count: 300,
        status: "1",
      },
      {
        title: '尾款已结清未发',
        key: '5-0-1',
        count: 500,
        status: "1",
      },
      {
        title: '待完成考试',
        key: '5-0-2',
        count: 500,
        status: "0",
      }
    ]
  },
  {
    title: '已完成',
    key: '5-1',
    count: 1000,
    status: "1",
  },
  {
    title: '全部',
    key: '5-2',
    count: 2000,
    status: "0",
  }
]

export default {
  treeDataOne,
  treeDataTwo,
  treeDataThree,
  treeDataFour,
  treeDataFive
}
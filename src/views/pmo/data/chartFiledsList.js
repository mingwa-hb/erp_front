/**
 * 折线图的fields的配置列表 create by dongmm 2021/01/26
 */
import _ from 'lodash'

const TYPE_TEXT = [{
    id: 1,
    text: "完成计划",
  },
  {
    id: 2,
    text: "完成计划",
  },
  {
    id: 3,
    text: "实际完成",
  },
  {
    id: 4,
    text: "实际完成",
  },
  {
    id: 5,
    text: "剩余计划",
  },
  {
    id: 6,
    text: "剩余计划",
  },
  {
    id: 7,
    text: "累计剩余",
  },
  {
    id: 8,
    text: "累计剩余",
  },
  {
    id: 9,
    text: "合同",
  },
  {
    id: 10,
    text: "合同",
  },
  {
    id: 11,
    text: "计划",
  },
  {
    id: 12,
    text: "计划",
  }
];

const FIEDLDS_TEXT_LIST = [{
    id: 1,
    code: "contractStuNum",
    text: "签订"
  },
  {
    id: 2,
    code: "applyNum",
    text: "报名"
  },
  {
    id: 3,
    code: "learningNum",
    text: "学习"
  },
  {
    id: 4,
    code: "examNum",
    text: "考试"
  },
  {
    id: 5,
    code: "certificateNum",
    text: "发放"
  }
];

const FIEDLDS_TEXT_LIST_TWO = [{
    id: 1,
    code: "createCount",
    text: "签订"
  },
  {
    id: 2,
    code: "finishCount",
    text: "完成"
  },
  {
    id: 3,
    code: "noFinishCount",
    text: "未完成"
  }
];

/**
 * 获取数据统计分析折线图fields
 * @param {Number} type 
 */
const getChartFields = (type) => {
  if (!type) {
    return false
  }
  let FieldTextList = (type == 9 || type == 10) ? FIEDLDS_TEXT_LIST_TWO : FIEDLDS_TEXT_LIST;
  let res = _.map(FieldTextList, 'code')
  return res;
};

/**
 * 获取数据统计分析折线图的fields-alias
 * @param {Number} type 
 */
const getFieldsChartAliases = (type) => {
  if (!type) {
    return false
  }
  let targetV = _.find(TYPE_TEXT, ['id', type]);
  let res = [];
  let FieldTextList = (type == 9 || type == 10) ? FIEDLDS_TEXT_LIST_TWO : FIEDLDS_TEXT_LIST;
  _.forEach(FieldTextList, (val) => {
    res.push({
      field: val.code,
      alias: `${targetV['text']}${val.text}证次`
    })
  })
  return res
}

export default {
  getChartFields,
  getFieldsChartAliases
}
/**
 * 测试数据 create by dongmm 2021/01/26
 */
import tikuList from "./test_data"

/**
 * 构造type list数据
 * @param {Array} arr 
 * @returns 
 */
const generateTypeList = (arr) => {
  let res = [];
  if (Array.isArray(arr) || arr instanceof Array) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
      res.push({
        id: i,
        value: `${i}`,
        label: arr[i],
        code: i
      })
    }
  }
  return res
}

const testPaperStatusTypeArr = ["全部", "草稿/试题篮中", "未发布", "已发布", "审核通过", "审核不通过"];
const TESTPAPER_STATUS_TYPE_LIST = generateTypeList(testPaperStatusTypeArr);

const testPaperScopeTypeArr = ["全部", "6个月", "12个月", "24个月", "无（不剔除）"];
const TESTPAPER_SCOPE_TYPE_LIST = generateTypeList(testPaperScopeTypeArr);

const testPaperTypeArr = ["全部", "正式试卷", "模拟试卷", "在线试卷"];
const TESTPAPER_TYPE_LIST = generateTypeList(testPaperTypeArr);

const TESTPAPER_FLAG_TYPE_LIST = [{
    id: 1,
    value: "1",
    label: "装订线",
    code: "bindLine"
  },
  {
    id: 2,
    value: "2",
    label: "主标题",
    code: "mainTitle"
  },
  {
    id: 3,
    value: "3",
    label: "副标题",
    code: "secondTitle"
  },
  {
    id: 4,
    value: "4",
    label: "考生信息栏",
    code: "stuInfo"
  },
  {
    id: 5,
    value: "5",
    label: "总评分",
    code: "totalScore"
  },
  {
    id: 6,
    value: "6",
    label: "注意事项",
    code: "noteAttention"
  },
  {
    id: 7,
    value: "7",
    label: "大题评分区",
    code: "groupScoreArea"
  }
];

export default {
  ...tikuList,
  TESTPAPER_STATUS_TYPE_LIST,
  TESTPAPER_SCOPE_TYPE_LIST,
  TESTPAPER_TYPE_LIST,
  TESTPAPER_FLAG_TYPE_LIST
}
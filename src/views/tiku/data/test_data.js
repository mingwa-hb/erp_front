/**
 * 测试数据 create by dongmm 2021/01/26
 */

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

/**
 * 获取字母表数组
 * @returns 
 */
const getAllCharsList = () => {
  const startChar = 65;
  const allChars = [];
  for (let i = 0; i < 26; i++) {
    allChars.push(String.fromCharCode(startChar + i));
  }
  return allChars;
}

/**
 * 项目类型-字典列表
 */
const projectTypeArr = ["全部", "职业技能提升", "创业培训", "新学徒"];
const PROJECT_TYPE_LIST = generateTypeList(projectTypeArr);

/**
 * 工种类型-字典列表
 */
const workeTypeArr = ["电工", "钳工", "保安员", "营销员", "心理咨询师", "安全评价师", "企业人力资源管理师", "劳动关系协调员", "客户服务管理师", "理财规划师", "电子商务师", "营业员", "物业管理师", "商务策划师", "计算机及外部设备装配调试员"];
const WORK_TYPE_LIST = generateTypeList(workeTypeArr);


/**
 * 工种等级类型-字典列表
 */
const difficultyTypeArr = ["全部", "简单", "中等", "困难"];
const DIFFICULTY_TYPE_LIST = generateTypeList(difficultyTypeArr);

/**
 * 试题类型-字典列表
 */
const questionTypeArr = ["全部", "单选题", "多选题", "判断题", "填空题", "简答题", "鉴别题", "论述题"];
const QUESTION_TYPE_LIST = generateTypeList(questionTypeArr);

/**
 * 字母表列表-字典列表
 */
const questionOptsArr = getAllCharsList();
const CHARS_TYPE_LIST = generateTypeList(questionOptsArr);

export default {
  PROJECT_TYPE_LIST,
  WORK_TYPE_LIST,
  DIFFICULTY_TYPE_LIST,
  QUESTION_TYPE_LIST,
  CHARS_TYPE_LIST
}

//新增习题的测试数据
// let data = {
//   form: {
//     exerciseId: undefined,
//     projectType: '1', //项目类型 
//     workName: '汪泽欣测试工种啊', //工种类型
//     workTypeId: '1381771614631829505', //工种等级
//     exerciseName: '辅导费士大夫111', //试卷名称
//     exerciseScope: 4, //试题剔除选择范围
//     totalNum: '1' //习题数量
//   },
//   queryParams: {
//     questionTypeList: [{
//       key: 1,
//       hardLevel: '0',
//       hardLevelStr: '全部',
//       questionType: '1',
//       questionTypeStr: '单选题',
//       num: 1,
//       totalCount: 1,
//       relPaperList: [{
//         paperId: '1387968619723743233',
//         paperName: `xgbWzx`,
//         hardLevel: '1',
//         hardLevelStr: '简单',
//         num: 1,
//         maxNum: 1
//       }]
//     }]
//   },
// }
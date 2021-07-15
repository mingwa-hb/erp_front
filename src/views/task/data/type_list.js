/**
 * 测试数据 create by dongmm 2021/05/19
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

const taskTempStatusTypeArr = ["全部", "可用", "不可用"];
const TASKTEMP_STATUS_TYPE_LIST = generateTypeList(taskTempStatusTypeArr);

const taskStatusTypeArr = ["全部", "待办", "已办"];
const TASK_STATUS_TYPE_LIST = generateTypeList(taskStatusTypeArr);

export default {
  TASKTEMP_STATUS_TYPE_LIST,
  TASK_STATUS_TYPE_LIST
}
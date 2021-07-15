import {
  getAction,
  postAction,
  deleteAction
} from '@/api/manage'

/**
 * 获取试卷列表数据
 * @param {Object} params
 * @returns
 */
const getTpListData = (params) => getAction("/mw-exam/erp/exam/paper/list", params);
/**
 * 新增考试计划
 * @param {Object} params
 * @returns
 */
const addTestPlan = (params) => postAction("/mw-exam/erp/exam/schedule/add", params);



/**
 * 编辑考试详情
 * @param {Object} params
 * @returns
 */
const editTestPlan = (params) => postAction("/mw-exam/erp/exam/schedule/edit", params);

/**
 * 编辑考试安排详情
 * @param {Object} params
 * @returns
 */
const editTestDetail = (params) => postAction("/mw-exam/erp/exam/scheduleDetail/edit", params);

export default {
  editTestPlan,
  addTestPlan,
  editTestDetail
}
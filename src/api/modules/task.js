/**
 *  获取任务管理相关接口:
 *  ====Tp---→Task 待办任务
 *  By DongMM
 *  Create at 2021/05/25
 */

import {
  getAction,
  postAction,
  postFormAction,
  deleteAction
} from '@/api/manage'

/**
 * 根据数据字典code获取数据字典
 * @param {Object} params
 * @returns
 */
const getTaskTypeListByCode = (params) => getAction("/sys/api/getSysDictByCodes", params);

/**
 * 获取任务模版列表数据
 * @param {Object} params
 * @returns
 */
const getTaskTempListData = (params) => getAction("/erp/taskSettings/getTaskList", params);

/**
 * 获取任务模块对应的字段列表
 * @param {Object} params
 * @returns
 */
const getKeywordsByTableName = (params) => getAction("/erp/taskSettings/getKeywordsByTableName", params);

/**
 * 新增任务模版
 * @param {Object} params
 * @returns
 */
const addTaskTemp = (params) => postAction("/erp/taskSettings/add", params);

/**
 * 编辑任务模版
 * @param {Object} params
 * @returns
 */
const editTaskTemp = (params) => postAction("/erp/taskSettings/edit", params);


/**
 * 获取待办任务列表数据
 * @param {Object} params
 * @returns
 */
const getTaskListData = (params) => getAction("/erp/task/getTaskList", params);

/**
 * 新增待办任务
 * @param {Object} params
 * @returns
 */
const addTask = (params) => postAction("/erp/task/add", params);

/**
 * 审核待办任务
 * @param {Object} params
 * @returns
 */
const auditTask = (params) => postAction("/erp/task/auditTask", params);

export default {
  getTaskTypeListByCode,
  getTaskTempListData,
  getKeywordsByTableName,
  addTaskTemp,
  editTaskTemp,
  getTaskListData,
  addTask,
  auditTask
}
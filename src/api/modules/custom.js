/**
 *  获取客户关系管理相关接口:
 *  ====Custom---→ 客户
 *  By DongMM
 *  Create at 2021/07/07
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
const getCodeTypeListByCode = (params) => getAction("/sys/api/getSysDictByCodes", params);

/**
 * 获取工单管理列表数据
 * @param {Object} params
 * @returns
 */
const getWorkSheetListData = (params) => getAction("/erp/workOrder/pageList", params);


/**
 * 新增工单
 * @param {Object} params
 * @returns
 */
const addWorkSheet = (params) => postAction("/erp/workOrder/add", params);

/**
 * 编辑工单
 * @param {Object} params
 * @returns
 */
const editWorkSheet = (params) => postAction("/erp/workOrder/edit", params);

/**
 * 删除工单
 * @param {Object} params
 * @returns
 */
const deleteWorkSheet = (params) => deleteAction("/erp/workOrder/delete", params);

export default {
  getCodeTypeListByCode,
  getWorkSheetListData,
  addWorkSheet,
  editWorkSheet,
  deleteWorkSheet
}
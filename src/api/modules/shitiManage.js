/**
 *  获取题库管理-试题管理的相关接口:
 *  ====Tq---→Test Question   试题
 *  By DongMM 
 *  Create at 2021/03/25
 */

import {
  getAction,
  postAction
} from '@/api/manage'

import knowledageManage from './knowledageManage'
import paper from './paper'
import exercises from './exercises'

/**
 * 根据数据字典code获取数据字典
 * @param {Object} params 
 * @returns 
 */
const getDictItemsByCode = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/getSysDictByCodes", params);

/**
 * 根据工种名称获取所有的工种级别   
 * @param {Object} params
 */
const getWorkLevelByWorkType = (params) => getAction("/erp/stuWorkType/getWorkLevelByWorkType", params);

/**
 * 获取工种名称的第一个工种
 */
const getFirstWorkTypeName = () => getAction("/erp/stuWorkType/getFirstWorkTypeName");

/**
 * 全文搜索
 * @param {Object} params 
 * @returns 
 */
const getListSearchAll = (params) => getAction("/mw-exam/erp/exam/common/searchAll", params);

/**
 * 获取工种列表
 * @returns
 */
const getWorkTypeList = () => getAction("/mw-exam/erp/exam/common/workTypeList");

/**
 * 试题管理-试题-分页列表查询
 * @param {Object} params
 */
const getTqList = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/list", params);

/**
 * 试题-编辑-判断是否可以编辑
 * @param {Object} params
 */
const isOrNotEditById = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/isOrNotEdit", params);

/**
 * 试题-编辑-解除试题被编辑状态，允许被编辑
 * @param {*} params
 */
const dismissEditById = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/isEdit", params);

/**
 * 试题-添加
 * @param {Object} params 
 * @returns 
 */
const addTq = (params) => postAction("/mw-exam/erp/exam/mwExamQuestion/add", params);

/**
 * 试题-编辑
 * @param {Object} params 
 * @returns 
 */
const editTq = (params) => postAction("/mw-exam/erp/exam/mwExamQuestion/edit", params);

/**
 * 试题-通过id删除
 * @param {id} params 
 * @returns 
 */
const deleteTqById = (id) => postAction("/mw-exam/erp/exam/mwExamQuestion/delete?id=" + id);

/**
 * 导入Doc前预览 
 * @param {wordTypeId} params 
 * @returns 
 */
const previeTqimportDoc = (params) => postAction("/mw-exam/erp/exam/mwExamQuestion/transDoc2Json", params);

/**
 * 导入Doc数据入库
 * @param {*} params 
 * @returns 
 */
const importTqByDoc = () => postAction("/mw-exam/erp/exam/mwExamQuestion/importDoc");

/**
 * 导入Excel数据入库
 * @param {*} params 
 * @returns 
 */
const importTqByExcel = () => postAction("/mw-exam/erp/exam/mwExamQuestion/importExcel");

/**
 * 导出Excel
 * @param {Object} params 
 * @returns 
 */
const exportTqByExcel = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/exportXls", params);

/**
 * 导出doc
 * @param {Object} params 
 * @returns 
 */
const exportTqByDoc = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/exportDoc", params);

/**
 * 关键字查询
 */
const searchQuestionsByKeyword = (params) => getAction("/mw-exam/erp/exam/mwExamQuestion/searchQuestionsByKeyword", params);

export default {
  searchQuestionsByKeyword,
  getDictItemsByCode,
  getWorkLevelByWorkType,
  getFirstWorkTypeName,
  getListSearchAll,
  getWorkTypeList,
  getTqList,
  isOrNotEditById,
  dismissEditById,
  addTq,
  editTq,
  deleteTqById,
  previeTqimportDoc,
  importTqByDoc,
  importTqByExcel,
  exportTqByExcel,
  exportTqByDoc,
  ...knowledageManage,
  ...paper,
  ...exercises
}
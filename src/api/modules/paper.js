/**
 *  获取题库管理-试卷管理的相关接口:
 *  ====Tp---→Test Paper  试卷
 *  By DongMM
 *  Create at 2021/04/21
 */

import {
  getAction,
  postAction,
  postFormAction,
  deleteAction
} from '@/api/manage'

/**
 * 获取试卷列表数据
 * @param {Object} params
 * @returns
 */
const getTpListData = (params) => getAction("/mw-exam/erp/exam/paper/list", params);

/**
 * 根据id获取试卷详情
 * @param {Object} params
 */
const getTpDetailById = (params) => getAction("/mw-exam/erp/exam/paper/getPaperById", params);

/**
 * 新增试卷
 * @param {Object} params
 * @returns
 */
const addNewTp = (params) => postAction("/mw-exam/erp/exam/paper/addPaper", params);

/**
 * 删除试卷
 * @param {Object} params
 * @returns
 */
const deleteTp = (params) => deleteAction("/mw-exam/erp/exam/paper/delete", params);

/**
 * 大题局部刷新初始化
 * @param {Object} params
 * @returns
 */
const getTpGroupDetailById = (params) => getAction("/mw-exam/erp/exam/paper/initGroup", params);

/**
 * 修改大题
 * @param {Object} params
 * @returns
 */
const editTpGroupById = (params) => postAction("/mw-exam/erp/exam/paper/modifyGroup", params);

/**
 * 大题的上移下移
 * @param {Object} params
 * @returns
 */
const moveTpGroupById = (params) => postFormAction("/mw-exam/erp/exam/paper/moveGroup", params);

/**
 * 删除大题
 * @param {Object} params
 * @returns
 */
const deleteTpGroupById = (params) => deleteAction("/mw-exam/erp/exam/paperCar/removeCarGroup", params);

/**
 * 小题局部刷新初始化
 * @param {Object} params
 * @returns
 */
const getTpQuestionDetailById = (params) => getAction("/mw-exam/erp/exam/paper/initQuestion", params);

/**
 * 小题的上移下移
 * @param {Object} params
 * @returns
 */
const moveTpQuestionById = (params) => postFormAction("/mw-exam/erp/exam/paper/moveQuestion", params);

/**
 * 删除小题
 * @param {Object} params
 * @returns
 */
const deleteTpQuestionById = (params) => deleteAction("/mw-exam/erp/exam/paperCar/removeCarQuestion", params);

/**
 * 加入试题篮
 * @param {Object} params
 * @returns
 */
const addQuestionToCart = (params) => postFormAction("/mw-exam/erp/exam/paperCar/addCar", params);

/**
 * 获取智能组卷时草稿数据
 * @param {Object} params
 * @returns
 */
const getDrafDataAutoGeneratePaper = (params) => getAction("/mw-exam/erp/exam/paper/initSmartPaper", params);

/**
 * 智能组卷
 * @param {Object} params
 * @returns
 */
const autoGeneratePaper = (params) => postAction("/mw-exam/erp/exam/paper/smartPaper", params);

/**
 * 获取试题类型的最大可用数量
 * @param {Object} params 
 * @returns 
 */
const getMaxNumByQuestionType = (params) => postAction("/mw-exam/erp/exam/paper/smartPaperFindQuestionCount", params);

/**
 * 更新试卷状态(auditStatus: 2-未发布,3-已发布/待审核，4-审核通过，5-审核不通过)
 * @param {Object} params
 * @returns
 */
const updateTpStatus = (params) => postFormAction("/mw-exam/erp/exam/paper/updateStatus", params);

/**
 * 生成试卷B,根据审核通过并且没有生成过B卷的主卷来生成一份新的试卷B卷
 */
const copyPaperB = (params) => postFormAction("/mw-exam/erp/exam/paper/copyPaper", params);

/**
 * 设置试卷场景
 * @param {Object} params
 * @returns
 */
const setTpFlag = (params) => postFormAction("/mw-exam/erp/exam/paper/setPaperFlag", params);

/**
 * 试卷分析
 * @param {Object} params
 * @returns
 */
const getTpAnalysisData = (params) => getAction("/mw-exam/erp/exam/paper/paperAnalysis", params);

/**
 * 设置试卷分数
 * @param {Object} params
 * @returns
 */
const setTpScore = (params) => postAction("/mw-exam/erp/exam/paper/setScore", params);

/**
 * 设置试卷时间
 * @param {Object} params
 * @returns
 */
const setTpTime = (params) => postAction("/mw-exam/erp/exam/paper/setTotalTime", params);

/**
 * 设置试卷标题
 * @param {Object} params
 * @returns
 */
const setTpTitle = (params) => postAction("/mw-exam/erp/exam/paper/setPaperTitle", params);

/**
 * 人工组卷试题列表-分页且排除试题篮中试题查询
 * @param {Object} params
 * @returns
 */
const getQuestionListFilterByIds = (params) => getAction("/mw-exam/erp/exam/paper/queryQuestionPage", params);

/**
 * 新增/换题的题库过滤
 * @param {Object} params
 * @returns
 */
const getTpQuestionListFilterById = (params) => getAction("/mw-exam/erp/exam/paper/questionFilter", params);

/**
 * 试卷-换题
 * @param {Object} params
 * @returns
 */
const replaceTpQuestion = (params) => postAction("/mw-exam/erp/exam/paper/replaceQuestion", params);
/****************************************试卷审核 start**********************************************/
/**
 * 获取试卷审核列表数据
 * @param {Object} params
 * @returns
 */
const getAuditTpListData = (params) => getAction("/mw-exam/erp/exam/paper/pageAuditList", params);

/**
 * 审核试卷
 * @param {Object} params
 * @returns
 */
const auditTp = (params) => postFormAction("/mw-exam/erp/exam/paper/auditPaper", params);

/****************************************试卷审核 end**********************************************/

export default {
  getTpListData,
  getTpDetailById,
  addNewTp,
  deleteTp,
  getTpGroupDetailById,
  editTpGroupById,
  moveTpGroupById,
  deleteTpGroupById,
  getTpQuestionDetailById,
  moveTpQuestionById,
  deleteTpQuestionById,
  addQuestionToCart,
  getDrafDataAutoGeneratePaper,
  autoGeneratePaper,
  getMaxNumByQuestionType,
  updateTpStatus,
  copyPaperB,
  setTpFlag,
  getTpAnalysisData,
  setTpScore,
  setTpTime,
  setTpTitle,
  getQuestionListFilterByIds,
  getTpQuestionListFilterById,
  replaceTpQuestion,
  getAuditTpListData,
  auditTp
}
/**
 *  习题-习题管理的相关接口:
 *  By DongMM
 *  Create at 2021/07/08
 */

import {
  getAction,
  postAction,
  postFormAction,
  deleteAction
} from '@/api/manage'

/**
 * 习题——新增|编辑
 * @param {Object} params 
 * @returns 
 */
const addAndEditExercises = (params) => postAction("/mw-exam/erp/exam/exerciseSets/smartExercise", params);

/**
 * 获取试题类型的最大可用数量
 * @param {Object} params 
 * @returns 
 */
const getExerciseMaxNumByQt = (params) => postAction("/mw-exam/erp/exam/exerciseSets/smartExerciseFindQuestionCount", params);

/**
 * 根据id获取习题的详情
 * @param {Object} params 
 * @returns 
 */
const getExerciseSetById = (params) => getAction("/mw-exam/erp/exam/exerciseSets/getExerciseSetById", params);

/**
 * 根据试卷id及题型，查询该试卷该题型的困难程度
 * @param {Object} params 
 * @returns 
 */
const getPapersByIdAndQt = (params) => getAction("/mw-exam/erp/exam/paper/queryPageHardInfoByIdAndQuestionType", params);

export default {
  addAndEditExercises,
  getExerciseMaxNumByQt,
  getExerciseSetById,
  getPapersByIdAndQt
}
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

/**
 * 获取知识点树状数据
 * @param {Object} params 
 * @returns 
 */
const getKnowledgeTree = (params) => getAction("/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree", params);

/**
 *
 * 根据知识点id获取知识点
 * @param {*} params
 */
const getKnowledgeById = (params) => getAction("/mw-exam/erp/exam/mwExamKnowledge/queryById", params);

export default {
  getKnowledgeTree,
  getKnowledgeById
}
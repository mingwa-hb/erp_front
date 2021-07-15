/**
 *  获取PMO管理的相关接口:
 *  ====Hd---→Home dashboard   首页看板
 *  ====Jd---→Job dashboard    工作计划看板
 *  ====Dsa---→Data static analysis   数据统计分析
 *  By DongMM 
 *  Create at 2021/01/28
 */

import {
  getAction,
  postAction
} from '@/api/manage'

/**
 *
 * 首页看板-获取用户月周工作百分比
 * @param {Object} params
 */
const getHdUserWorkPercent = (params) => getAction("/erp/busiData/initContractCount", params);

/**
 * 首页看板-获取业务统计数据
 * @param {Object} params 
 */
const getHdBusinessChartData = (params) => getAction("/erp/busiData/getBusiDataStatistics", params);

/**
 * 首页看板-获取年度销售TOP10排行榜
 * @param {Object} params 
 */
const getHdSaleTopTenChartData = (params) => getAction("/erp/busiData/getYearTop10", params);

/**
 * 工作计划看板-获取树状结构数据
 * @param {Object} params 
 */
const getJdTreeNodeList = (params) => getAction("/erp/workPlanShow/getKanBanInfoTree", params);

/**
 * 工作计划看板-根据搜索条件获取列表数据
 * @param {Object} params 
 */
const getJdTableListByQuery = (params) => postAction("/erp/workPlanShow/getKanBanInfoInfo", params);

/**
 * 数据统计分析页-获取折线图数据
 * type 
 *    1-完成计划月,  2-完成计划年,
 *    3-实际完成月,  4-实际完成年,
 *    5-剩余计划月,  6-剩余计划年,
 *    7-累计剩余月,  8-累计剩余年
 *    9-合同证次月，10-合同证次年
 *    11-计划证次月，12-计划证次年
 * @param {Object} params 
 */
const getDsaChartData = (params) => getAction("/erp/busiData/planCertificate", params);

/**
 * 获取待办任务列表数据
 * @param {Object} params
 * @returns
 */
const getHdTaskListData = (params) => getAction("/erp/task/getTaskList", params);

export default {
  getHdUserWorkPercent,
  getHdBusinessChartData,
  getHdSaleTopTenChartData,
  getJdTreeNodeList,
  getJdTableListByQuery,
  getDsaChartData,
  getHdTaskListData
}
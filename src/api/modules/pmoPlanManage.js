import {
  getAction,
  deleteAction,
  putAction
} from '@/api/manage'

// 得到计划统计表
const getList = (params) => getAction("/erp/mwPmoPlan/list", params);

// 计划管理-通过id查询
const getListById = (params) => getAction("/erp/mwPmoPlan/queryById", params);

// 计划管理-通过id删除
const deletePlanById = (params) => deleteAction("/erp/mwPmoPlan/delete", params);

// 计划管理-编辑
const EditPlanById = (params) => putAction("/erp/mwPmoPlan/edit", params);

// 计划管理-导出所有附件
const exportAllFile = (params) => getAction("/erp/mwPmoPlan/exportAllFile?ids=" + params);

// 计算并更新计划状态定时任务
const updatePlanStatusAutoJob = (params) => getAction("/erp/mwPmoPlan/updatePlanStatusAutoJob", params);

// 获取指定角色的用户列表数据
const appointUserList = (params) => getAction("/sys/user/listByRoleCodeList", params);

export default {
  getList,
  getListById,
  deletePlanById,
  EditPlanById,
  exportAllFile,
  updatePlanStatusAutoJob,
  appointUserList
}
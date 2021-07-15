/**
 * 模块类型 create by dongmm 2021/05/26
 * //模块名(1-合同,2-收款,3-PMO,4-报名,5-学习,6-考试,7-证书,8-退款,9-H5报名)
 */

const TASK_MODULE_TYPE_URL = [{
    id: 0,
    type: 1,
    name: "合同管理",
    url: "/imingwa/contractList"
  },
  {
    id: 1,
    type: 2,
    name: "收款管理",
    url: "/imingwa/ReceiptAdministration"
  },
  {
    id: 2,
    type: 3,
    name: "PMO管理",
    url: "/ipmo/PlanAdministrateList"
  },
  {
    id: 3,
    type: 4,
    name: "报名管理",
    url: "/imingwa/stuApplyInfoList"
  },
  {
    id: 4,
    type: 5,
    name: "学习管理",
    url: "/imingwa/stuLearning"
  },
  {
    id: 5,
    type: 6,
    name: "考试管理",
    url: "/imingwa/StuExamList"
  },
  {
    id: 6,
    type: 7,
    name: "证书管理",
    url: "/imingwa/CertificateManagement"
  },
  {
    id: 7,
    type: 8,
    name: "退款管理",
    url: "/imingwa/RefundAdministration"
  },
  {
    id: 8,
    type: 9,
    name: "H5报名管理",
    url: "/mingwa/StuInfoCheckList"
  }
]

export default {
  TASK_MODULE_TYPE_URL
}
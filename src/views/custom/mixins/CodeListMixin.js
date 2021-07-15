/**
 * 任务管理的mixin
 */
import _ from 'lodash'
import TYPELIST from '../data/index'
import {
  customApiList
} from '@/api/api'

let mixin = {
  props: {},
  data() {
    return {
      CODE_TYPE: "is_send,work_status,deal_yj,core_demand,communicate_type", //字典编号
      is_send: [], //工单发送邮件
      work_status: [], //工单状态
      deal_yj: [], //工单处理意见
      core_demand: [], //工单核心诉求
      communicate_type: [], //工单沟通分类
    }
  },
  computed: {
    isSendTypeList({
      is_send
    }) {
      let res = this.formatTypeListData(is_send)
      return res
    },
    workStatusTypeList({
      work_status
    }) {
      let res = this.formatTypeListData(work_status)
      return res
    },
    dealYjTypeList({
      deal_yj
    }) {
      let res = this.formatTypeListData(deal_yj)
      return res
    },
    coreDemandTypeList({
      core_demand
    }) {
      let res = this.formatTypeListData(core_demand)
      return res
    },
    communicateTypeTypeList({
      communicate_type
    }) {
      let res = this.formatTypeListData(communicate_type)
      return res
    }
  },
  created() {
    //初始化字典列表
    this.getQueryCodeList()
  },
  filters: {
    getCodeItemTextByCode(val, arr) {
      let res = undefined;
      let target = _.find(arr, ['itemValue', val.toString()])
      res = !!target ? target.itemText : "未知数据"
      return res
    },
    getLocalItemTextByCode(val, arr) {
      let res = undefined;
      let target = _.find(arr, ['value', val.toString()])
      res = !!target ? target.label : "未知数据"
      return res
    }
  },
  methods: {
    formatTypeListData(originArr) {
      let res = [{
        id: 0,
        itemText: "全部",
        itemValue: "0",
        description: "all"
      }]
      let len = originArr.length;
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let obj = originArr[i]
          res.push({
            id: i + 1,
            itemText: obj.itemText,
            itemValue: obj.itemValue,
            description: obj.description,
          })
        }
      }
      return res
    },
    getQueryCodeList() {
      let CODE_TYPE = this.CODE_TYPE;
      let opts = {
        codes: CODE_TYPE
      }
      customApiList.getCodeTypeListByCode(opts).then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          let resp = res.result
          Object.assign(this, resp);
        } else {
          this.$message.error(res.message)
        }
      })
    },
  }
};

export default mixin;
/**
 * 任务管理的mixin
 */
import _ from 'lodash'
import TYPELIST from '../data/index'
import {
  taskApiList
} from '@/api/api'

let mixin = {
  props: {},
  data() {
    return {
      CODE_TYPE: "task_module,task_action", //字典字典编号：  task_action————任务操作类型 task_module————任务模块名称
      task_module: [], //任务模块名称列表
      task_action: [], //任务操作类型数据字典
      task_temp_status_type_list: TYPELIST.TASKTEMP_STATUS_TYPE_LIST,
      task_status_type_list: TYPELIST.TASK_STATUS_TYPE_LIST,
      modules_url_type_list: TYPELIST.TASK_MODULE_TYPE_URL
    }
  },
  computed: {
    taskModuleTypeList({
      task_module
    }) {
      let res = this.formatTypeListData(task_module)
      return res
    },
    taskActionsTypeList({
      task_action
    }) {
      let res = this.formatTypeListData(task_action)
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
    getTaskTextByCode(val, arr) {
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
        description: "all_data"
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
      taskApiList.getTaskTypeListByCode(opts).then(res => {
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
/**
 * 获取字典列表的mixin
 */
import _ from 'lodash'
import {
  getAction
} from '@/api/manage'

/**
 * 根据数据字典code获取数据字典
 * @param {Object} params 
 * @returns 
 */
const getSysDictByCodes = (params) => getAction("/sys/api/getSysDictByCodes", params);

let mixin = {
  props: {},
  data() {
    return {
      CODE_TYPE: "data_status,task_action", //字典字典编号：data_status——业务状态  task_action————任务操作类型
      data_status: [], //任务状态数据字典
      task_action: [], //任务操作类型数据字典
    }
  },
  computed: {
    dataStatusTypeList({
      data_status
    }) {
      let res = this.formatTypeListData(data_status)
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
      val = !!val ? val : -1;
      let target = _.find(arr, ['itemValue', val.toString()])
      res = !!target ? target.itemText : "未知数据"
      return res
    },
  },
  methods: {
    formatTypeListData(originArr) {
      let res = [{
        id: 0,
        itemText: "全部",
        itemValue: undefined
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
      getSysDictByCodes(opts).then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          let resp = res.result
          Object.assign(this, resp);
        } else {
          this.$message.error(res.message || "获取数据字典失败")
        }
      })
    },
  }
};

export default mixin;
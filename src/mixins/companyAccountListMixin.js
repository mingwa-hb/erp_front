/**
 * 获取公司账户列表信息的mixin
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
      CODE_TYPE: "company_account_no,company_account_bank", //公司开户行账号：company_account_no   公司开户行名称：company_account_bank
      company_account_no: [], //任务状态数据字典
      company_account_bank: [], //任务操作类型数据字典
    }
  },
  computed: {
    compAccountsNoTypeList({
      company_account_no
    }) {
      let res = this.formatTypeListData(company_account_no)
      return res
    },
    compAccountsBankTypeList({
      company_account_bank
    }) {
      let res = this.formatTypeListData(company_account_bank)
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
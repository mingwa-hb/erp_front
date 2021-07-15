/**
 * 试题管理的mixin
 */
import TYPELIST from '../data/test_data'
import {
  downFile
} from '@/api/manage'
import {
  getFileType
} from "@/utils/fileType"
import {
  tikuApiList
} from '@/api/api'

let mixin = {
  props: {},
  data() {
    return {
      // projectTypeList: TYPELIST.PROJECT_TYPE_LIST, //项目类型列表
      workTypeList: TYPELIST.WORK_TYPE_LIST, //工种类型列表
      // difficultyTypeList: TYPELIST.DIFFICULTY_TYPE_LIST, //难易程度类型列表
      // questionTypeList: TYPELIST.QUESTION_TYPE_LIST, //试题类型类型列表
      charsTypeList: TYPELIST.CHARS_TYPE_LIST,
      question_project_type: [],
      hard_level: [],
      question_type: [],
      url: {
        exportXlsUrl: "/mw-exam/erp/exam/mwExamQuestion/exportXls",
        exportDocUrl: "/mw-exam/erp/exam/mwExamQuestion/exportDoc"
      }
    }
  },
  computed: {
    projectTypeList() {
      let res = this.formatTypeListData(this.question_project_type)
      return res
    },
    difficultyTypeList() {
      let res = this.formatTypeListData(this.hard_level)
      return res
    },
    questionTypeList() {
      let res = this.formatTypeListData(this.question_type)
      return res
    }
  },
  created() {
    //初始化字典列表
    this.getQueryCodeList()
  },
  filters: {
    getCharsByNum(val) {
      let charsArr = TYPELIST.CHARS_TYPE_LIST
      let res = charsArr[val - 1]
      return res.label
    }
  },
  methods: {
    getFileType: getFileType,
    getQueryField(data) {
      let str = '';
      for (let k in data) {
        let value = data[k] !== undefined ? data[k] : '';
        if (!!value) {
          str += `&${k}=${value}`
        }
      }
      return str ? str.substring(1) : ''
    },
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
            itemValue: obj.itemValue
          })
        }
      }
      return res
    },
    getQueryCodeList() {
      let CODE_TYPE = "question_project_type,hard_level,question_type"; //项目类型：question_project_type，难易程度：T0，问题类型：question_type，传多个时，英文逗号拼接
      let opts = {
        codes: CODE_TYPE
      }
      tikuApiList.getDictItemsByCode(opts).then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          let resp = res.result
          Object.assign(this, resp);
        } else {
          this.$message.error(res.message)
        }
      })
    },
    dismissEditById(id, cb) {
      //解除试题被编辑状态
      let opts = {
        id: id
      }
      if (!!opts.id) {
        tikuApiList.dismissEditById(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            cb && cb(record)
          } else {
            this.$message.error(res.message || '该试题解除编辑状态失败！')
          }
        })
      } else {
        this.$message.error('试题ID参数不存在，请刷新列表重试！')
      }
    },
    isAccessEditById(record, cb) {
      //是否允许呗编辑
      let opts = {
        id: record.question.id || record.id
      }
      if (!!opts.id) {
        tikuApiList.isOrNotEditById(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            cb && cb(record)
          } else {
            this.$message.error(res.message || '该试题已被占用，不可编辑！')
          }
        })
      } else {
        this.$message.error('试题ID参数不存在，请刷新列表重试！')
      }
    },
    doExportTqByDoc() {
      let opts = {
        ids: this.selectedRowKeys
      }
      tikuApiList.exportTqByDoc(opts).then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          let resp = res.result
          this.$message.success(res.message)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /* 导出 */
    doExportTqByExcel(fileName) {
      if (!fileName || typeof fileName != "string") {
        fileName = "试题导出文件"
      }
      let param = {
        ...this.queryParams
      };
      if (this.selectedRowKeys && this.selectedRowKeys.length > 0) {
        param['ids'] = this.selectedRowKeys.join(",")
      }
      console.log("导出参数", param)
      this.downloadFile(this.url.exportXlsUrl, param)
    },
    downloadFile(apiUrl, param) {
      // this.loading = true
      downFile(apiUrl, param).then((data) => {
        if (!data) {
          // this.loading = false
          this.$message.warning("文件下载失败")
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          // this.loading = false
          window.navigator.msSaveBlob(new Blob([data], {
            type: 'application/vnd.ms-excel'
          }), fileName + '.xls')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], {
            type: 'application/vnd.ms-excel'
          }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.xls')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link); //下载完成移除元素
          window.URL.revokeObjectURL(url); //释放掉blob对象
          // this.loading = false
        }
      })
    }
  }
};

export default mixin;
<template>
  <div class="tku-upload-container">
    <a-upload
      name="file"
      :accept="acceptFileType"
      :multiple="true"
      :action="uploadAction"
      :headers="headers"
      :data="uploadParams"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      @change="handleChange"
      :disabled="disabled"
      :listType="complistType"
      @preview="handlePreview"
      :class="{ 'uploadty-disabled': disabled }"
    >
      <template>
        <a-button v-if="buttonVisible"> <a-icon type="upload" />{{ uploadBtnText }} </a-button>
      </template>
    </a-upload>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getFileAccessHttpUrl } from '@/api/manage'

const FILE_TYPE_ALL = 'all'
const FILE_TYPE_IMG = 'image'
const FILE_TYPE_TXT = 'file'
const FILE_TYPE_DOCX = 'docx'
const FILE_TYPE_DOC = 'doc'
const FILE_TYPE_XLS = 'xls'
const FILE_TYPE_XLSX = 'xlsx'
const FILE_TYPE_EXCEL = ['xls', 'xlsx']
const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10)
}
const getFileName = path => {
  if (path.lastIndexOf('\\') >= 0) {
    let reg = new RegExp('\\\\', 'g')
    path = path.replace(reg, '/')
  }
  return path.substring(path.lastIndexOf('/') + 1)
}
export default {
  name: 'TikuUpload',
  props: {
    text: {
      type: String,
      required: false,
      default: '点击上传'
    },
    fileType: {
      type: String,
      required: false,
      default: FILE_TYPE_ALL
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: 'tiku'
    },
    value: {
      type: [String, Array],
      required: false
    },
    // update-begin- --- author:wangshuai ------ date:20190929 ---- for:Jupload组件增加是否能够点击
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    // update-end- --- author:wangshuai ------ date:20190929 ---- for:Jupload组件增加是否能够点击
    //此属性被废弃了
    triggerChange: {
      type: Boolean,
      required: false,
      default: false
    },
    number: {
      type: Number,
      required: false,
      default: 0
    },
    buttonVisible: {
      type: Boolean,
      required: false,
      default: true
    },
    params: {
      type: Object,
      required: false,
      default: () => {
        return null
      }
    },
    uploadActUrl: {
      type: String,
      required: false,
      default: window._CONFIG['domianURL'] + '/sys/common/upload'
    }
  },
  data() {
    return {
      // acceptFileType: '.docx,.xls,.xlsx',
      // uploadAction: this.uploadActUrl,
      headers: {},
      uploadParams: Object.assign({}, { biz: this.bizPath }, this.params), //上传所需参数或返回上传参数的方法
      fileList: [],
      uploadGoOn: true,
      previewVisible: false
    }
  },

  watch: {
    value: {
      immediate: true,
      handler() {}
    },
    params: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.uploadParams = Object.assign({}, { biz: this.bizPath }, newV)
      }
    }
  },
  computed: {
    uploadAction() {
      return this.uploadActUrl
    },
    complistType() {
      return this.fileType === FILE_TYPE_IMG ? 'picture-card' : 'text'
    },
    uploadBtnText() {
      return this.fileList.length > 0 ? '重新上传' : this.text
    },
    acceptFileType() {
      let res = '.docx,.xls,.xlsx'
      if (this.fileType == FILE_TYPE_DOCX || this.fileType == FILE_TYPE_DOC) {
        res = '.docx'
      } else if (this.fileType == FILE_TYPE_XLS || this.fileType == FILE_TYPE_XLSX) {
        res = '.xls,.xlsx'
      }
      return res
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
  },

  methods: {
    //父组件调用removeFileListFunction，清除fileList
    removeFileListFunction() {
      this.fileList = []
    },

    beforeUpload(file) {
      this.uploadGoOn = true
      let fileType = file.type
      if (this.fileType == FILE_TYPE_DOCX || this.fileType == FILE_TYPE_DOC) {
        //上传文件为docx
        if (!this.params.workTypeName) {
          //没有选工种，直接返回
          this.$message.warning('请先选择工种类型！')
          this.uploadGoOn = false
          return false
        }
        if (!file.name.endsWith('.docx')) {
          this.$message.warning('请上传docx格式文件')
          this.uploadGoOn = false
          return false
        }
      } else if (this.fileType == FILE_TYPE_XLS || this.fileType == FILE_TYPE_XLSX) {
        //上传文件为xls、xlsx
        if (!file.name.endsWith('.xls') && !file.name.endsWith('.xlsx')) {
          this.$message.warning('请上传xls、xlsx格式文件')
          this.uploadGoOn = false
          return false
        }
      } else {
        this.$message.warning('请上传正确格式文件')
        this.uploadGoOn = false
        return false
      }
      //TODO 扩展功能验证文件大小
      return true
    },
    handleChange(info) {
      console.log('--文件列表改变--')
      if (!info.file.status && this.uploadGoOn === false) {
        info.fileList.pop()
      }
      let fileList = info.fileList
      if (info.file.status === 'done') {
        fileList = fileList.slice(-1)
        if (info.file.response.success) {
          let result = fileList.slice(-1)[0].response
          debugger;
          if (result.code == 200) {
            // this.$message.success(result.message)
            if (this.fileType == FILE_TYPE_DOCX || this.fileType == FILE_TYPE_DOC) {
              //this.$message.success(result.message)
            } else {
              //this.$message.success(`${info.file.name} 正在导入，请到日志管理的导入日志模块查看导入记录！`)
            }
            // this.$emit('afterUpload')
          } else {
            //this.$message.error(result.message)
          }
        }
        //this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败!`)
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status === 'done' || info.file.status === 'removed') {
        this.$emit('change', this.fileList)
      }
    },
    handleDelete(file) {
      //如有需要新增 删除逻辑
      console.log(file)
    },
    handlePreview(file) {
      if (this.fileType === FILE_TYPE_IMG) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      } else {
        // location.href = file.url
      }
    },
    handleCancel() {
      this.previewVisible = false
    }
  },
  mounted() {},
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style lang="less" scoped>
.tku-upload-container {
  position: relative;
}
</style>

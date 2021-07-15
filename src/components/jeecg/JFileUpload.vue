<template>
  <div class="img">
    <!-- :beforeUpload="beforeUpload" -->
    <a-upload
      name="file"
      :listType="listType"
      :multiple="isMultiple"
      :action="uploadAction"
      :headers="headers"
      :data="{ biz: bizPath }"
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :disabled="disabled"
      :isMultiple="isMultiple"
      :showUploadList="true"
      @change="handleChange"
      @preview="handlePreview"
      :class="!isMultiple ? 'imgupload' : ''"
    >
      <img
        v-if="!isMultiple && picUrl && fileType == 1"
        :src="getAvatarView()"
        style="height: 104px; max-width: 300px"
      />
      <div v-else class="iconp">
        <a-icon :type="uploadLoading ? 'loading' : 'plus'" />
        <div class="ant-upload-text">{{ text }}</div>
      </div>
    </a-upload>

    <a-modal width="800" :visible="previewVisible" :footer="null" @cancel="handleCancel()">
      <div v-if="fileType == 1" class="wh100">
        <img alt="example" style="width: 100%" :src="previewImage" />
      </div>
      <div v-if="fileType == 2" class="wh100">
        <iframe :src="previewImage" frameborder="0" class="wh100"></iframe>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getFileAccessHttpUrl } from '@/api/manage'

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
  name: 'JFileUpload',
  props: {
    text: {
      type: String,
      required: false,
      default: '上传'
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath: {
      type: String,
      required: false,
      default: 'temp'
    },
    value: {
      type: [String, Array],
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isMultiple: {
      type: Boolean,
      required: false,
      default: false
    },
    fileTypeOld: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      uploadAction: window._CONFIG['domianURL'] + '/sys/common/upload',
      uploadLoading: false,
      picUrl: false,
      headers: {},
      fileList: [],
      previewImage: '',
      previewVisible: false,
      fileType: 1
    }
  },

  watch: {
    value(val) {
      if (val instanceof Array) {
        this.initFileList(val.join(','))
      } else {
        this.initFileList(val)
      }
      if (!val || val.length == 0) {
        this.picUrl = false
      }
    }
  },
  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    this.fileType = this.fileTypeOld
  },
  methods: {
    initFileList(paths) {
      if (!paths || paths.length == 0) {
        this.fileList = []
        return
      }
      this.picUrl = true
      let fileList = []
      let arr = paths.split(',')
      for (var a = 0; a < arr.length; a++) {
        let url = getFileAccessHttpUrl(arr[a])
        fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: url,
          response: {
            status: 'history',
            message: arr[a]
          }
        })
      }
      this.fileList = fileList
    },
    beforeUpload: function(file) {
      var fileType = file.type
      if (fileType.indexOf('image') > 0) {
        //是图片
        this.fileType = 1
      } else if (fileType.indexOf('pdf') > 0) {
        //是pdf
        this.fileType = 2
      }
    },
    handleChange(info) {
      this.picUrl = false
      let fileList = info.fileList
      if (info.file.status === 'done') {
        if (info.file.response.success) {
          this.picUrl = true
          fileList = fileList.map(file => {
            if (file.response) {
              file.url = file.response.message
            }
            this.previewImage = file.url || file.thumbUrl
            this.changeFileType(this.previewImage)
            return file
          })
        }
        //this.$message.success(`${info.file.name} 上传成功!`);
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败.`)
      } else if (info.file.status === 'removed') {
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status === 'done' || info.file.status === 'removed') {
        this.handlePathChange()
      }
      this.$forceUpdate()
    },

    //改变文件类型
    changeFileType(url) {
      if (url == undefined) {
        //默认是图片
        this.fileType = 1
      } else if (url.indexOf('.pdf') > 0 || url.indexOf('.PDF') > 0) {
        //是pdf
        this.fileType = 2
      } else if (
        url.indexOf('.doc') > 0 ||
        url.indexOf('.DOC') > 0 ||
        url.indexOf('.docx') > 0 ||
        url.indexOf('.DOCX') > 0
      ) {
        //是doc
        this.fileType = 3
      } else {
        //默认是图片
        this.fileType = 1
      }
    },

    // 预览
    handlePreview(file) {
      console.log(file)
      this.previewImage = file.url || file.thumbUrl
      this.changeFileType(this.previewImage)
      this.previewVisible = true
      // this.$forceUpdate();
    },
    getAvatarView() {
      if (this.fileList.length > 0) {
        let url = this.fileList[0].url
        return getFileAccessHttpUrl(url)
      }
    },
    handlePathChange() {
      let uploadFiles = this.fileList
      let path = ''
      if (!uploadFiles || uploadFiles.length == 0) {
        path = ''
      }
      let arr = []
      if (!this.isMultiple) {
        if (uploadFiles.length > 0) {
          arr.push(uploadFiles[uploadFiles.length - 1].response.message)
        }
      } else {
        for (let a = 0; a < uploadFiles.length; a++) {
          // update-begin-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
          if (uploadFiles[a].status === 'done') {
            arr.push(uploadFiles[a].response.message)
          } else {
            return
          }
          // update-end-author:taoyan date:20200819 for:【开源问题z】上传图片组件 LOWCOD-783
        }
      }
      if (arr.length > 0) {
        path = arr.join(',')
      }
      this.$emit('change', path)
    },
    handleDelete(file) {
      //如有需要新增 删除逻辑
      console.log(file)
    },
    handleCancel() {
      this.close()
      this.previewVisible = false
    },
    close() {}
  },
  model: {
    prop: 'value',
    event: 'change'
  }
}
</script>

<style lang="less" scoped>
/* update--begin--autor:lvdandan-----date:20201016------for：j-image-upload图片组件单张图片详情回显空白
  * https://github.com/zhangdaiscott/jeecg-boot/issues/1810
  * https://github.com/zhangdaiscott/jeecg-boot/issues/1779
  */
/deep/ .imgupload .ant-upload-select {
  display: block;
}
/deep/ .imgupload .ant-upload.ant-upload-select-picture-card {
  width: 120px;
  height: 120px;
}
/deep/ .imgupload .iconp {
  padding: 32px;
}
/deep/ .imgupload .iconp {
  padding: 32px;
}
/* update--end--autor:lvdandan-----date:20201016------for：j-image-upload图片组件单张图片详情回显空白*/
/deep/ .ant-modal {
  width: 800px;
}
/deep/ .ant-modal-content {
  height: 600px;
}
/deep/ .ant-modal-body {
  height: 100%;
}
.wh100 {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <a-modal
    title="学员图片信息资料导出"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    cancelText="关闭"
    style="top:20px;"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <div>
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
              导出全部
            </a-checkbox>
          </div>
          <a-checkbox-group v-model="checkedList" :options="plainOptions" @change="onChange" />
          <br/>
          <div>
            <br/>
          <div :style="{ borderBottom: '1px solid #E9E9E9' }">
            <a-checkbox :indeterminate="indeterminateFolder" :checked="checkAllFolder" @change="onCheckAllFolderChange">
              导出目录
            </a-checkbox>
          </div>
          <a-checkbox-group v-model="folderCheckedList" :options="folderOptions" @change="onChangeFolder" />
          </div>
        </div>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction, downFile } from '@/api/manage'
import JCheckbox from '@/components/jeecg/JCheckbox'
const plainOptions = ['身份证', '学历', '证件照', '工作证明']
const defaultCheckedList = ['身份证', '学历', '证件照', '工作证明']
const folderOptions = ['公司名', '工种/级别', '姓名']
const defaultFolderCheckedList = ['公司名','工种/级别','姓名']
const types = []

export default {
  name: 'StuImgTypeSelectionModal',
  components: { JCheckbox },
  data() {
    return {
      checkedList: defaultCheckedList,
      folderCheckedList: defaultFolderCheckedList,
      indeterminate: true,
      indeterminateFolder: true,
      checkAll: false,
      checkAllFolder: false,
      plainOptions,
      folderOptions,

      visible: false,
      confirmLoading: false,
      confirmDirty: false,
      model: {},
      types,
      stuIds: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this)
    }
  },
  created() {
    console.log('created')
  },
  methods: {
    show(stuIds) {
      this.form.resetFields()
      this.checkAll = true
      this.checkAllFolder = true
      this.visible = true
      this.stuIds = stuIds
    },
    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
    },
    handleSubmit() {
      if (this.checkedList == 0) {
        this.$message.warning('请选择一个类型进行导出!')
        return
      }
      console.log(this.checkedList)
      this.downloadPics('学员照片')
    },
    handleCancel() {
      this.close()
    },
    getFormFieldValue(field) {
      // console.log(field.label)
      return this.form.getFieldValue(field)
    },
    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    downloadPics(fileName) {
      var tps = ''
      for (var a = 0; a < this.checkedList.length; a++) {
        //'身份证','学历', '证件照'
        if (this.checkedList[a] == '身份证') {
          tps += '1,'
        } else if (this.checkedList[a] == '学历') {
          tps += '2,'
        } else if (this.checkedList[a] == '证件照') {
          tps += '3,'
        } else if (this.checkedList[a] == '工作证明') {
          tps += '4,'
        }
      }
      var folderTypes = ''
      for (var a = 0; a < this.folderCheckedList.length; a++) {
        //'身份证','学历', '证件照'
        if (this.folderCheckedList[a] == '公司名') {
          folderTypes += '1,'
        } else if (this.folderCheckedList[a] == '工种/级别') {
          folderTypes += '2,'
        } else if (this.folderCheckedList[a] == '姓名') {
          folderTypes += '3,'
        }
      }
      this.confirmLoading = true
      // console.log(tps);
      downFile('/erp/student/downLoadPics/' + tps, { ids: this.stuIds,folderTypes:folderTypes }).then(data => {
        this.confirmLoading = false
        if (!data || data.size == 0) {
          this.$message.warning('文件下载失败, 或者选择的学员没有照片可以导出!')
          return
        }
        if (typeof window.navigator.msSaveBlob !== 'undefined') {
          window.navigator.msSaveBlob(new Blob([data], { type: 'application/zip' }), fileName + '.zip')
        } else {
          let url = window.URL.createObjectURL(new Blob([data], { type: 'application/zip' }))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', fileName + '.zip')
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link) //下载完成移除元素
          window.URL.revokeObjectURL(url) //释放掉blob对象
        }
      })
    },

    onChange(checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    },
    onChangeFolder(folderCheckedList) {
      this.indeterminateFolder = !!folderCheckedList.length && folderCheckedList.length < folderOptions.length
      this.checkAllFolder = folderCheckedList.length === folderOptions.length
    },
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    onCheckAllFolderChange(e) {
      Object.assign(this, {
        folderCheckedList: e.target.checked ? folderOptions : [],
        indeterminateFolder: false,
        checkAllFolder: e.target.checked
      })
    }
  }
}
</script>

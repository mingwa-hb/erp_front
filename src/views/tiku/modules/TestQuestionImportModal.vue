<template>
  <a-modal
    :title="title"
    width="70%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    cancelText="关闭"
    class="daoru-modal-container"
  >
    <template slot="footer">
      <a-button @click="handleCancel">关闭</a-button>
    </template>
    <!-- 试题导入 -->
    <a-row :gutter="24">
      <a-col :span="9">
        <div class="shiti-form-container">
          <a-form-model
            ref="ruleForm"
            :model="form"
            :rules="rules"
            layout="horizontal"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 16 }"
          >
            <a-form-model-item label="导入文件类型" prop="fileType">
              <a-radio-group v-model="form.fileType">
                <a-radio value="doc">
                  WORD
                </a-radio>
                <a-radio value="xls">
                  EXCEL
                </a-radio>
              </a-radio-group>
            </a-form-model-item>
            <a-form-model-item label="工种类型" prop="workTypeName" v-if="form.fileType == 'doc'">
              <j-select-work-type-for-tiku
                placeholder="请选择工种类型"
                :multiple="false"
                v-model.trim="form.workTypeName"
              />
            </a-form-model-item>
            <a-form-model-item label="上传试题文件" prop="file">
              <tiku-upload
                v-model="form.file"
                ref="removeFileList"
                :params="formParams"
                :upload-act-url="importActUrl"
                :file-type="form.fileType"
                @change="handleChangeFile"
              ></tiku-upload>
            </a-form-model-item>
            <a-form-model-item label="模板下载">
              <a-button type="primary" @click="downLoadTemplate()">下载模板</a-button><br />
              <span class="upload-tishi"
                >提示：文件格式必须为：<b>{{ fileTypeText }}</b
                >！</span
              >
            </a-form-model-item>
          </a-form-model>
        </div>

        <div class="shiti-statics-table" v-if="!!listData && listData.length > 0">
          <h4>试题导入统计</h4>
          <a-table
            :columns="columns"
            :data-source="staticsData"
            :rowKey="setTableRowKey"
            size="small"
            :pagination="false"
          />
        </div>
      </a-col>
      <a-col :span="15">
        <div class="page-list-wrap">
          <div class="page-list-scroll">
            <a-list
              item-layout="vertical"
              size="small"
              :loading="listLoading"
              :pagination="pagination"
              :data-source="listData"
              v-if="!!listData && listData.length > 0"
            >
              <a-list-item slot="renderItem" key="item.title" slot-scope="item, index">
                <ImportPreviewListItem :init-data="item" @doEdit="handleEdit" @doDelete="handleDelete" />
              </a-list-item>
            </a-list>
            <template v-else>
              <a-result v-if="form.fileType == 'doc'" title="请选择word导入数据！">
                <template #icon>
                  <a-icon type="smile" theme="twoTone" />
                </template>
                <template #extra>
                  <span>欢迎使用word（格式必须为docx）导入试题！</span>
                </template>
              </a-result>
              <a-result v-else title="请选择Excel导入数据！">
                <template #icon>
                  <a-icon type="smile" theme="twoTone" />
                </template>
                <template #extra>
                  <span>欢迎使用excel（格式必须为xls、 xlsx）导入试题！</span>
                </template>
              </a-result>
            </template>
          </div>
        </div>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import { tikuApiList } from '@/api/api'
import TYPELIST from './../data/test_data'
import TikuUpload from '../components/TikuUpload'
import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import ImportPreviewListItem from '../components/ImportPreviewListItem'

export default {
  name: 'TestQuestionImportModal', //试题导入弹框
  components: { TikuUpload, JSelectWorkTypeForTiku, ImportPreviewListItem },
  data() {
    return {
      title: '试题导入',
      visible: false,
      fileTypeText: 'docx、xls、 xlsx',
      confirmLoading: false,
      columns: [
        {
          title: '序号',
          key: 'rowIndex',
          dataIndex: '',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '题型',
          dataIndex: 'questionTypeName'
        },
        {
          title: '数量',
          dataIndex: 'num'
        }
      ],
      staticsData: [], //统计数据
      listLoading: false,
      listData: [], //列表数据
      pagination: {
        current: 1,
        pageSize: 3,
        pageSizeOptions: ['3', '5', '10', '20', '30', '40', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        showQuickJumper: false,
        showSizeChanger: true,
        total: 0,
        onChange: page => {
          console.log(page)
        }
      },
      url: {
        previewDocUrl: window._CONFIG['examServiceURL'] + '/erp/exam/mwExamQuestion/transDoc2Json',
        importExcelUrl: window._CONFIG['examServiceURL'] + '/erp/exam/mwExamQuestion/importExcel',
        importDocUrl: window._CONFIG['examServiceURL'] + '/erp/exam/mwExamQuestion/importDoc',
        importDocAndSave: window._CONFIG['examServiceURL'] + '/erp/exam/mwExamQuestion/importDocAndSave'
      },
      form: {
        file: undefined,
        fileType: 'doc',
        workTypeName: undefined
      },
      rules: {
        file: [{ required: true, message: '请选择文件上传！', trigger: 'change' }],
        fileType: [{ required: true, message: '请选择文件类型！', trigger: 'change' }],
        workTypeName: [{ required: true, message: '工种类型不能为空！', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {
    totalNum() {
      return !!this.listData && this.listData.length > 0 ? this.listData.length : 0
    },
    formParams() {
      return _.pick(this.form, ['workTypeName'])
    },
    importActUrl() {
      let url = undefined
      if (this.form.fileType == 'doc') {
        this.fileTypeText = 'docx'
        url = this.url.importDocAndSave
      } else {
        this.fileTypeText = 'xls,xlsx'
        url = this.url.importExcelUrl
      }
      return url
    }
  },
  methods: {
    closeModal() {
      this.visible = false

      //清除工种类型和上传文件列表
      this.form.file = undefined
      this.form.workTypeName = undefined
      this.$refs.removeFileList.removeFileListFunction()
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.closeModal()
    },
    handleChangeFile(list) {
      let that = this
      if (!!list && !!list[0] && !!list[0].response) {
        let res = list[0].response
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          console.log(res.result)
          that.listData =
            !!res.result && !!res.result.questionList && res.result.questionList.length > 0
              ? res.result.questionList
              : []
          that.pagination.total = that.listData.length
          that.staticsData =
            !!res.result && !!res.result.typeList && res.result.typeList.length > 0 ? res.result.typeList : []
        } else {
          //that.$message.error(res.message)
        }
      }
    },
    handleEdit(data) {
      this.$emit('doEdit', data)
    },
    handleDelete(data) {
      // this.$emit('doDelete', data)
      this.$warning({
        title: '重要警告！',
        content: '确认要删除此道试题吗？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          alert('确认删除')
        }
      })
    },
    handleImport() {
      this.showModal()
      this.doResetForm()
    },
    setTableRowKey(record) {
      return record.questionType * 1
    },
    doResetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        } else {
          this.$message.warning('验证没通过！')
          return false
        }
      })
    },
    handleOk() {
      this.doFormSubmit()
    },
    doSendFormDataSubmit() {
      let opts = {
        ...this.form
      }
      // ajax.EditPlanById(opts).then((res) => {
      //   // console.log(res)
      //   if (res.code == 0 || (res.code == 200 && !!res.success)) {
      //     this.$message.success('编辑成功！')
      //     setTimeout(() => {
      //       this.closeModal()
      //       this.$emit('ok')
      //     }, 30)
      //   } else {
      //     this.$message.warning(res.message)
      //   }
      // })
    },
    // doSendTransDocToJson() {
    //   let opts = {
    //     workTypeName: this.form.workTypeName
    //   }
    //   tikuApiList.previeTqimportDoc().then(res => {
    //     console.log(res)
    //     if (res.code == 0 || (res.code == 200 && !!res.success)) {
    //       this.$message.success('上传成功！')
    //     } else {
    //       this.$message.warning(res.message)
    //     }
    //   })
    // },
    initFormVal(data) {},
    downLoadTemplate() {
      let newFileUrl = undefined
      if (this.form.fileType == 'doc') {
        newFileUrl = encodeURI('https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/试题导入模板.docx', 'utf-8')
      } else {
        newFileUrl = encodeURI('https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/试题导入模板.xls', 'utf-8')
      }
      window.location.href = newFileUrl
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.daoru-modal-container {
  /deep/.ant-modal-title {
    font-size: 18px;
  }
  .shiti-form-container,
  .shiti-statics-table {
    h4 {
      font-size: 16px;
    }
    .upload-tishi {
      > b {
        color: red;
      }
    }
  }
  .page-list-wrap {
    .page-list-scroll {
      .ant-list-item {
        border: none;
      }
    }
  }
}
</style>

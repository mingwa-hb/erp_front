<template>
  <a-modal
    :title="title"
    width="40%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消"
    okText="导出"
    class="export-modal-container"
  >
    <!-- 试题导入 -->
    <a-spin :spinning="confirmLoading">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16, offset: 2 }"
      >
        <a-form-model-item label="导出试题文件类型" prop="fileType">
          <a-radio-group v-model="form.fileType">
            <a-radio value="1">
              WORD
            </a-radio>
            <a-radio value="2">
              EXCEL
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
      </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
export default {
  name: 'ExercisesExportModal', //习题导出弹框
  components: {},
  data() {
    return {
      title: '习题导出',
      visible: false,
      confirmLoading: false,
      form: {
        exerciseId: undefined,
        fileType: '1'
      },
      rules: {
        fileType: [{ required: true, message: '请选择文件类型！', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    closeModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.closeModal()
    },
    doResetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          //this.$message.success('开始提交通过！')
          this.$emit('doExport', this.form)
        } else {
          this.$message.warning('验证没通过！')
          return false
        }
      })
    },
    handleOk() {
      this.doFormSubmit()
    },
    initModal(record) {
      this.form.exerciseId = record.id
      this.showModal()
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.export-modal-container {
  /deep/.ant-modal-title {
    font-size: 18px;
  }
}
</style>

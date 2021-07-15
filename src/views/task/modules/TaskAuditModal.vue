<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    class="modal-container"
  >
    <div class="form-container">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        layout="horizontal"
        :label-col="{ xs: { span: 24 }, sm: { span: 3 } }"
        :wrapper-col="{ xs: { span: 24 }, sm: { span: 20 } }"
      >
        <a-form-model-item label="任务名称" prop="taskName">
          <a-input placeholder="请输入任务名称" v-model.trim="form.taskName" disabled />
        </a-form-model-item>
        <a-form-model-item label="任务描述" prop="taskDesc">
          <a-textarea
            placeholder="请输入任务描述"
            v-model.trim="form.taskDesc"
            :auto-size="{ minRows: 3, maxRows: 6 }"
            disabled
          />
        </a-form-model-item>
        <a-form-model-item label="任务审核" prop="auditStatus">
          <a-radio-group v-model="form.auditStatus" @change="onChangeAuditStatus" :disabled="submitDisabled">
            <a-radio :value="2">审核通过</a-radio>
            <a-radio :value="3">审核不通过</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="审核意见" prop="auditReason">
          <a-textarea
            placeholder="请输入试卷审核不通过原因"
            v-model.trim="form.auditReason"
            :auto-size="{ minRows: 2, maxRows: 6 }"
            :disabled="submitDisabled"
          />
        </a-form-model-item>
      </a-form-model>
    </div>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleOk" :disabled="submitDisabled">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import { taskApiList } from '@/api/api'
export default {
  name: 'TaskAuditModal', //任务审核弹框
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      title: '任务审核',
      visible: false,
      confirmLoading: false,
      submitDisabled: false, //是否可以编辑
      form: {
        id: undefined,
        taskName: undefined,
        taskDesc: undefined,
        auditStatus: undefined, //4为通过审核 5为不通过审核
        auditReason: undefined
      },
      rules: {
        taskName: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
        taskDesc: [{ required: true, message: '请输入任务描述', trigger: 'change' }],
        auditStatus: [{ required: true, message: '请选择任务是否通过审核', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {},
  watch: {},
  methods: {
    onChangeAuditStatus(e) {
      if (e.target.value == 2) {
        this.form.auditReason = '审核通过'
      }
      if (e.target.value == 3) {
        this.form.auditReason = '审核不通过'
      }
    },
    closeModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      this.closeModal()
    },
    handleOk() {
      this.doFormSubmit()
    },
    doResetForm() {
      this.form.id = undefined
      this.form.taskName = undefined
      this.form.taskDesc = undefined
      this.form.auditStatus = 2
      this.form.auditReason = '审核通过'
      this.submitDisabled = false
    },
    doSetForm(record) {
      if (!!record.id) {
        this.form.id = record.id
        this.form.taskName = record.taskName
        this.form.taskDesc = record.taskDesc
        this.form.auditStatus = 2
        this.form.auditReason = '审核通过'
        this.submitDisabled = false
      }
    },
    edit(record) {
      this.initForm(record)
      this.showModal()
    },
    initForm(record) {
      if (!!record && !!record.id) {
        this.doSetForm(record)
      } else {
        this.doResetForm()
      }
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        } else {
          return false
        }
      })
    },
    doSendFormDataSubmit() {
      let opts = {
        id: this.id,
        ...this.form
      }
      this.auditPaper(opts)
    },
    auditPaper(opts) {
      if (!!opts.id) {
        this.submitDisabled = true
        taskApiList.auditTask(opts).then(res => {
          this.submitDisabled = false
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '任务审核成功！')
            setTimeout(() => {
              this.$emit('renovate', this.form)
              this.handleCancel()
            }, 0)
          } else {
            this.$message.error(res.message || '任务审核失败！')
          }
        })
      } else {
        this.$message.error('任务ID不存在，请重新刷新页面！')
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.modal-container {
  .form-container {
    .ant-btn-link {
      padding: 6px 15px;
      box-sizing: content-box;
    }
  }
}
</style>

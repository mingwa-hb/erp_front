<template>
  <a-modal
    :title="title"
    width="40%"
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
        :label-col="{ span: 3 }"
        :wrapper-col="{ span: 19, offset: 1 }"
      >
        <a-form-model-item label="试卷名称" prop="paperName">
          <a-input placeholder="请输入试卷名称" v-model.trim="form.paperName" disabled />
        </a-form-model-item>
        <a-form-model-item label="试卷审核" prop="auditStatus">
          <a-radio-group v-model="form.auditStatus" @change="onChangeAuditStatus" :disabled="submitDisabled">
            <a-radio :value="4">审核通过</a-radio>
            <a-radio :value="5">审核不通过</a-radio>
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
import { tikuApiList } from '@/api/api'
export default {
  name: 'PaperAuditModal', //试卷审核弹框
  mixins: [],
  components: {},
  props: {},
  data() {
    return {
      title: '试卷审核',
      visible: false,
      confirmLoading: false,
      submitDisabled: false, //是否可以编辑
      form: {
        paperName: undefined,
        auditStatus: undefined, //4为通过审核 5为不通过审核
        auditReason: undefined
      },
      rules: {
        paperName: [{ required: true, message: '请输入试卷名称', trigger: 'change' }],
        auditStatus: [{ required: true, message: '请选择试卷是否通过审核', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {},
  watch: {},
  methods: {
    onChangeAuditStatus(e) {
      if (e.target.value == 4) {
        this.form.auditReason = '审核通过'
      }
      if (e.target.value == 5) {
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
    setPaperInfo(record) {
      if (!!record.id) {
        this.form.paperId = record.id
        this.form.paperName = record.paperName
        this.form.auditStatus = record.auditStatus == 3 ? 4 : record.auditStatus
        this.form.auditReason = record.auditStatus == 3 ? '审核通过' : record.auditReason
        this.submitDisabled = record.auditStatus == 3 ? false : true
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
      this.auditPaper()
    },
    auditPaper() {
      let opts = {
        paperId: this.paperId,
        ...this.form
      }
      if (!!opts.paperId) {
        tikuApiList.auditTp(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '试卷审核成功！')
            setTimeout(() => {
              this.handleCancel()
              this.$emit('renovate', this.form)
            }, 0)
          } else {
            this.$message.error(res.message || '试卷审核失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新页面！')
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.modal-container {
  .form-container {
    .ant-form-item {
      margin-bottom: 4px;
    }
    .ant-btn-link {
      padding: 6px 15px;
      box-sizing: content-box;
    }
  }
}
</style>

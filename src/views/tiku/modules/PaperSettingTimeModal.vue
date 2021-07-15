<template>
  <a-modal
    :title="title"
    width="30%"
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
        :wrapper-col="{ span: 18, offset: 1 }"
      >
        <a-form-model-item label="试卷名称" prop="paperName">
          <a-input v-model.trim="form.paperName" disabled />
        </a-form-model-item>
        <a-form-model-item label="试卷时间" prop="totalTime">
          <a-input addon-after="分钟" v-model="form.totalTime" :min="1" :max="240" />
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-modal>
</template>

<script>
import { tikuApiList } from '@/api/api'
export default {
  name: 'PaperSettingTimeModal', //试卷设置时间弹框
  mixins: [],
  components: {},
  props: {
    paperBaseData: {
      type: Object,
      default: () => {
        return null
      },
      required: false
    }
  },
  data() {
    let validatorTime = (rule, value, callback) => {
      // 如果为空值，就抛出错误
      if (/^\d+(\.\d+)?$/.test(value)) {
        callback()
      } else {
        callback(new Error('试卷时间只能为数字!'))
      }
    }
    return {
      title: '设置试卷考试时长',
      visible: false,
      confirmLoading: false,
      form: {
        paperName: undefined,
        totalTime: undefined
      },
      rules: {
        paperName: [{ required: true, message: '请输入试卷名称', trigger: 'change' }],
        totalTime: [
          {
            required: true,
            message: '试卷时间不能为空',
            trigger: 'change'
          },
          {
            type: 'number',
            validator: validatorTime,
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {},
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    }
  },
  watch: {
    paperBaseData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          this.form.paperName = this.paperBaseData.paperName
          this.form.totalTime = this.paperBaseData.totalTime * 1
        }
      }
    }
  },
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
    handleOk() {
      this.doFormSubmit()
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
      this.updatePaperTime()
    },
    updatePaperTime() {
      let opts = {
        paperId: this.paperId,
        ...this.form
      }
      if (!!opts.paperId) {
        tikuApiList.setTpTime(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '设置时间成功！')
            setTimeout(() => {
              this.handleCancel()
              this.$emit('afterSetTime', this.form)
            }, 0)
          } else {
            this.$message.error(res.message || '设置时间失败！')
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

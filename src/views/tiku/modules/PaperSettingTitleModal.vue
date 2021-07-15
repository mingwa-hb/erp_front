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
          <a-input placeholder="请输入试卷名称" v-model.trim="form.paperName" disabled />
        </a-form-model-item>
        <a-form-model-item label="主标题">
          <a-input placeholder="请输入试卷主标题" v-model="form.mainTitle" :min="1" :max="240" />
        </a-form-model-item>
        <a-form-model-item label="副标题">
          <a-input placeholder="请输入试卷副标题" v-model="form.secondTitle" :min="1" :max="240" />
        </a-form-model-item>
      </a-form-model>
    </div>
  </a-modal>
</template>

<script>
import { tikuApiList } from '@/api/api'
export default {
  name: 'PaperSettingTitleModal', //试卷设置标题弹框
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
      title: '设置试卷标题',
      visible: false,
      confirmLoading: false,
      form: {
        paperName: undefined,
        mainTitle: undefined,
        secondTitle: undefined
      },
      rules: {
        paperName: [{ required: true, message: '请输入试卷名称', trigger: 'change' }]
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
          // this.form.totalTime = this.paperBaseData.totalTime * 1
          this.form.mainTitle = this.paperBaseData.mainTitle
          this.form.secondTitle = this.paperBaseData.secondTitle
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
        tikuApiList.setTpTitle(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '设置标题成功！')
            setTimeout(() => {
              this.handleCancel()
              this.$emit('afterSetTime', this.form)
            }, 0)
          } else {
            this.$message.error(res.message || '设置标题失败！')
          }
        })
      } else {
        this.$message.error('试卷ID不存在，请重新刷新页面！')
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

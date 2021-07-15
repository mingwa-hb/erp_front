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
    <!-- 试题信息 -->
    <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
      <a-form-model-item label="试题题型" prop="questionTypeId">
        <a-select placeholder="请选择试题题型" v-model.trim="form.questionTypeId">
          <a-select-option v-for="item in questionTypeList.slice(1)" :key="item.itemValue">{{
            item.itemText
          }}</a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="难易程度" prop="hardLevelId">
        <a-select placeholder="请选择试题难易程度" v-model.trim="form.hardLevelId" :disabled="hardLevelDisabled">
          <a-select-option
            v-for="item in difficultyTypeList.slice(0)"
            :key="item.itemValue"
            :disabled="hardLevelDisabled"
            >{{ item.itemText }}</a-select-option
          >
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="试题数量" prop="num">
        <a-input placeholder="请输入试题数量" v-model.trim="form.num">
          <a-icon slot="addonBefore" type="minus" @click="handleMinus" />
          <a-icon slot="addonAfter" type="plus" @click="handlePlus" />
        </a-input>
      </a-form-model-item>
      <a-form-model-item label="试题最大数量" prop="maxNum">
        <a-input placeholder="请输入试题数量" v-model.trim="curMaxNum" readOnly disabled>
          <span slot="addonAfter">道题</span>
        </a-input>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import mixin_tiku from '../mixins/TikuListMixinForAuto'

export default {
  name: 'ExercisesAddQuestionTypeModal', //习题弹框-添加|修改题型数量
  mixins: [mixin_tiku],
  components: {},
  props: {
    questionMaxNum: {
      type: Number,
      default: 0,
      required: false
    }
  },
  data() {
    let that = this
    return {
      pageModalType: 'add',
      visible: false,
      confirmLoading: false,
      form: {
        id: undefined,
        questionType: undefined, //试题类型
        questionTypeId: undefined, //试题类型
        hardLevel: '全部', //试题难易程度
        hardLevelId: '0', //试题难易程度
        num: 0, //试题数量
        maxNum: this.questionMaxNum //试题最大数量
      },
      rules: {
        questionTypeId: [{ required: true, message: '试题类型不能为空', trigger: 'change' }],
        hardLevelId: [{ required: true, message: '试题难易程度不能为空', trigger: 'change' }],
        num: [
          { required: true, message: '试题数量不能为空', trigger: 'change' },
          {
            type: 'number',
            validator: (rule, value, callback) => {
              // 如果为空值，就抛出错误
              if (/(^[1-9]\d*$)/.test(value)) {
                if (value * 1 > that.form.maxNum) {
                  callback(new Error('试题数量不能大于试题最大数量!'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('试题数量只能为正整数!'))
              }
            },
            trigger: 'change'
          }
        ],
        maxNum: [{ required: true, message: '试题最大数量不能为空', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {
    title() {
      let res = '添加题型'
      res = this.pageModalType == 'edit' ? '编辑题型' : '添加题型'
      return res
    },
    hardLevelDisabled() {
      let res = true
      return res
    },
    curMaxNum() {
      return this.questionMaxNum
    }
  },
  watch: {
    curMaxNum: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.form.maxNum = newV
      }
    },
    'form.questionTypeId': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          let res = _.find(this.questionTypeList, ['itemValue', newV])
          this.form.questionType = res.itemText

          //获取试题最大数量
          this.handleChangeGetMaxNum()
        }
      }
    },
    'form.hardLevelId': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          let res = _.find(this.difficultyTypeList, ['itemValue', newV])
          this.form.hardLevel = res.itemText

          //获取试题最大数量
          !!this.form.questionTypeId && this.form.questionTypeId != '0' && this.handleChangeGetMaxNum()
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
      this.$nextTick(() => {
        this.doResetForm()
      })
    },
    handleChangeGetMaxNum() {
      let data = _.pick(this.form, ['questionType', 'questionTypeId', 'hardLevel', 'hardLevelId'])
      if (!!data.questionTypeId) {
        // console.log('开始获取试题最大数量')
        this.$emit('getQuestionMaxNum', data)
      } else {
        this.$message.error('试题类型不能为空，无法获取试题最大数量！请选择试题类型！')
      }
    },
    doResetForm() {
      this.form.questionType = undefined
      this.form.questionTypeId = undefined
      this.form.hardLevel = '全部'
      this.form.hardLevelId = '0'
      this.form.num = 0
      this.form.maxNum = 0
      this.$refs.ruleForm.resetFields()
      this.$forceUpdate()
    },
    handleOk() {
      this.doFormSubmit()
    },
    handleMinus() {
      if (this.form.num > 0) {
        this.form.num--
      } else {
        this.form.num = 0
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField(['num'])
      })
    },
    handlePlus() {
      if (this.form.num >= 0) {
        this.form.num++
      } else {
        this.form.num = 0
      }
      this.$nextTick(() => {
        this.$refs.ruleForm.validateField(['num'])
      })
    },
    add() {
      this.pageModalType = 'add'
      this.showModal()
      this.$nextTick(() => {
        this.doResetForm()
      })
    },
    edit(record) {
      this.pageModalType = 'edit'
      this.showModal()
      this.$nextTick(() => {
        this.doResetForm()
        this.initFormVal(record)
      })
    },
    initFormVal(record) {
      Object.assign(this.form, {
        id: record.id,
        questionTypeId: record.questionTypeId,
        hardLevelId: record.hardLevelId,
        num: record.num,
        maxNum: record.maxNum
      })
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
      this.form.maxNum = this.curMaxNum
      this.$emit('ok', this.form)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped></style>

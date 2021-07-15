<template>
  <a-modal
    :title="title"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种/等级名称">
          <a-input
            placeholder="请输入工种/等级名称"
            v-decorator="['workType', validatorRules.workType]"
            :maxLength="36"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="工种学习达标时长">
          <a-input
            placeholder="请输入工种学习达标时长"
            v-decorator="['standardHour', validatorRules.standardHour]"
            @change="Rules"
            oninput="this.value=this.value.replace(/\D/g,'')"
            :maxLength="5"
          />
        </a-form-item>

        <a-form-item v-if="show == 2" :labelCol="labelCol" :wrapperCol="wrapperCol" label="是否有实操">
          <a-input
            placeholder="是否有实操"
            v-decorator="['haveOperationExam', validatorRules.haveOperationExam]"
            :maxLength="36"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="理论合格分数">
          <a-input
            placeholder="理论合格分数"
            v-decorator="['theoryPassScore', validatorRules.theoryPassScore]"
            oninput="this.value=this.value.replace(/\D/g,'')"
            @change="Rules"
            :maxLength="5"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实操合格分数">
          <a-input
            placeholder="实操合格分数"
            v-decorator="['operationPassScore', validatorRules.operationPassScore]"
            oninput="this.value=this.value.replace(/\D/g,'')"
            @change="Rules"
            :maxLength="5"
          />
        </a-form-item>

        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="金额">
          <a-input placeholder="请输入金额" v-decorator="['amount', validatorRules.amount]" :maxLength="10" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { addWorkType, editWorkType } from '@/api/api'

export default {
  name: 'StuWorkTypeModal',
  components: {},
  data() {
    return {
      show: 1,
      title: '操作',
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        code: {
          validateFirst: true,
          rules: [
            { required: true, message: '请输入工种/等级名称!' },
            {
              validator: (rule, value, callback) => {
                let pattern = /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/
                if (!pattern.test(value)) {
                  callback('编码必须以字母开头，可包含数字、下划线、横杠')
                } else {
                  validateDuplicateValue('stu_work_type', 'workType', value, this.model.id, callback)
                }
              },
            },
          ],
        },
        workType: { rules: [{ required: true, message: '请输入工种/等级名称!' }] },
        standardHour: { rules: [{ required: true, message: '请输入工种学习达标时长(分钟)!' }] },
        haveOperationExam: { rules: [{ required: true, message: '请输入是否有实操!' }] },
        theoryPassScore: { rules: [{ required: true, message: '请输入理论合格分数!' }] },
        operationPassScore: { rules: [{ required: false, message: '请输入实操合格分数!' }] },
        amount: { rules: [{ required: true, message: '请输入金额!' }, { validator: this.validateAmount }] },
      },
      url: {
        add: '/erp/stuWorkType/add',
        edit: '/erp/stuWorkType/edit',
      },
    }
  },
  created() {},
  methods: {
    Rules(val) {
      let value = val.target.value
      let num
      for (let i = 0; i < value.length; i++) {
        if (value[i] != 0) {
          num = i
          val.target.value = value.slice(num)
          return
        }
      }
    },

    add() {
      this.edit({})
    },
    edit(record) {
      console.log(record)
      if (record.id) {
        this.visiblekey = true
      } else {
        this.visiblekey = false
      }
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, [
            'workType',
            'standardHour',
            'haveOperationExam',
            'theoryPassScore',
            'operationPassScore',
            'amount',
          ])
        )
      })
    },
    // 确定
    handleOk() {
      const that = this
      let close = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
        // console.log(err);
        console.log(values)
        if (!err) {
          that.confirmLoading = true
          values.workType = (values.workType || '').trim()
          values.standardHour = (values.standardHour || '').trim()
          values.theoryPassScore = (values.theoryPassScore || '').trim()
          values.operationPassScore = (values.operationPassScore || '').trim()
          if (!!values.operationPassScore) {
            values.haveOperationExam = 1
          } else {
            values.haveOperationExam = 2
          }
          if (typeof values.amount != 'number') {
            values.amount = (values.amount || '').trim()
          }
          console.log(values)
          let formData = Object.assign(this.model, values)
          let obj
          if (!this.model.id) {
            obj = addWorkType(formData)
          } else {
            obj = editWorkType(formData)
          }
          obj
            .then((res) => {
              if (res.success) {
                close = true
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              if (close) {
                that.close()
              }
            })
        }
      })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      this.$emit('close')
      this.visible = false
    },
    handleCompanyChange(val) {},

    //校验金额格式
    validateAmount(rule, value, callback) {
      if (value) {
        var myreg = /^[+]{0,1}(\d+)$/
        if (!myreg.test(value)) {
          callback('请输入正确的金额')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
  },
}
</script>

<style lang="less" scoped></style>

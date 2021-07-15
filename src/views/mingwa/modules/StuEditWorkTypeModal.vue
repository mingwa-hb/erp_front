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
          <a-input :disabled="editDisabled" v-decorator="['workTypeName', validatorRules.workTypeName]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="原价格（元）">
          <a-input :disabled="editDisabled" v-decorator="['price', validatorRules.price]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="修改后价格（元）">
          <a-input placeholder="请输入修改后价格" v-decorator="['curPrice', validatorRules.curPrice]" />
        </a-form-item>
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
          <a-textarea
            placeholder="请输入备注信息，最多200字！"
            v-decorator="['remark', validatorRules.remark]"
            :rows="4"
          />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { updateWorkTypePrice } from '@/api/api'

export default {
  name: 'StuEditWorkTypeModal',
  components: {},
  data() {
    return {
      title: '修改工种价格',
      editDisabled: true,
      visible: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },

      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        workTypeName: { rules: [{ required: false, message: '工种不能为空!' }] },
        price: { rules: [{ required: false, message: '价格不能为空!' }] },
        curPrice: { rules: [{ required: true, message: '请输入修改后价格!' }, { validator: this.validateAmount }] },
        remark: {
          rules: [
            { required: false, message: '请输入备注!' },
            {
              validator: (rule, value, callback) => {
                if (!!value && value.length > 200) {
                  callback('备注不能超过200个字！')
                } else {
                  // validateDuplicateValue('stu_work_type', 'workType', value, this.model.id, callback)
                  callback()
                }
              }
            }
          ]
        }
      }
      // url: {
      //   add: '/erp/stuWorkType/add',
      //   edit: '/erp/stuWorkType/edit'
      // }
    }
  },
  created() {},
  methods: {
    // add() {
    //   this.edit({})
    // },
    edit(record) {
      this.form.resetFields()
      this.model = {}
      this.visible = true
      this.fillRecord(record)
    },
    fillRecord(record) {
      this.model = Object.assign({}, record)
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.model, 'workTypeName', 'price', 'curPrice', 'remark'))
      })
    },
    // 确定
    handleOk() {
      let that = this
      let close = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let formData = Object.assign(that.model, values)
          formData = pick(formData, 'id', 'curPrice', 'remark')
          // console.log(formData)
          if (!!that.model.id) {
            updateWorkTypePrice(formData)
              .then(res => {
                if (res.success) {
                  close = true
                  that.$message.success(res.message)
                  setTimeout(() => {
                    that.$emit('ok')
                  }, 300)
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
          } else {
            that.$message.warning('此工种的ID号为空，请联系技术开发人员！')
          }
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
    //校验金额格式
    validateAmount(rule, value, callback) {
      let moneyReg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
      if (value && !moneyReg.test(value)) {
        callback('请输入正确的金额')
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="less" scoped></style>

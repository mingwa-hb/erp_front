<template>
  <div>
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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分组名称">
            <!-- :disabled="!!model.id" -->
            <!-- :readOnly="!!model.id" -->
            <a-input placeholder="请输入分组名称" v-decorator="['name', validatorRules.name]" :maxLength="60" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分组名称">
            <a-input placeholder="请输入分组名称" v-decorator="['alias', {}]" :maxLength="100" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="分组描述">
            <a-textarea
              placeholder="请输入分组描述"
              v-decorator="['remark', validatorRules.remark]"
              :rows="4"
              :maxLength="100"
            />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { addStockGroup, editStockGroup } from '@/api/api'

export default {
  name: 'StockGroupModal',
  components: {
  },
  data() {
    return {
      title: '操作',
      visible: false,
      stockGroupObj: {},
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
            { required: true, message: '请输入数据源编码!' },
            {
              validator: (rule, value, callback) => {
                let pattern = /^[a-z|A-Z][a-z|A-Z\d_-]{0,}$/
                if (!pattern.test(value)) {
                  callback('编码必须以字母开头，可包含数字、下划线、横杠')
                } else {
                  validateDuplicateValue('stu_company', 'name', value, this.model.id, callback)
                }
              },
            },
          ],
        },
        name: { rules: [{ required: true, message: '请输入公司名称!' }] },
        remark: { rules: [{ required: false, message: '请输入分组描述!' }] },
      },
      url: {
        add: '/erp/stockGroup/add',
        edit: '/erp/stockGroup/edit',
      },
      businesslicense: [],
      differentMsg: '',
      differentMsgVisible: false,
    }
  },
  created() {},
  methods: {
    handleChange(value) {
      this.model.status = value
    },
    add() {
      this.businesslicense = []
      this.edit({})
    },
    edit(record) {
      if (record.id) {
        this.visiblekey = true
        // setTimeout(() => {
        //   this.businesslicense = record.businesslicense
        // }, 5)
      } else {
        this.visiblekey = false
      }
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'name', 'alisa', 'remark')
        )
      })
    },
    // 确定
    handleOk() {
      const that = this
      let close = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
      if (!err) {
        that.confirmLoading = true
        values.name = (values.name || '').trim()
        values.remark = (values.remark || '').trim()
        values.alias = (values.alias || '').trim()
        let formData = Object.assign(this.model, values)
        let obj
        if (!this.model.id) {
            obj = addStockGroup(formData)
        } else {
            obj = editStockGroup(formData)
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
      this.businesslicense = []
      this.$emit('close')
      this.visible = false
    },

    handleOkDifferent() {
      this.setFormFieldsValue()
    },

    setFormFieldsValue() {
      if (this.stockGroupObj.name) {
        this.form.setFieldsValue({ name: this.stockGroupObj.name })
      }
      if (this.stockGroupObj.remark) {
        this.form.setFieldsValue({ remark: this.stockGroupObj.remark })
      }
      if(this.stockGroupObj.alias){
          this.form.setFieldsValue({alias: this.stockGroupObj.alias});
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
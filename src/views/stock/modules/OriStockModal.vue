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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="代码">
            <!-- :disabled="!!model.id" -->
            <!-- :readOnly="!!model.id" -->
            <a-input placeholder="请输入代码" v-decorator="['code', validatorRules.code]" :maxLength="30" />
          </a-form-item>
          <a-form-item label="请选择分组" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <j-select-group placeholder="请选择分组" :multiple="false" v-decorator="['groupId', {}]" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
            <a-input placeholder="" v-decorator="['name', {}]" :maxLength="100" :disabled="true"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="区域">
            <a-input placeholder="" v-decorator="['area', {}]" :maxLength="100" :disabled="true"/>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="当前价格">
            <a-input placeholder="" v-decorator="['price', {}]" :maxLength="100" :disabled="true"/>
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
import { addStock, editStock } from '@/api/api'
import JSelectGroup from '@/components/jeecgbiz/JSelectGroup'

export default {
  name: 'OriStockModal',
  components: {
    JSelectGroup,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      stockObj: {},
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
        code: { rules: [{ required: true, message: '请输入代码!' }] },
        groupId: { rules: [{ required: true, message: '请选择分组!' }] },
        remark: { rules: [{ required: false, message: '请输入描述!' }] },
      },
      url: {
        add: '/erp/oriStock/add',
        edit: '/erp/oriStock/edit',
      },
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
          pick(this.model, 'code', 'name', 'remark','area','price')
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
        values.code = (values.code || '').trim()
        values.name = (values.name || '').trim()
        values.remark = (values.remark || '').trim()
        let formData = Object.assign(this.model, values)
        let obj
        if (!this.model.id) {
            obj = addStock(formData)
        } else {
            obj = editStock(formData)
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
        this.form.setFieldsValue({ name: this.stockObj.name })
      }
      if (this.stockGroupObj.remark) {
        this.form.setFieldsValue({ remark: this.stockObj.remark })
      }
      if(this.stockGroupObj.area){
          this.form.setFieldsValue({alias: this.stockObj.aareaias})
      }
       if (this.stockGroupObj.price) {
        this.form.setFieldsValue({ name: this.stockObj.price })
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
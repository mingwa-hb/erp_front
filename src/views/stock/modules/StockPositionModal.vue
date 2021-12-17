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
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
              <a-form-item label="请选择股票" :labelCol="labelCol" :wrapperCol="wrapperCol">
                <j-select-group placeholder="请选择股票" :multiple="false" v-decorator="['symbol', validatorRules.groupId]" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="买入数量">
            <a-input placeholder="" v-decorator="['num', {}]" :maxLength="100" :disabled="true"/>
          </a-form-item>
          </a-col>
          </a-row>
           <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="买入价格" >
            <a-input placeholder="" v-decorator="['buyPrice', {}]" :maxLength="100" :disabled="!!model.id"/>
          </a-form-item>
          </a-col>
          </a-row>
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="卖出价格" v-if="model.id">>
            <a-input placeholder="" v-decorator="['price', {}]" :maxLength="100" />
          </a-form-item>
          </a-col>
          </a-row>
          <a-row style="width: 80%; margin-left: 9%">
            <a-col :span="18">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="买入理由">
            <a-textarea
              placeholder="买入理由"
              v-decorator="['remark', validatorRules.remark]"
              :rows="4"
              :maxLength="100"
            />
          </a-form-item>
           </a-col>
          </a-row>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { httpAction, postAction,getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import { addPosition, editPosition } from '@/api/api'
//import JSelectSymbol from '@/components/jeecgbiz/JSelectSymbol'

export default {
  name: 'StockPositionModal',
  components: {
    //JSelectSymbol,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      stockObj: {},
      groupId:'',
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
        symbol: { rules: [{ required: true, message: '请输入代码!' }] },
        groupId: { rules: [{ required: true, message: '请选择分组!' }] },
        remark: { rules: [{ required: true, message: '请输入描述!' }] },
      },
      url: {
        add: '/erp/oriStock/add',
        edit: '/erp/oriStock/edit',
        getStockInfo: '/erp/stockApi/getStockInfo',
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
      this.groupId = record.groupId
      this.form.resetFields()
      this.model = Object.assign({}, record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(this.model, 'symbol', 'name', 'remark','area','price','groupId')
        )
      })
      if (record.hasOwnProperty('id')){
        this.fillGroupField();
      }
    },
    fillGroupField(){
      setTimeout(() => {
        getAction(`/erp/stockGroup/getNameById/${this.groupId}`)
          .then((res) => {
            if (res.success) {
              document.getElementsByClassName('ant-select-selection__choice__content').innerHTML = res.result
            }
          })
          .catch(() => {})
      }, 400)
    },
    getStockInfo(){
      var stockCode = this.form.getFieldValue('symbol')
      var that = this;
      if(!!stockCode){
          getAction(that.url.getStockInfo, { symbol: stockCode }).then((res) => {
          if (res.success) {
            that.$message.success(res.message)
                 that.form.setFieldsValue({name:res.result[0]});
                 that.form.setFieldsValue({area:res.result[1]});
                 that.form.setFieldsValue({ price: res.result[2]});
              } else {
                that.$message.warning(res.message)
              }
          })
      }
    },
    // 确定
    handleOk() {
      const that = this
      let close = false
      // 触发表单验证
      this.form.validateFields((err, values) => {
      if (!err) {
        that.confirmLoading = true
        values.symbol = (values.symbol || '').trim()
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
        this.form.setFieldsValue({ price: this.stockObj.price })
      }
    },
  },
}
</script>

<style lang="less" scoped></style>
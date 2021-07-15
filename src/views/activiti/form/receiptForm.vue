<template>
  <div>
    <a-modal
      :title="title"
      :width="800"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="取消"
      okText="提交"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收款单号">
            <a-input placeholder="" v-model="mwBillReceipt.receiptNo" disabled />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="收款回单">
            <j-upload v-model="mwBillReceipt.receiptPaper" @change="handleChangeContract"></j-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核意见">
            <a-select placeholder="" v-model="mwBillReceipt.auditReason" @change="handleSelectChange">
              <a-select-option value="1">审核通过</a-select-option>
              <a-select-option value="2">审核不通过</a-select-option>
            </a-select>
          </a-form-item>
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退回节点">
            <a-select placeholder="" v-model="mwBillReceipt.receiptMethod" @change="handleSelectChange">
              <a-select-option value="1">业支提交</a-select-option>
              <a-select-option value="2">会计初审</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-textarea placeholder="请输入备注" :rows="3" v-model.trim="form.remark" />
          </a-form-model-item> -->
          <!-- <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核记录">
            <j-upload v-model="mwBillReceipt.payPaper" @change="handleChangeContract"></j-upload>
          </a-form-item> -->
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { putAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import { addStudent, editStudent } from '@/api/api'
import JImageUpload from '../../../components/jeecg/JImageUpload'
import JFileUpload from '../../../components/jeecg/JFileUpload'
import moment from 'moment'
import JDate from '@/components/jeecg/JDate'
import { getAction } from '@/api/manage'
import { registerHelper } from 'codemirror'
import JUpload from '@/components/jeecg/JUpload'
// const { getFieldDecorator } = this.props.form;

export default {
  name: 'receiptForm', //收款单管理审核表单区域
  props: ['companyId'],
  props: {
    /*全局禁用，可表示查看*/
    disabled: {
      type: Boolean,
      default: false,
      required: false,
    },
    /*流程数据*/
    processData: {
      type: Object,
      default: () => {
        return {}
      },
      required: false,
    },
    /*是否新增*/
    isNew: { type: Boolean, default: false, required: false },
    /*是否处理流程*/
    task: { type: Boolean, default: false, required: false },
  },
  components: {
    JSelectCompany,
    JImageUpload,
    JFileUpload,
    JDate,
    JUpload,
  },
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
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
      url: {
        add: '/erp/mwBillReceipt/add',
        edit: '/erp/mwBillReceipt/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        getForm: '/actBusiness/getForm',
        addApply: '/actBusiness/add',
        editForm: '/actBusiness/editForm',
      },
      description: '流程表单demo，按例开发表单。需在 activitiMixin.js 中加入写好的表单',
      data: {},
      btndisabled: false,
      value: 1,
      //   dateFormat: 'YYYY-MM-DD',
      mwBillReceipt: {
        receiptNo: undefined, //收款单号
        receiptPaper: undefined, //收款回单
        auditReason: undefined, //审核意见
        // receiptType: undefined, //退回节点
        // receiptAmount: undefined, //备注
        id: undefined,
      },
    }
  },
  watch: {
    companyId: function (newVel, oldVel) {
      this.mwBillReceipt.companyId = newVel
    },
  },
  created() {
    this.mwBillReceipt.contractNo = this.$route.query.contractNo
    this.mwBillReceipt.companyName = this.$route.query.companyName
    console.log('流程数据', this.processData)
    if (!this.isNew) {
      this.init()
    }
  },
  computed: {},
  methods: {
    /*回显数据*/
    init() {
      this.btndisabled = true
      var r = this.processData
      this.getAction(this.url.getForm, {
        tableId: r.tableId,
        tableName: r.tableName,
      }).then((res) => {
        if (res.success) {
          let formData = res.result
          formData.tableName = r.tableName
          this.data = formData
          console.log('表单回显数据', this.data)
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(this.data, 'name'))
          })
          this.btndisabled = false
        } else {
          this.$message.error(res.message)
        }
      })
    },

    // handler
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          let formData = Object.assign(this.data || {}, values)
          formData.procDefId = this.processData.id
          formData.procDeTitle = this.processData.name
          if (!formData.tableName) formData.tableName = this.processData.businessTable
          formData.filedNames = _.keys(values).join(',')
          console.log('formData', values)

          var url = this.url.addApply
          if (!this.isNew) {
            url = this.url.editForm
          }
          this.btndisabled = true
          this.postFormAction(url, formData)
            .then((res) => {
              if (res.success) {
                this.$message.success('保存成功！')
                //todo 将表单的数据传给父组件
                this.$emit('afterSubmit', formData)
              } else {
                this.$message.error(res.message)
              }
            })
            .finally(() => {
              this.btndisabled = false
            })
        }
      })
    },
    close() {
      //todo 关闭后的回调
      this.$emit('close')
      ;(this.visible = false), (this.disableSubmit = false)
    },
    /*通过审批*/
    passTask() {
      this.$emit('passTask')
    },
    /*驳回审批*/
    backTask() {
      this.$emit('backTask')
    },


    audit(record) {
      this.visible = true
      this.mwBillReceipt.receiptNo = record.receiptNo
      this.mwBillReceipt.receiptPaper = record.receiptPaper
      this.mwBillReceipt.auditReason = record.auditReason
    },
    // 确定
    handleOk() {
      this.visible = false
      this.$emit('ok')
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    // close() {
    //   ;(this.visible = false), (this.disableSubmit = false)
    // },

    moment,

    onChange(e) {
      // console.log(e.target.value)
    },

    handleSelectChange(value) {
      // console.log(value)
    },

    handleChangeContract(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
    },

    onChangedate(date, dateString) {
      // console.log(date, dateString)
    },
  },
}
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
</style>

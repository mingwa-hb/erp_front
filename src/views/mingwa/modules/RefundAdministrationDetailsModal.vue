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
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同编号">
            <a-input placeholder="" v-model="refund.contractNo" disabled />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="公司名称">
            <a-input placeholder="" v-model="refund.companyName" disabled />
          </a-form-item>
          
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="申请退款金额">
            <a-input placeholder="" v-model="refund.refundApplyAmount" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="客户开户行名称">
            <a-input placeholder="" v-model="refund.userAccountBank" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="客户银行账号">
            <a-input placeholder="" v-model="refund.userAccountNo" />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退款原因说明">
            <a-textarea placeholder="" v-model="refund.refundReason" :rows="3" />
          </a-form-item>

          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退款学员明细">
            <j-upload v-model="refund.refundDetailFile" @change="handleChangeContract"></j-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退款申请材料">
            <j-upload v-model="refund.applyFile" @change="handleChangeContract"></j-upload>
            <a-button type="primary">下载</a-button>
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import { getAction, postAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import { addStudent, editStudent } from '@/api/api'
import JImageUpload from '../../../components/jeecg/JImageUpload'
import JFileUpload from '../../../components/jeecg/JFileUpload'
import moment from 'moment'
import JDate from '@/components/jeecg/JDate'
import { registerHelper } from 'codemirror'
import JUpload from '@/components/jeecg/JUpload'
// const { getFieldDecorator } = this.props.form;

export default {
  name: 'RefundAdministrationDetailsModal', //退款单管理详情表单区域
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
        add: '/erp/billRefund/add',
        edit: '/erp/student/edit',
        RefundNum: '/erp/billRefund/getApplyRefundNum',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
      },
      value: 1,
      //   dateFormat: 'YYYY-MM-DD',
      refund: {
        contractNo: undefined, //合同编号
        companyName: undefined, //公司名称
        refundApplyAmount: undefined, //申请退款金额
        userAccountBank: undefined, //客户开户行名称
        userAccountNo: undefined, //客户银行账号
        refundReason: undefined, //退款原因说明
        refundDetailFile:undefined, //退款学员明细
        applyFile:undefined, //退款申请材料
      },
    }
  },
  created() {
    this.refund.contractNo = this.$route.query.contractNo
    this.refund.companyName = this.$route.query.companyName
  },
  computed: {},
  methods: {
    getApplyRefundNum() {
      let contractNo = this.refund.contractNo
      getAction(this.url.RefundNum+'?contractNo='+contractNo).then((res) => {
        if (!!res.success) {
          this.refund.totalAmount=res.result.totalAmount
          this.refund.stuNum=res.result.stuNum
          this.refund.certNum=res.result.certNum
          this.refund.refundAmount=res.result.refundAmount
          this.refund.refundStuNum=res.result.refundStuNum
          this.refund.refundCertNum=res.result.refundCertNum
          this.refund.examStuNum=res.result.examStuNum
          this.refund.examCertNum=res.result.examCertNum
          this.refund.certStuNum=res.result.certStuNum
          this.refund.certCertNum=res.result.certCertNum
        }
      })
    },

    add() {
      this.refund.refundType = ''
      this.refund.refundApplyAmount = ''
      this.refund.userAccountBank = ''
      this.refund.userAccountNo = ''
      this.refund.refundReason = ''
      this.refund.refundDetailFile = ''
      this.refund.payPaper = ''
      this.refund.invoiceFile = ''
      this.refund.refundTalkFile = ''
      this.getApplyRefundNum()
      this.edit({})
    },
    edit(record) {
      this.visible = true
    },

    detail(record){
      this.visible = true
    //   this.mwBillReceipt.contractNo = record.contractNo
    //   this.mwBillReceipt.companyName = record.companyName
    //   this.mwBillReceipt.receiptType = record.receiptType
    //   this.mwBillReceipt.receiptAmount = record.receiptAmount
    //   this.mwBillReceipt.receiptMethod = record.receiptMethod
    //   this.mwBillReceipt.receiptTime = !!record.receiptTime ? moment(record.receiptTime) : null
    //   this.mwBillReceipt.payPaper = record.payPaper
    //   this.mwBillReceipt.id = record.id
    },

    // 确定
    handleOk() {
      postAction(this.url.add, this.refund).then((res) => {
        console.log(res);
        // if (res.code == 200 && !!res.success) {
        //   this.$message.success('新增成功！')
        //   setTimeout(() => {
        //     this.visible = false
        //     this.$emit('ok')
        //   }, 30)
        // } else {
        //   this.$message.warning(res.message)
        // }
      })
    },
    // 关闭
    handleCancel() {
      this.close()
    },
    close() {
      ;(this.visible = false), (this.disableSubmit = false)
    },

    moment,

    onChange(e) {
      console.log(e.target.value)
    },

    handleChangeContract(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
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

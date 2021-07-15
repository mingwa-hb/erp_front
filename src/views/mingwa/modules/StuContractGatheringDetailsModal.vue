<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
    okText="确认"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号" v-model="mwBillReceipt.contractNo" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称" v-model="mwBillReceipt.companyName" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="收款类型">
              <a-select
                placeholder="请选择收款类型"
                v-model="mwBillReceipt.receiptType"
                @change="handleSelectChange"
                disabled
              >
                <a-select-option value="1">首付款</a-select-option>
                <a-select-option value="3">尾款</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收款金额(元)">
              <a-input placeholder="请输入收款金额" v-model="mwBillReceipt.receiptAmount" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="收款开户行" prop="receiptAccountBank">
              <a-select placeholder="请选择收款开户行" v-model="mwBillReceipt.receiptAccountBank" disabled>
                <a-select-option v-for="item in compAccountsBankTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="收款银行账户" prop="receiptAccountNo">
              <a-select placeholder="请选择收款银行账户" v-model="mwBillReceipt.receiptAccountNo" disabled>
                <a-select-option v-for="item in compAccountsNoTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="收款方式">
              <a-select
                placeholder="请选择收款方式"
                v-model="mwBillReceipt.receiptMethod"
                @change="handleSelectChange"
                disabled
              >
                <a-select-option value="1">银行转账</a-select-option>
                <a-select-option value="2">微信</a-select-option>
                <a-select-option value="3">支付宝</a-select-option>
                <a-select-option value="4">现金</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="收款时间">
              <a-date-picker v-model="mwBillReceipt.receiptTime" @change="onChangedate" style="width: 100%" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="20">
            <a-form-item label="打款回单" :labelCol="fileLabelCol" :wrapperCol="filewWrapperCol">
              <j-upload v-model="mwBillReceipt.payPaper" @change="handleChangeContract" disabled></j-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="收款明细单" :labelCol="fileLabelCol" :wrapperCol="filewWrapperCol">
              <j-upload v-model="mwBillReceipt.receiptDetailFile" @change="handleChangeContract" disabled></j-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import moment from 'moment'
import pick from 'lodash.pick'

import { putAction, postAction, getAction } from '@/api/manage'
import { validateDuplicateValue } from '@/utils/util'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import { addStudent, editStudent } from '@/api/api'
import companyAccountListMixin from '@/mixins/companyAccountListMixin'
import JDate from '@/components/jeecg/JDate'
import JUpload from '@/components/jeecg/JUpload'

export default {
  name: 'StuContractGatheringDetailsModal', //合同收款单详情表单区域
  mixins: [companyAccountListMixin],
  props: ['companyId'],
  components: {
    JSelectCompany,
    JDate,
    JUpload
  },
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      fileLabelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      filewWrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        list: '/erp/mwBillReceipt/flowHistory',
        add: '/erp/mwBillReceipt/add',
        edit: '/erp/mwBillReceipt/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      },
      value: 1,
      //   dateFormat: 'YYYY-MM-DD',
      mwBillReceipt: {
        contractNo: undefined, //合同编号
        companyName: undefined, //公司名称
        companyId: undefined,
        receiptType: undefined, //收款类型
        receiptAmount: undefined, //收款金额(元)
        receiptMethod: undefined, //收款方式
        receiptTime: undefined, //收款时间
        payPaper: undefined, //打款回单
        receiptDetailFile: undefined, //收款回单
        id: undefined,
        receiptAccountBank: undefined, //收款开户行
        receiptAccountNo: undefined //收款开户行帐号
      },
      isshow: undefined
    }
  },
  watch: {
    companyId: function(newVel, oldVel) {
      this.mwBillReceipt.companyId = newVel
    }
  },
  created() {
    this.mwBillReceipt.contractNo = this.$route.query.contractNo
    this.mwBillReceipt.companyName = this.$route.query.companyName
  },
  computed: {},
  methods: {
    edit(record) {
      this.visible = true
      this.isshow = true
      this.mwBillReceipt.receiptType = record.receiptType
      this.mwBillReceipt.receiptAmount = record.receiptAmount
      this.mwBillReceipt.receiptMethod = record.receiptMethod
      this.mwBillReceipt.receiptTime = !!record.receiptTime ? moment(record.receiptTime) : null
      this.mwBillReceipt.payPaper = record.payPaper
      this.mwBillReceipt.receiptDetailFile = record.receiptDetailFile
      this.mwBillReceipt.id = record.id
      this.mwBillReceipt.receiptAccountBank = record.receiptAccountBank
      this.mwBillReceipt.receiptAccountNo = record.receiptAccountNo
    },
    detail(record) {
      this.visible = true
      this.isshow = false
      this.mwBillReceipt.contractNo = record.contractNo
      this.mwBillReceipt.companyName = record.companyName
      this.mwBillReceipt.receiptType = record.receiptType
      this.mwBillReceipt.receiptAmount = record.receiptAmount
      this.mwBillReceipt.receiptMethod = record.receiptMethod
      this.mwBillReceipt.receiptTime = !!record.receiptTime ? moment(record.receiptTime) : null
      this.mwBillReceipt.payPaper = record.payPaper
      this.mwBillReceipt.receiptDetailFile = record.receiptDetailFile
      this.mwBillReceipt.id = record.id
      this.mwBillReceipt.receiptAccountBank = record.receiptAccountBank
      this.mwBillReceipt.receiptAccountNo = record.receiptAccountNo
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
    close() {
      this.visible = false
      this.disableSubmit = false
    },
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
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
</style>

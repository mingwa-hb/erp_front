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
            <a-form-item label="客户类型">
              <a-radio-group v-model="refund.refundType" @change="onChange" disabled>
                <a-radio value="1">公司</a-radio>
                <a-radio value="2">个人</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号" v-model="refund.contractNo" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称" v-model="refund.companyName" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="已进账总金额">
              <a-input placeholder="请输入已进账总金额" v-model="refund.totalAmount" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="已进账人数">
              <a-input placeholder="请输入已进账人数" v-model="refund.stuNum" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="已进账证数">
              <a-input placeholder="请输入已进账证数" v-model="refund.certNum" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="已退费金额">
              <a-input placeholder="请输入已退费金额" v-model="refund.refundAmount" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="已退费人数">
              <a-input placeholder="请输入已退费人数" v-model="refund.refundStuNum" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="已退费证数">
              <a-input placeholder="请输入已退费证数" v-model="refund.refundCertNum" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="已考试人数">
              <a-input placeholder="请输入已考试人数" v-model="refund.examStuNum" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="已考试证数">
              <a-input placeholder="请输入已考试证数" v-model="refund.examCertNum" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="已发证人数">
              <a-input placeholder="请输入已发证人数" v-model="refund.certStuNum" disabled />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="已发证证数">
              <a-input placeholder="请输入已发证证数" v-model="refund.certCertNum" disabled /> </a-form-item
          ></a-col>
          <a-col :span="12">
            <a-form-item label="申请退款金额">
              <a-input placeholder="请输入申请退款金额" v-model="refund.refundApplyAmount" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="退款开户行" prop="refundAccountBank">
              <a-select placeholder="请选择退款开户行" v-model="refund.refundAccountBank" disabled>
                <a-select-option v-for="item in compAccountsBankTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="退款银行账户" prop="receiptAccountNo">
              <a-select placeholder="请选择退款银行账户" v-model="refund.receiptAccountNo" disabled>
                <a-select-option v-for="item in compAccountsNoTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="客户开户行">
              <a-input placeholder="请输入客户开户行" v-model="refund.userAccountBank" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="客户银行账号">
              <a-input placeholder="请输入客户银行账号" v-model="refund.userAccountNo" disabled />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item label="退款原因说明">
              <a-textarea placeholder="请输入退款原因说明" v-model="refund.refundReason" :rows="3" disabled />
            </a-form-item>
          </a-col>
          <a-col :span="12"> </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退费明细表">
              <j-upload v-model="refund.refundDetailFile" @change="handleChangeContract" disabled></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="打款银行回单">
              <j-upload v-model="refund.payPaper" @change="handleChangeContract" disabled></j-upload>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="已开发票原件">
              <j-upload v-model="refund.invoiceFile" @change="handleChangeContract" disabled></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退费沟通证据">
              <j-upload v-model="refund.refundTalkFile" @change="handleChangeContract" disabled></j-upload>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { httpAction, postActiongetAction, getAction } from '@/api/manage'
import { addStudent, editStudent } from '@/api/api'
import companyAccountListMixin from '@/mixins/companyAccountListMixin'
import JUpload from '@/components/jeecg/JUpload'

export default {
  name: 'ApplyRefundDetailsModal', //退款申请详情单
  mixins: [companyAccountListMixin],
  components: {
    JUpload
  },
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: '/erp/student/add',
        edit: '/erp/student/edit',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload'
      },
      value: 1,
      //   dateFormat: 'YYYY-MM-DD',
      refund: {
        refundType: undefined, //客户类型
        contractNo: undefined, //合同编号
        companyName: undefined, //公司名称
        companyId: undefined,
        totalAmount: undefined, //已进账总金额
        stuNum: undefined, //已进账人数
        certNum: undefined, //已进账证数
        refundAmount: undefined, //已退费金额
        refundStuNum: undefined, //已退费人数
        refundCertNum: undefined, //已退费证数
        examStuNum: undefined, //已考试人数
        examCertNum: undefined, //已考试证数
        certStuNum: undefined, //已发证人数
        certCertNum: undefined, //已发证证数
        refundApplyAmount: undefined, //申请退款金额
        userAccountBank: undefined, //客户开户行名称
        userAccountNo: undefined, //客户银行账号
        refundReason: undefined, //退款原因说明
        refundDetailFile: undefined, //退费明细表
        payPaper: undefined, //打款银行回单
        invoiceFile: undefined, //已开发票原件
        refundTalkFile: undefined, //退费沟通证据
        refundAccountBank: undefined,
        refundAccountNo: undefined
      }
    }
  },
  created() {},
  computed: {},
  methods: {
    add() {
      this.edit({})
    },
    edit(record) {
      this.visible = true
      console.log(record)
    },

    detail(record) {
      this.visible = true
      this.isdisabled = true
      this.isshow = false
      this.refund.refundType = record.refundType
      this.refund.contractNo = record.contractNo
      this.refund.companyName = record.companyName
      this.refund.totalAmount = record.totalAmount
      this.refund.stuNum = record.stuNum
      this.refund.certNum = record.certNum
      this.refund.refundAmount = record.refundAmount
      this.refund.refundStuNum = record.refundStuNum
      this.refund.refundCertNum = record.refundCertNum
      this.refund.examStuNum = record.examStuNum
      this.refund.examCertNum = record.examCertNum
      this.refund.certStuNum = record.certStuNum
      this.refund.certCertNum = record.certCertNum
      this.refund.refundApplyAmount = record.refundApplyAmount
      this.refund.userAccountBank = record.userAccountBank
      this.refund.userAccountNo = record.userAccountNo
      this.refund.refundReason = record.refundReason
      this.refund.refundDetailFile = record.refundDetailFile
      this.refund.payPaper = record.payPaper
      this.refund.invoiceFile = record.invoiceFile
      this.refund.refundTalkFile = record.refundTalkFile
      this.refund.refundAccountBank = record.refundAccountBank
      this.refund.refundAccountNo = record.refundAccountNo
    },

    // 确定
    handleOk() {
      this.visible = false
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
      console.log(e.target.value)
    },

    handleChangeContract(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
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

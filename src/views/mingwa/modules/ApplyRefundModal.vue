<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消"
    okText="确认"
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="refund" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="客户类型" prop="refundType">
              <a-radio-group v-model="refund.refundType" @change="onChange" :disabled="isdisabled">
                <a-radio :value="1">公司</a-radio>
                <a-radio :value="2">个人</a-radio>
              </a-radio-group>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="合同编号" prop="contractNo">
              <a-input placeholder="请输入合同编号" v-model="refund.contractNo" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="公司名称" prop="companyName">
              <a-input placeholder="请输入公司名称" v-model="refund.companyName" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="已进账总金额" prop="totalAmount">
              <a-input placeholder="请输入已进账总金额" v-model="refund.totalAmount" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="已进账人数" prop="stuNum">
              <a-input placeholder="请输入已进账人数" v-model="refund.stuNum" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="已进账证数" prop="certNum">
              <a-input placeholder="请输入已进账证数" v-model="refund.certNum" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="已退费金额" prop="refundAmount">
              <a-input placeholder="请输入已退费金额" v-model="refund.refundAmount" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="已退费人数" prop="refundStuNum">
              <a-input placeholder="请输入已退费人数" v-model="refund.refundStuNum" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="已退费证数" prop="refundCertNum">
              <a-input placeholder="请输入已退费证数" v-model="refund.refundCertNum" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="已考试人数" prop="examStuNum">
              <a-input placeholder="请输入已考试人数" v-model="refund.examStuNum" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="已考试证数" prop="examCertNum">
              <a-input placeholder="请输入已考试证数" v-model="refund.examCertNum" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="已发证人数" prop="certStuNum">
              <a-input placeholder="请输入已发证人数" v-model="refund.certStuNum" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="已发证证数" prop="certCertNum">
              <a-input placeholder="请输入已发证证数" v-model="refund.certCertNum" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="申请退款金额" prop="refundApplyAmount">
              <a-input
                placeholder="上传退费明细表后自动获取"
                v-model="refund.refundApplyAmount"
                disabled
                :maxLength="10"
              />
              <span v-if="spanisshow" style="color: red">当前退款金额+已退金额大于实付合同金额,请确认金额是否有误</span>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="退款开户行" prop="refundAccountBank">
              <a-select placeholder="请选择退款开户行" v-model="refund.refundAccountBank">
                <a-select-option v-for="item in compAccountsBankTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="退款银行账户" prop="refundAccountNo">
              <a-select placeholder="请选择退款银行账户" v-model="refund.refundAccountNo">
                <a-select-option v-for="item in compAccountsNoTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="客户开户行" prop="userAccountBank">
              <a-input placeholder="请输入客户开户行" v-model="refund.userAccountBank" :disabled="isdisabled" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="客户银行账号" prop="userAccountNo">
              <a-input placeholder="请输入客户银行账号" v-model="refund.userAccountNo" :disabled="isdisabled" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="退款原因说明" prop="refundReason">
              <a-textarea
                placeholder="请输入退款原因说明"
                v-model="refund.refundReason"
                :rows="3"
                :disabled="isdisabled"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="退费明细表" prop="refundDetailFile">
              <j-upload
                v-model="refund.refundDetailFile"
                @change="refundDetailFileChange"
                :disabled="onlydisabled"
                :number="number"
              ></j-upload>
              <a-button type="primary" v-if="isshow" @click="downLoadTemplate()">模板下载</a-button>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="打款银行回单" prop="payPaper">
              <j-upload v-model="refund.payPaper" @change="handleChangeContract" :disabled="isdisabled"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="已开发票原件" prop="invoiceFile">
              <j-upload v-model="refund.invoiceFile" @change="handleChangeContract" :disabled="isdisabled"></j-upload>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="退费沟通证据" prop="refundTalkFile">
              <j-upload
                v-model="refund.refundTalkFile"
                @change="handleChangeContract"
                :disabled="isdisabled"
              ></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" v-if="!!isShowDraftBtn" @click="handleOk('1')">存入草稿</a-button>
      <a-button type="primary" @click="handleOk('2')">提交审核</a-button>
    </template>
  </a-modal>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import { addStudent, editStudent } from '@/api/api'
import companyAccountListMixin from '@/mixins/companyAccountListMixin'
import JUpload from '@/components/jeecg/JUpload'

export default {
  name: 'ApplyRefundModal', //退款申请单
  mixins: [companyAccountListMixin],
  props: ['toChild'],
  components: {
    JUpload
  },
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      number: 1,
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
        add: '/erp/billRefund/add',
        edit: '/erp/billRefund/edit',
        RefundNum: '/erp/billRefund/getApplyRefundNum',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        getTotalApplyRefundAmount: '/erp/billRefund/getTotalApplyRefundAmount'
      },
      refund: {
        id: undefined,
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
        sDataStatus: undefined,
        refundAccountBank: undefined,
        refundAccountNo: undefined
      },
      isdisabled: undefined,
      onlydisabled: undefined,
      isshow: undefined,
      addOrEdit: undefined,
      getReceiptAmount: {
        totalAmount: undefined,
        actAmount: undefined,
        totalRefundAmount: undefined
      },
      spanisshow: false,
      rules: {
        refundType: [{ required: true, message: '请选择客户类型', trigger: 'change' }],
        userAccountBank: [{ required: true, message: '请输入客户开户行', trigger: 'change' }],
        userAccountNo: [{ required: true, message: '请输入客户银行账号', trigger: 'change' }],
        refundReason: [{ required: true, message: '请输入退款原因说明', trigger: 'change' }],
        refundDetailFile: [{ required: true, message: '请上传退费明细表', trigger: 'change' }],
        payPaper: [{ required: true, message: '请上传打款银行回单', trigger: 'change' }],
        invoiceFile: [{ required: true, message: '请上传已开发票原件', trigger: 'change' }],
        refundTalkFile: [{ required: true, message: '请上传退费沟通证据', trigger: 'change' }],
        refundAccountBank: [{ required: true, message: '请选择退款开户行', trigger: 'change' }],
        refundAccountNo: [{ required: true, message: '请选择退款开户行帐号', trigger: 'change' }]
      }
    }
  },
  computed: {
    isShowDraftBtn({ refund }) {
      return refund.sDataStatus == 4 ? false : true
    }
  },
  created() {
    this.refund.contractNo = this.$route.query.contractNo
    this.refund.companyName = this.$route.query.companyName
    this.refund.companyId = this.$route.query.companyId
  },
  watch: {
    toChild: function(newvul, oldvul) {
      this.getReceiptAmount.totalAmount = newvul.totalAmount
      this.getReceiptAmount.actAmount = newvul.actAmount
      this.getReceiptAmount.totalRefundAmount = newvul.totalRefundAmount
    }
  },
  methods: {
    getApplyRefundNum() {
      let contractNo = this.refund.contractNo
      getAction(this.url.RefundNum + '?contractNo=' + contractNo).then(res => {
        if (!!res.success) {
          this.refund.totalAmount = res.result.totalAmount
          this.refund.stuNum = res.result.stuNum
          this.refund.certNum = res.result.certNum
          this.refund.refundAmount = res.result.refundAmount
          this.refund.refundStuNum = res.result.refundStuNum
          this.refund.refundCertNum = res.result.refundCertNum
          this.refund.examStuNum = res.result.examStuNum
          this.refund.examCertNum = res.result.examCertNum
          this.refund.certStuNum = res.result.certStuNum
          this.refund.certCertNum = res.result.certCertNum
        }
      })
    },

    add() {
      this.isshow = true
      this.visible = true
      this.refund.refundType = 1
      this.refund.refundApplyAmount = undefined
      this.refund.userAccountBank = undefined
      this.refund.userAccountNo = undefined
      this.refund.refundReason = undefined
      this.refund.refundDetailFile = undefined
      this.refund.payPaper = undefined
      this.refund.invoiceFile = undefined
      this.refund.refundTalkFile = undefined
      this.getApplyRefundNum()
      this.addOrEdit = 1
      this.spanisshow = false
      this.refund.sDataStatus = undefined
      this.refund.refundAccountBank = undefined
      this.refund.refundAccountNo = undefined
    },

    edit(record) {
      this.isdisabled = false
      this.onlydisabled = false
      this.visible = true
      this.isshow = false
      this.refund.id = record.id
      this.refund.refundType = record.refundType
      this.refund.contractNo = record.contractNo
      this.refund.companyName = record.companyName
      this.refund.refundApplyAmount = record.refundApplyAmount
      this.refund.userAccountBank = record.userAccountBank
      this.refund.userAccountNo = record.userAccountNo
      this.refund.refundReason = record.refundReason
      this.refund.refundDetailFile = record.refundDetailFile
      this.refund.payPaper = record.payPaper
      this.refund.invoiceFile = record.invoiceFile
      this.refund.refundTalkFile = record.refundTalkFile
      this.getApplyRefundNum()
      this.addOrEdit = 2
      this.spanisshow = false
      this.refund.sDataStatus = record.dataStatus
      this.refund.refundAccountBank = record.refundAccountBank
      this.refund.refundAccountNo = record.refundAccountNo
    },

    detail(record) {
      this.visible = true
      this.isdisabled = true
      this.onlydisabled = true
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
      this.refund.sDataStatus = record.dataStatus
      this.refund.refundAccountBank = record.refundAccountBank
      this.refund.refundAccountNo = record.refundAccountNo
    },

    // 确定
    handleOk(status = '1') {
      let data_status = status || '1' //1-草稿,2-待审核
      this.refund.dataStatus = data_status
      // 触发表单验证
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        }
      })
    },
    doSendFormDataSubmit() {
      let refund = this.refund
      if (this.addOrEdit == 1) {
        if (this.visible == true) {
          this.visible = false
          postAction(this.url.add, refund).then(res => {
            if ((res.code == 200 || res.code == 0) && !!res.success) {
              this.$message.success(res.message)
              setTimeout(() => {
                this.$emit('ok')
              }, 30)
            } else {
              this.$message.warning(res.message)
            }
          })
        }
      }
      if (this.addOrEdit == 2) {
        postAction(this.url.edit, refund).then(res => {
          if ((res.code == 200 || res.code == 0) && !!res.success) {
            this.$message.success(res.message)
            setTimeout(() => {
              this.visible = false
              this.$emit('ok')
            }, 30)
          } else {
            this.$message.warning(res.message)
          }
        })
      }
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

    handleChangeContract(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
    },

    refundDetailFileChange(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
      let data = {
        contractNo: this.refund.contractNo,
        refundDetailFile: this.refund.refundDetailFile
      }
      if (!!fileListStr) {
        getAction(this.url.getTotalApplyRefundAmount, data).then(res => {
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            this.$message.success(res.message)
            this.refund.refundApplyAmount = res.result
            this.changeRefundAmount()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },

    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/temp/退款学员明细模板_1624504641399.xlsx',
        'utf-8'
      )
      window.location.href = newFileUrl
    },

    changeRefundAmount() {
      if (
        Number(this.getReceiptAmount.totalRefundAmount) + Number(this.refund.refundApplyAmount) >
        Number(this.getReceiptAmount.actAmount)
      ) {
        this.spanisshow = true
      } else {
        this.spanisshow = false
      }
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

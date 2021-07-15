<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="取消"
    okText="提交"
    mask:false
  >
    <a-spin :spinning="confirmLoading">
      <a-form-model ref="ruleForm" :model="mwBillReceipt" :rules="rules" :labelCol="labelCol" :wrapperCol="wrapperCol">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="合同编号" prop="contractNo">
              <a-input placeholder="请选择合同编号" v-model="mwBillReceipt.contractNo" disabled />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="公司名称" prop="companyName">
              <a-input placeholder="请输入公司名称" v-model="mwBillReceipt.companyName" disabled />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="收款类型" prop="receiptType">
              <a-select
                placeholder="请选择收款类型"
                v-model="mwBillReceipt.receiptType"
                @change="handleSelectChange"
                :disabled="!isshow"
              >
                <a-select-option value="1">首付款</a-select-option>
                <a-select-option value="3">尾款</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="收款金额(元)" prop="receiptAmount">
              <a-input
                placeholder="上传收款明细表后自动获取"
                v-model="mwBillReceipt.receiptAmount"
                oninput="this.value=this.value.replace(/\D/g,'')"
                v-checked="{ required: true }"
                :maxLength="10"
                disabled
                @change="changeReceiptAmount"
              />
              <span v-if="spanisshow" style="color:red"
                >当前收款金额+实付合同金额大于合同应付金额,请确认金额是否有误</span
              >
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="收款开户行" prop="receiptAccountBank">
              <a-select placeholder="请选择收款开户行" v-model="mwBillReceipt.receiptAccountBank">
                <a-select-option v-for="item in compAccountsBankTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="收款银行账户" prop="receiptAccountNo">
              <a-select placeholder="请选择收款银行账户" v-model="mwBillReceipt.receiptAccountNo">
                <a-select-option v-for="item in compAccountsNoTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-model-item label="收款方式" prop="receiptMethod">
              <a-select placeholder="请选择收款方式" v-model="mwBillReceipt.receiptMethod" @change="handleSelectChange">
                <a-select-option value="1">银行转账</a-select-option>
                <a-select-option value="2">微信</a-select-option>
                <a-select-option value="3">支付宝</a-select-option>
                <a-select-option value="4">现金</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="收款时间" prop="receiptTime">
              <a-date-picker v-model="mwBillReceipt.receiptTime" @change="onChangedate" style="width: 100%" />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="20">
            <a-form-model-item label="打款回单" prop="payPaper" :labelCol="fileLabelCol" :wrapperCol="filewWrapperCol">
              <j-upload v-model="mwBillReceipt.payPaper" @change="handleChangeContract"></j-upload>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="20">
            <a-form-model-item
              label="收款明细表"
              prop="receiptDetailFile"
              :labelCol="fileLabelCol"
              :wrapperCol="filewWrapperCol"
            >
              <j-upload
                v-model="mwBillReceipt.receiptDetailFile"
                @change="receiptDetailFileChange"
                :disabled="onlydisabled"
                :number="number"
              ></j-upload>
              <a-button type="primary" v-if="isshow" @click="downLoadTemplate()">模板下载</a-button>
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
import pick from 'lodash.pick'
import moment from 'moment'
import { putAction, postAction, getAction } from '@/api/manage'
import companyAccountListMixin from '@/mixins/companyAccountListMixin'
import { addStudent, editStudent } from '@/api/api'
import JUpload from '@/components/jeecg/JUpload'

export default {
  name: 'StuContractGatheringModal', //合同收款单新增编辑表单区域
  mixins: [companyAccountListMixin],
  props: ['companyId', 'toChild'],
  components: {
    JUpload
  },
  data() {
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      number: 1,
      onlydisabled: undefined,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
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
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        getTotalApplyReceiptAmount: '/erp/mwBillReceipt/getTotalApplyReceiptAmount'
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
        receiptDetailFile: undefined, //退费明细表
        id: undefined,
        sDataStatus: undefined,
        receiptAccountBank: undefined,
        receiptAccountNo: undefined
      },
      isshow: undefined,
      getReceiptAmount: {
        totalAmount: undefined,
        actAmount: undefined,
        totalRefundAmount: undefined
      },
      spanisshow: false,
      rules: {
        contractNo: [{ required: true, message: '请选择合同编号', trigger: 'change' }],
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'change' }],
        receiptType: [{ required: true, message: '请选择收款类型', trigger: 'change' }],
        receiptAmount: [{ required: true, message: '请输入收款金额', trigger: 'change' }],
        receiptAccountBank: [{ required: true, message: '请选择收款开户行', trigger: 'change' }],
        receiptAccountNo: [{ required: true, message: '请选择收款银行账户', trigger: 'change' }],
        receiptMethod: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
        receiptTime: [{ required: true, message: '请选择收款时间', trigger: 'change' }],
        payPaper: [{ required: true, message: '请上传打款回单', trigger: 'change' }],
        receiptDetailFile: [{ required: true, message: '请上传收款明细表', trigger: 'change' }]
      }
    }
  },
  directives: {
    // 不能为空的指令
    required: {
      inserted: function(el) {
        el.addEventListener('blur', function() {
          if (el.value == '' || el.value == null) {
            el.style.border = '1px solid red'
            console.log('我不能为空')
          }
        })
      }
    },
    // 验证指令
    checked: {
      inserted: function(el) {
        return el
      }
    }
  },
  created() {
    this.mwBillReceipt.contractNo = this.$route.query.contractNo
    this.mwBillReceipt.companyName = this.$route.query.companyName
    this.mwBillReceipt.companyId = this.$route.query.companyId
  },
  computed: {
    isShowDraftBtn({ mwBillReceipt }) {
      return mwBillReceipt.sDataStatus == 4 ? false : true
    }
  },
  watch: {
    toChild: function(newvul, oldvul) {
      this.getReceiptAmount.totalAmount = newvul.totalAmount
      this.getReceiptAmount.actAmount = newvul.actAmount
      this.getReceiptAmount.totalRefundAmount = newvul.totalRefundAmount
    }
  },
  methods: {
    add() {
      this.isshow = true
      this.spanisshow = false
      this.mwBillReceipt.receiptType = undefined
      this.mwBillReceipt.receiptAmount = undefined
      this.mwBillReceipt.receiptMethod = undefined
      this.mwBillReceipt.receiptTime = undefined
      this.mwBillReceipt.payPaper = undefined
      this.mwBillReceipt.receiptDetailFile = undefined
      this.mwBillReceipt.id = undefined
      this.mwBillReceipt.sDataStatus = undefined
      this.mwBillReceipt.receiptAccountBank = undefined
      this.mwBillReceipt.receiptAccountNo = undefined
      this.edit()
    },
    edit(record) {
      this.visible = true
      if (!!record) {
        this.isshow = false
        this.mwBillReceipt.receiptType = record.receiptType
        this.mwBillReceipt.receiptAmount = record.receiptAmount
        this.mwBillReceipt.receiptMethod = record.receiptMethod
        this.mwBillReceipt.receiptTime = !!record.receiptTime ? moment(record.receiptTime) : null
        this.mwBillReceipt.payPaper = record.payPaper
        this.mwBillReceipt.receiptDetailFile = record.receiptDetailFile
        this.mwBillReceipt.id = record.id
        this.mwBillReceipt.sDataStatus = record.dataStatus
        this.mwBillReceipt.receiptAccountBank = record.receiptAccountBank
        this.mwBillReceipt.receiptAccountNo = record.receiptAccountNo
      }
    },

    // 确定
    handleOk(status = '1') {
      let data_status = status || '1' //1-草稿,2-待审核
      this.mwBillReceipt.dataStatus = data_status
      // 触发表单验证
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        }
      })
    },
    doSendFormDataSubmit() {
      if (!!this.mwBillReceipt.id) {
        putAction(this.url.edit, this.mwBillReceipt).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success('编辑成功！')
            setTimeout(() => {
              this.visible = false
              this.$emit('ok')
            }, 30)
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        if (this.visible == true) {
          this.visible = false
          postAction(this.url.add, this.mwBillReceipt).then(res => {
            if (res.code == 200 && !!res.success) {
              this.$message.success('新增成功！')
              this.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
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

    changeReceiptAmount() {
      if (
        Number(this.getReceiptAmount.actAmount) + Number(this.mwBillReceipt.receiptAmount) >
        Number(this.getReceiptAmount.totalAmount)
      ) {
        this.spanisshow = true
      } else {
        this.spanisshow = false
      }
    },

    receiptDetailFileChange(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
      let data = {
        contractNo: this.mwBillReceipt.contractNo,
        receiptDetailFile: this.mwBillReceipt.receiptDetailFile
      }
      if (!!fileListStr) {
        getAction(this.url.getTotalApplyReceiptAmount, data).then(res => {
          if ((res.code == 0 || res.code == 200) && !!res.success) {
            this.$message.success(res.message)
            this.mwBillReceipt.receiptAmount = res.result
            this.changeRefundAmount()
          } else {
            this.$message.warning(res.message)
          }
        })
      }
    },

    downLoadTemplate() {
      var newFileUrl = encodeURI(
        'https://newmingwaerpbucket.oss-cn-hangzhou.aliyuncs.com/temp/收款明细表导入模板_1624524155331.xls',
        'utf-8'
      )
      window.location.href = newFileUrl
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

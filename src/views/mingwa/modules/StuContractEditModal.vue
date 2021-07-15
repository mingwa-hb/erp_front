<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    :okButtonProps="{ props: { disabled: disabled } }"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同编号">
              <a-input
                placeholder="请输入合同编号"
                v-decorator="['contractNo', validatorRules.contractNo]"
                :disabled="!!model.id"
                :maxLength="32"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="所属公司" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!model.id">
              <j-select-company
                placeholder="请选择公司"
                :multiple="false"
                v-decorator="['companyId', validatorRules.companyId]"
              />
            </a-form-item>
            <a-form-item label="所属公司" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="model.id">
              <j-select-company
                placeholder="请选择公司"
                :multiple="false"
                v-decorator="['companyId', {}]"
                :disabled="true"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="项目经理" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <JSelectUserByRole
                placeholder="请选择项目经理"
                :multiple="false"
                v-decorator="['manager', validatorRules.manager]"
                roleCode="XMJL"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24 / 2">
            <a-form-item label="业务支持" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <JSelectUserByRole
                placeholder="请选择业务支持"
                :multiple="false"
                v-decorator="['supporter', validatorRules.supporter]"
                roleCode="YZRY"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item label="收款人" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <JSelectUserByRole
                placeholder="请选择收款人"
                :multiple="false"
                v-decorator="['receiptUser', validatorRules.receiptUser]"
                roleCode="CWCN"
              />
            </a-form-item>
          </a-col>

          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同证次">
              <a-input
                placeholder="请输入合同证次"
                v-decorator="['certificateCount', validatorRules.certificateCount]"
                @change="certificateCountRules"
                oninput="this.value=this.value.replace(/\D/g,'')"
                :maxLength="12"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="应付合同金额">
              <a-input
                placeholder="请输入应付合同金额"
                v-decorator="['totalAmount', validatorRules.totalAmount]"
                :readOnly="disableSubmit"
                :maxLength="12"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实付合同金额(元)">
              <a-input
                placeholder="请输入实付合同金额"
                v-decorator="['actAmount', validatorRules.amount]"
                :readOnly="disableSubmit"
                :maxLength="12"
                disabled
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="应付首付款（元）">
              <a-input
                placeholder="请输入应付首付款"
                v-decorator="['duePayment', validatorRules.amount]"
                :readOnly="disableSubmit"
                :maxLength="12"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实付首付款（元）">
              <a-input
                placeholder="请输入实付首付款"
                v-decorator="['actDuePayment', validatorRules.amount]"
                :readOnly="disableSubmit"
                :maxLength="12"
                disabled
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="首付支付日期" class="firstPayDate">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-decorator="['firstPayDate', {}]"
                placeholder="请选择首付支付日期"
                dateFormat="YYYY-MM-DD"
                disabled
              ></j-date>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="应付尾款（元）">
              <a-input
                placeholder="请输入应付尾款"
                v-decorator="['dueBalance', validatorRules.amount]"
                :readOnly="disableSubmit"
                :maxLength="12"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实付尾款（元）">
              <a-input
                placeholder="请输入实付尾款"
                v-decorator="['actBalance', validatorRules.amount]"
                :readOnly="disableSubmit"
                :maxLength="12"
                disabled
              />
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="尾款支付日期" class="endTime">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-decorator="['balancePaymentDate', {}]"
                placeholder="请选择尾款支付日期"
                dateFormat="YYYY-MM-DD"
                disabled
              ></j-date>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row style="width: 100%">
          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="签订日期" class="endTime">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-decorator="['signDate', validatorRules.signDate]"
                placeholder="请选择签订日期"
                dateFormat="YYYY-MM-DD"
              ></j-date>
            </a-form-item>
          </a-col>

          <a-col :span="24 / 2">
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="合同截止日期" class="endTime">
              <j-date
                style="width: 100%"
                :getCalendarContainer="node => node.parentNode"
                v-decorator="['deadLine', validatorRules.deadLine]"
                placeholder="请选择合同截止日期"
                dateFormat="YYYY-MM-DD"
              ></j-date>
            </a-form-item>
          </a-col>
        </a-row>

        <a-row>
          <a-col :span="24">
            <a-form-item label="合同附件" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
              <!-- <j-file-upload
                class="avatar-uploader"
                text="上传"
                v-model="contractFile"
                :isMultiple="false"
                :fileTypeOld="contractFileType"
              ></j-file-upload> -->
              <j-upload v-decorator="['contractFile', {}]" @change="handleChangeFileContarct"></j-upload>
            </a-form-item>
          </a-col>
          <a-col :span="24 / 2">
            <a-form-item label="合同备注" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-textarea
                placeholder="请输入备注"
                :auto-size="{ minRows: 3, maxRows: 5 }"
                v-decorator="['remark', validatorRules.remark]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-spin>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" v-if="!!isShowDraftBtn" @click="handleOk('1')">存入草稿</a-button>
      <a-button type="primary" @click="handleOk('2')">提交审核</a-button>
    </template>
  </a-modal>
</template>

<script>
import { httpAction } from '@/api/manage'
import pick from 'lodash.pick'

import JDate from '@/components/jeecg/JDate'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JSelectUserByRole from '@/components/jeecgbiz/JSelectUserByRole'
import JUpload from '@/components/jeecg/JUpload'

export default {
  components: { JDate, JSelectCompany, JUpload, JSelectUserByRole },
  name: 'StuContractEditModal', //合同基本信息
  data() {
    let that = this
    return {
      title: '操作',
      visible: false,
      disableSubmit: false,
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      labelColX1: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperColX1: {
        xs: { span: 24 },
        sm: { span: 21 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      validatorRules: {
        contractNo: { rules: [{ required: true, message: '请输入合同编号!' }] },
        totalAmount: {
          rules: [{ required: true, message: '请输入应付合同金额!' }, { validator: that.validateAmount }]
        },
        certificateCount: { rules: [{ required: true, message: '请输入合同证次!' }] },
        amount: { rules: [{ validator: that.validateAmount }] },
        signDate: { rules: [{ required: true, message: '请输入签订日期!' }] },
        deadLine: { rules: [{ required: true, message: '请输入合同截止日期!' }] },
        companyId: { rules: [{ required: true, message: '请选择公司!' }] },
        manager: { rules: [{ required: true, message: '请选择项目经理!' }] },
        supporter: { rules: [{ required: true, message: '请选择业务支持!' }] },
        receiptUser: { rules: [{ required: true, message: '请选择收款人!' }] },
        remark: {
          rules: [
            { required: false, message: '请输入备注信息!' },
            { min: 1, max: 200, message: '最多输入200个字符!' }
          ]
        }
      },
      url: {
        add: '/erp/stuContract/add',
        edit: '/erp/stuContract/edit'
      },
      userType: false,
      userIds: [],
      selectedUser: [],
      disabled: false,
      msgContent: '',
      userList: [],
      contractFile: [],
      contractFileType: 1
    }
  },
  computed: {
    isShowDraftBtn({ model }) {
      return model.dataStatus == 4 ? false : true
    }
  },
  created() {},
  methods: {
    certificateCountRules(val) {
      let value = val.target.value
      let num
      for (let i = 0; i < value.length; i++) {
        if (value[i] != 0) {
          num = i
          val.target.value = value.slice(num)
          return
        }
      }
    },

    reSetFormVal() {
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },
    add() {
      this.contractFile = []
      // this.visible = true
      // this.model = {}
      // this.reSetFormVal()
      this.edit({})
    },
    edit(record) {
      this.form.resetFields()
      this.model = Object.assign({}, record)
      // console.log(this.model)
      this.disable = false
      this.visible = true
      if (!!this.model.id) {
        this.contractFile = [this.model.contractFile]
        // this.changeContractFileType(this.model.contractFile)
      }
      this.fillRecord(this.model)
    },
    //改变工作证明的文件类型
    changeContractFileType(url) {
      if (url == undefined) {
        //默认是图片
        this.contractFileType = 1
      } else if (url.indexOf('.pdf') > 0 || url.indexOf('.PDF') > 0) {
        //是pdf
        this.contractFileType = 2
      } else if (
        url.indexOf('.doc') > 0 ||
        url.indexOf('.DOC') > 0 ||
        url.indexOf('.docx') > 0 ||
        url.indexOf('.DOCX') > 0
      ) {
        //是doc
        this.contractFileType = 3
      } else {
        //默认是图片
        this.contractFileType = 1
      }
    },

    fillRecord(record) {
      this.$nextTick(() => {
        let fields = pick(this.model, [
          'contractNo',
          'companyId',
          'manager',
          'supporter',
          'receiptUser',
          'certificateCount',
          'totalAmount',
          'actAmount',
          'duePayment',
          'actDuePayment',
          'firstPayDate',
          'dueBalance',
          'actBalance',
          'balancePaymentDate',
          'signDate',
          'deadLine',
          'contractFile',
          'remark'
        ])
        this.form.setFieldsValue(fields)
      })
    },
    handleChangeFileContarct(fileListStr) {
      // console.log(fileList)
      let fileList = fileListStr.split(',')
      this.contractFile = [fileList.pop()]
    },
    close() {
      this.$nextTick(() => {
        this.form.resetFields()
      })
      this.$emit('close')
      this.selectedUser = []
      this.contractFile = []
      this.visible = false
    },
    handleOk(status = '1') {
      const that = this
      var isWinClose = false
      let data_status = status || '1' //1-草稿,2-待审核
      // 触发表单验证
      this.form.validateFields((err, values) => {
        if (!err) {
          that.confirmLoading = true
          let httpurl = ''
          let method = ''
          if (!this.model.id) {
            httpurl += this.url.add
            method = 'post'
          } else {
            httpurl += this.url.edit
            method = 'post'
          }
          let formData = Object.assign({ id: this.model.id }, values)
          if (that.contractFile.length > 0) {
            formData.contractFile = that.contractFile.join(',')
          } else {
            formData.contractFile = null
          }
          formData.dataStatus = data_status
          // console.log(formData)
          httpAction(this.url.edit, formData, method)
            .then(res => {
              if (res.success) {
                isWinClose = true
                that.$message.success(res.message)
                //edit by xiaoguangbiao  增加关闭弹框逻辑  begin
                this.visible = false
                //edit by xiaoguangbiao  增加关闭弹框逻辑  begin
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              if (isWinClose) {
                that.close()
              }
            })
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.$emit('close')
    },
    //校验金额格式
    validateAmount(rule, value, callback) {
      if (value) {
        var myreg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!myreg.test(value)) {
          callback('格式错误：金额只能为数字，且小数点后保留两位')
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.ant-modal-content {
  .ant-form {
    .ant-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>

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
            <j-upload v-model="mwBillReceipt.receiptPaper" @change="handleChangeContract" :disabled="isdisabled"></j-upload>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核意见">
            <a-select placeholder="" v-model="mwBillReceipt.auditReason" @change="handleSelectChangeAuditReason">
              <a-select-option value="1">审核通过</a-select-option>
              <a-select-option value="2">审核不通过</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退回节点" v-if="auditReasonIsShow">
            <a-select
              placeholder=""
              @change="handleSelectChangeAssignees"
            >
              <a-select-option value="发起人">发起人</a-select-option>
              <a-select-option v-for="(item, index) in assigneesList" :key="index" :value="item.key">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="指定原节点审批人" v-if="assigneesIsShow">
            <a-input placeholder="" v-model="mwBillReceipt.assignees" disabled />
          </a-form-item>
          <a-form-model-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-textarea placeholder="请输入备注" :rows="3" v-model.trim="mwBillReceipt.comment" />
          </a-form-model-item>
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
  name: 'ReceiptAdministrationAuditModal', //收款单管理审核表单区域
  props: ['companyId'],
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
        passProcess: '/erp/mwBillReceipt/passProcess',
        refusedProcess: '/erp/mwBillReceipt/refusedProcess',
        getProcessPersonBeforeCurrent: '/erp/mwBillReceipt/getProcessPersonBeforeCurrent',
        getNode: '/erp/mwBillReceipt/getNode',
      },
      value: 1,
      //   dateFormat: 'YYYY-MM-DD',
      mwBillReceipt: {
        receiptNo: undefined, //收款单号
        receiptPaper: undefined, //收款回单
        auditReason: undefined, //审核意见
        assignees: undefined, //指定原节点审批人
        comment: undefined, //备注
        id: undefined,
      },
      auditReasonIsShow: undefined,
      assigneesIsShow: undefined,
      key: undefined,
      assigneesList: [],
      usersList: [],
      usernameList: [],
      realnameList: [],
      isdisabled:undefined,
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
  },
  computed: {},
  methods: {
    audit(record) {
      this.isdisabled=undefined;
      this.visible = true
      this.auditReasonIsShow = false
      this.mwBillReceipt.receiptNo = record.receiptNo
      this.mwBillReceipt.receiptPaper = record.receiptPaper
      this.mwBillReceipt.auditReason = record.auditReason
      this.mwBillReceipt.id = record.id
      this.mwBillReceipt.comment = ''
      this.mwBillReceipt.assignees=''
      if (record.actStatusName=="待财务会计初审") {
        this.isdisabled=false
      }else{
        this.isdisabled=true
      }
    },
    // 确定
    handleOk() {
      this.visible = false
      if (this.mwBillReceipt.auditReason == 1) {
        let data = {
          id: this.mwBillReceipt.id,
          comment: this.mwBillReceipt.comment,
          receiptPaper:this.mwBillReceipt.receiptPaper,
          sendMessage:true
        }
        postAction(this.url.passProcess, data).then((res) => {
          console.log(res)
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message)
            setTimeout(() => {
              this.$emit('ok')
            }, 30)
          } else {
            this.$message.warning(res.message)
          }
        })
      }
      if (this.mwBillReceipt.auditReason == 2) {
        let assignees = this.usernameList.toString()
        let data = {
          id: this.mwBillReceipt.id,
          comment: this.mwBillReceipt.comment,
          assignees: assignees,
          backTaskKey: this.key,
        }
        postAction(this.url.refusedProcess, data).then((res) => {
          console.log(res)
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message)
            setTimeout(() => {
              this.$emit('ok')
            }, 30)
          } else {
            this.$message.warning(res.message)
          }
        })
      }
      this.$emit('ok')
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
      // console.log(e.target.value)
    },

    handleSelectChangeAuditReason(value) {
      if (value == 2) {
        this.auditReasonIsShow = true
        this.assigneesIsShow = true
        let id = this.mwBillReceipt.id
        this.assigneesList=[];
        getAction(this.url.getProcessPersonBeforeCurrent + '?id=' + id).then((res) => {
          console.log(res);
          if (res.code == 200 && !!res.success) {
            this.assigneesList = res.result
          }
        })
      } else {
        this.auditReasonIsShow = false
        this.assigneesIsShow = false
      }
    },

    handleSelectChangeAssignees(value) {
      this.key=undefined
      console.log(value)
      if (value == '发起人') {
        let id = this.mwBillReceipt.id
        this.assigneesIsShow = false
        let nodeId = -1
        this.key=-1
        getAction(this.url.getNode + '?id=' + id + '&nodeId=' + nodeId).then((res) => {
          this.usernameList = []
          if (res.code == 200 && !!res.success) {
            this.usersList = res.result.users
            for (let i = 0; i < this.usersList.length; i++) {
              this.usernameList.push(this.usersList[i].username)
            }
          }
        })
      }
      if (value != '发起人') {
        this.assigneesIsShow = true
      }
      if (!!value && value != '发起人') {
        this.key=value
        let id = this.mwBillReceipt.id
        let nodeId = value
        getAction(this.url.getNode + '?id=' + id + '&nodeId=' + nodeId).then((res) => {
          console.log(res);
          this.usernameList = []
          this.realnameList = []
          if (res.code == 200 && !!res.success) {
            this.usersList = res.result.users
            for (let i = 0; i < this.usersList.length; i++) {
              this.usernameList.push(this.usersList[i].username)
              this.realnameList.push(this.usersList[i].realname)
            }
            this.mwBillReceipt.assignees = this.realnameList.toString()
          }
        })
      }
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

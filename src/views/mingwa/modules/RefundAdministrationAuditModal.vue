<template>
  <div>
    <a-modal
      :title="title"
      width="50%"
      :visible="visible"
      :confirmLoading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      cancelText="取消"
      okText="提交"
    >
      <a-spin :spinning="confirmLoading">
        <a-form :form="form">
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退款单号">
            <a-input placeholder="" v-model="refund.refundNo" disabled />
          </a-form-item>
          <a-form-item
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
            v-for="(item, index) in commitList"
            :key="index"
            :label="item.name + '意见'"
          >
            <a-input :placeholder="'请输入' + item.name" v-model="item.comment" disabled />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="审核意见">
            <a-select placeholder="请选择审核意见" v-model="refund.auditReason" @change="handleSelectChangeAuditReason">
              <a-select-option value="1">审核通过</a-select-option>
              <a-select-option value="2">审核不通过</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="退回节点" v-if="auditReasonIsShow">
            <a-select
              placeholder="请选择退回节点"
              v-model="refund.backNode"
              @change="handleSelectChangeAssignees"
              labelInValue
            >
              <a-select-option value="发起人">发起人</a-select-option>
              <a-select-option v-for="(item, index) in backNodeList" :key="index" :value="item.key">{{
                item.name
              }}</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="指定原节点审批人" v-if="assigneesIsShow">
            <a-input placeholder="请输入指定原节点审批人" v-model="refund.assignees" disabled />
          </a-form-item>
          <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
            <a-textarea placeholder="请输入备注" :rows="3" v-model="refund.comment" />
          </a-form-item>
        </a-form>
      </a-spin>
    </a-modal>
  </div>
</template>

<script>
import { getAction, postAction } from '@/api/manage'
import { addStudent, editStudent } from '@/api/api'

import JUpload from '@/components/jeecg/JUpload'

export default {
  name: 'refundAdministrationAuditModal', //退款单管理审核表单区域
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
        sm: { span: 4 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      url: {
        add: '/erp/billRefund/add',
        edit: '/erp/student/edit',
        RefundNum: '/erp/billRefund/getApplyRefundNum',
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        pass: '/erp/billRefund/pass',
        getBackList: '/erp/billRefund/getBackList/',
        getNode: '/erp/billRefund/getNode',
        deny: '/erp/billRefund/deny',
        historicFlow: '/erp/billRefund/historicFlow/'
      },
      value: 1,
      //   dateFormat: 'YYYY-MM-DD',
      refund: {
        id: undefined,
        refundNo: undefined, //退款单号
        auditReason: undefined, //审核意见
        backNode: undefined, //退回节点
        backNodeName: undefined, //退回节点名称
        assignees: undefined, //指定原节点审批人
        comment: undefined //备注
      },
      auditReasonIsShow: undefined,
      assigneesIsShow: undefined,
      key: undefined,
      key2: undefined,
      list: [],
      realnameList: [],
      usernameList: [],
      commitList: [],
      backNodeList: []
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

    audit(record) {
      this.visible = true
      this.refund.id = record.id
      this.refund.refundNo = record.refundNo
      this.refund.auditReason = ''
      this.refund.backNode = ''
      this.refund.assignees = ''
      this.refund.comment = ''
      this.getHistoricFlow(record.id)
    },

    getHistoricFlow(id) {
      this.commitList = []
      getAction(this.url.historicFlow + id).then(res => {
        if (res.code == 200 && !!res.message) {
          this.commitList = res.result
        }
      })
    },

    // 确定
    handleOk() {
      this.visible = false
      if (this.refund.auditReason == 1) {
        let id = this.refund.id
        let comment = this.refund.comment
        postAction(this.url.pass + '?sendMessage=true&comment=' + comment + '&id=' + id).then(res => {
          if (res.code == 200 && !!res.message) {
            this.$message.success(res.message)
            this.$emit('ok')
          } else {
            this.$message.warning(res.message)
          }
        })
      }
      if (this.refund.auditReason == 2) {
        if (this.key2 == -1) {
          // let assignees=this.usernameList.toString()
          let backTaskKey = this.key2
          let comment = this.refund.comment
          let id = this.refund.id
          postAction(
            this.url.deny +
              '?backTaskKey=' +
              backTaskKey +
              '&backNodeName=' +
              this.refund.backNodeName +
              '&comment=' +
              comment +
              '&id=' +
              id +
              '&sendMessage=true&sendEmail=false&sendSms=false'
          ).then(res => {
            if (res.code == 200 && !!res.message) {
              this.$message.success(res.message)
              this.$emit('ok')
            } else {
              this.$message.warning(res.message)
            }
          })
        }
        if (this.key2 != -1) {
          let assignees = this.usernameList.toString()
          let backTaskKey = this.key
          let comment = this.refund.comment
          let id = this.refund.id
          postAction(
            this.url.deny +
              '?assignees=' +
              assignees +
              '&backTaskKey=' +
              backTaskKey +
              '&backNodeName=' +
              this.refund.backNodeName +
              '&comment=' +
              comment +
              '&id=' +
              id +
              '&sendMessage=true&sendEmail=false&sendSms=false'
          ).then(res => {
            if (res.code == 200 && !!res.message) {
              this.$message.success(res.message)
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

    handleChangeContract(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
    },

    handleSelectChangeAuditReason(value) {
      if (value == 1) {
        this.auditReasonIsShow = false
        this.assigneesIsShow = false
      }
      if (value == 2) {
        this.auditReasonIsShow = true
        this.assigneesIsShow = true
        let id = this.refund.id
        getAction(this.url.getBackList + id + '?id=' + id).then(res => {
          if (res.code == 200 && !!res.message) {
            console.log(res.result)
            this.backNodeList = res.result
          }
        })
      }
    },

    handleSelectChangeAssignees(tmp) {
      this.refund.backNodeName = tmp.label
      let value = tmp.key
      console.log(value)
      if (value == '发起人') {
        this.assigneesIsShow = false
        this.key2 = -1
      }
      if (value != '发起人') {
        this.assigneesIsShow = true
        this.key2 = ''
      }
      if (value != '发起人' && !!value) {
        this.key2 = ''
        this.key = value
        let id = this.refund.id
        let key = value
        getAction(this.url.getNode + '?id=' + id + '&nodeId=' + key).then(res => {
          console.log(res)
          this.realnameList = []
          this.usernameList = []
          if (res.code == 200 && !!res.message) {
            if (res.result.users.length > 0) {
              this.list = res.result.users
            }
            for (let i = 0; i < this.list.length; i++) {
              this.realnameList.push(this.list[i].realname)
              this.usernameList.push(this.list[i].username)
            }
            this.refund.assignees = this.realnameList.toString()
          }
        })
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

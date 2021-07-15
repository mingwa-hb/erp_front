<template>
  <a-card title="合同基本信息">
    <!-- <a-button type="primary" @click="goback">返回</a-button> -->
    <!-- <a-button
        type="primary"
        style="margin-left: 20px"
        @click="handleEdit(record)"
        icon="edit"
        v-has="'detailsAdd:add'"
        :disabled="dataStatus == 2 || dataStatus == 3"
        >编辑</a-button
      > -->

    <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 18 }">
      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="合同编号">
            <a-input v-model="record.contractNo" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="公司名称">
            <a-input v-model="record.companyName" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同证次">
            <a-input v-model="record.certificateCount" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="项目经理">
            <a-input v-model="record.managerCn" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="业务支持">
            <a-input v-model="record.supporterCn" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="收款人">
            <a-input v-model="record.receiptUserCn" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="应付合同金额">
            <a-input v-model="record.totalAmount" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="实付合同金额">
            <a-input v-model="record.actAmount" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="应付首付款">
            <a-input v-model="record.duePayment" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="实付首付款">
            <a-input v-model="record.actDuePayment" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="首付款日期">
            <a-input v-model="record.firstPayDate" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="应付尾款">
            <a-input v-model="record.dueBalance" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="实付尾款">
            <a-input v-model="record.actBalance" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="尾款支付日期">
            <a-input v-model="record.balancePaymentDate" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="签订日期">
            <a-input v-model="record.signDate" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="合同截止日期">
            <a-input v-model="record.deadLine" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="退款金额">
            <a-input v-model="record.totalRefundAmount" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同创建人">
            <a-input v-model="record.createByCn" disabled />
          </a-form-item>
        </a-col>
      </a-row>

      <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="合同备注">
            <a-textarea v-model="record.remark" :auto-size="{ minRows: 3, maxRows: 5 }" disabled />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="合同附件">
            <j-upload v-model="record.contractFile" @change="handleChangeContract" disabled></j-upload>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>

    <!-- 编辑表单区域 -->
    <stu-contract-edit-modal ref="modalForm" @ok="modalFormOk"></stu-contract-edit-modal>
  </a-card>
</template>

<script>
import JUpload from '@/components/jeecg/JUpload'
import StuContractEditModal from './modules/StuContractEditModal'
import { getAction } from '@/api/manage'
// import { mapGetters } from 'vuex'

export default {
  name: 'StuContractBaseInformation', //合同基本信息
  mixins: [],
  components: { JUpload, StuContractEditModal },
  props: ['dataStatus'],
  data() {
    return {
      form: this.$form.createForm(this),
      url: {
        list: '/erp/stuContract/getContracts'
      },
      record: {
        contractNo: undefined, //合同编号
        companyName: undefined, //公司名称
        certificateCount: undefined, //合同证次
        managerCn: undefined, //项目经理
        manager: undefined,
        supporterCn: undefined, //业务支持
        supporter: undefined,
        receiptUserCn: undefined,
        receiptUser: undefined,
        createByCn: undefined, // 合同创建人
        totalAmount: undefined, //应付合同金额
        actAmount: undefined, //实付合同金额
        totalRefundAmount: undefined, //退款金额
        duePayment: undefined, //应付首付款
        actDuePayment: undefined, //实付首付款
        firstPayDate: undefined, //首付日期
        dueBalance: undefined, //应付尾款
        actBalance: undefined, //实付尾款
        balancePaymentDate: undefined, //尾款支付日期
        signDate: undefined, //签订日期
        deadLine: undefined, //合同截止日期
        contractFile: undefined, //合同附件
        companyId: undefined, //公司id
        id: undefined,
        dataStatus: undefined,
        remark: undefined
      }
    }
  },
  computed: {},
  created() {
    this.loadData()
  },
  methods: {
    loadData(arg) {
      if (!this.url.list) {
        this.$message.error('请设置url.list属性!')
        return
      }
      // let id = this.$route.query.id
      let contractNo = this.$route.query.contractNo
      getAction(this.url.list + '?contractNo=' + contractNo).then(res => {
        if (!!res.message) {
          this.record.contractNo = res.result.records[0].contractNo
          this.record.companyName = res.result.records[0].companyName
          this.record.certificateCount = res.result.records[0].certificateCount
          this.record.managerCn = res.result.records[0].managerCn
          this.record.supporterCn = res.result.records[0].supporterCn
          this.record.totalAmount = res.result.records[0].totalAmount
          this.record.actAmount = res.result.records[0].actAmount
          this.record.totalRefundAmount = res.result.records[0].totalRefundAmount
          this.record.duePayment = res.result.records[0].duePayment
          this.record.actDuePayment = res.result.records[0].actDuePayment
          this.record.firstPayDate = res.result.records[0].firstPayDate
          this.record.dueBalance = res.result.records[0].dueBalance
          this.record.actBalance = res.result.records[0].actBalance
          this.record.balancePaymentDate = res.result.records[0].balancePaymentDate
          this.record.signDate = res.result.records[0].signDate
          this.record.deadLine = res.result.records[0].deadLine
          this.record.contractFile = res.result.records[0].contractFile
          this.record.companyId = res.result.records[0].companyId
          this.record.manager = res.result.records[0].manager
          this.record.supporter = res.result.records[0].supporter
          this.record.createByCn = res.result.records[0].createByCn
          this.record.id = res.result.records[0].id
          this.record.receiptUserCn = res.result.records[0].receiptUserCn //收款人
          this.record.receiptUser = res.result.records[0].receiptUser
          this.record.dataStatus = res.result.records[0].dataStatus
          this.record.remark = res.result.records[0].remark
          this.toParent()
        }
      })
    },

    toParent() {
      let data = {
        totalAmount: this.record.totalAmount,
        actAmount: this.record.actAmount,
        totalRefundAmount: this.record.totalRefundAmount
      }
      this.$emit('fromBaseChild', data)
    },

    handleEdit: function(record) {
      this.$refs.modalForm.edit(record)
      this.$refs.modalForm.title = '编辑'
      this.$refs.modalForm.disableSubmit = false
    },

    modalFormOk() {
      // 新增/修改 成功时，重载列表
      this.loadData()
    },

    handleChangeContract(fileListStr) {
      let fileList = fileListStr.split(',')
      this.contractFile = fileList.pop()
    },

    goback() {
      history.go(-1)
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less">
.ant-row {
  .ant-col {
    .ant-form-item {
      /deep/.ant-form-item-control-wrapper {
        .ant-form-item-control {
          .ant-form-item-children {
            .uploadty-disabled {
              .ant-upload.ant-upload-disabled {
                display: none;
              }
            }
          }
        }
      }
    }
  }
}
</style>

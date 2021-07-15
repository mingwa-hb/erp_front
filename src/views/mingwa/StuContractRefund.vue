<template>
  <a-card title="合同退款单" style="margin-top: 30px">
    <a-button
      slot="extra"
      type="primary"
      style="margin-left: 20px"
      @click="applytuikuan()"
      icon="plus"
      v-has="'detailsChange:change'"
      :disabled="dataStatus != 4"
    >
      新增
    </a-button>

    <!-- table区域-begin -->
    <div>
      <a-table
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        @change="handleTableChange"
      >
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(taskActionsTypeList) }}
        </span>
        <span slot="showStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(dataStatusTypeList) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleDetails(record)">详情</a>
          <template v-if="record.dataStatus == 1 || record.dataStatus == 5">
            <a-divider type="vertical" v-has="'detailsChange:change'" />
            <a @click="handleEdit(record)" v-has="'detailsChange:change'">编辑</a>
          </template>
          <!--          <template v-if="record.dataStatus != 1">
            <a-divider type="vertical" />
            <a @click="auditHistory(record)">审批历史</a>
          </template>-->
          <a-divider type="vertical" />
          <a @click="stuDetails(record)">学员详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 编辑表单区域 -->
    <apply-refund-modal ref="applyRefundModal" @ok="modalFormOk" :toChild="toChild" />

    <!-- 详情表单区域 -->
    <apply-refund-details-modal ref="applyRefundDetailsModal" @ok="modalFormOk" />

    <!-- 学员详情 -->
    <stu-details-modal ref="stuDetailsModal" @ok="modalFormOk" />

    <a-modal title="审批历史" v-model="modalLsVisible" :mask-closable="false" width="80%" :footer="null">
      <div v-if="modalLsVisible">
        <component :is="historicDetailMw" :tableId="tableId" :tableName="tableName"></component>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinRefund'
import { postAction } from '@/api/manage'

import JEllipsis from '@/components/jeecg/JEllipsis'
import JUpload from '@/components/jeecg/JUpload'
import ApplyRefundModal from './modules/ApplyRefundModal'
import ApplyRefundDetailsModal from './modules/ApplyRefundDetailsModal'
import StuDetailsModal from './modules/StuDetailsModal'

export default {
  name: 'StuContractRefund', //合同退款单
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: {
    JEllipsis,
    JUpload,
    ApplyRefundModal,
    ApplyRefundDetailsModal,
    StuDetailsModal
  },
  props: ['Amount', 'dataStatus'],
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      toChild: undefined,
      // 表头
      modalLsVisible: false,
      tableId: '',
      tableName: '',
      form: this.$form.createForm(this),
      columns: [
        {
          title: '退款单号',
          align: 'center',
          dataIndex: 'refundNo'
        },
        {
          title: '合同编号',
          align: 'center',
          dataIndex: 'contractNo'
        },
        {
          title: '客户/公司名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '申请退款金额',
          align: 'center',
          dataIndex: 'refundApplyAmount'
        },
        {
          title: '退款开户行',
          align: 'center',
          dataIndex: 'refundAccountBank'
        },
        {
          title: '退款开户行帐号',
          align: 'center',
          dataIndex: 'refundAccountNo'
        },
        {
          title: '客户开户行',
          align: 'center',
          dataIndex: 'userAccountBank'
        },
        {
          title: '客户银行账号',
          align: 'center',
          dataIndex: 'userAccountNo'
        },
        {
          title: '退款原因说明',
          align: 'center',
          dataIndex: 'refundReason',
          width: 180,
          customRender: t => ellipsis(t)
        },
        {
          title: '创建日期',
          align: 'center',
          dataIndex: 'createTime'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '操作类型',
          align: 'center',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' }
        },
        {
          title: '审核状态',
          align: 'center',
          dataIndex: 'showStatus',
          scopedSlots: { customRender: 'showStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 240
        }
      ],
      url: {
        list: '/erp/billRefund/getApplyRefundsAll',
        cancel: '/erp/billRefund/cancel'
      }
    }
  },
  computed: {
    historicDetailMw: function() {
      return () => import(`@/views/mingwa/historicDetailMw`)
    }
  },
  created() {},
  watch: {
    Amount: function(newvul, oldvul) {
      this.toChild = newvul
    }
  },
  methods: {
    handleDetails(record) {
      this.$refs.applyRefundDetailsModal.detail(record)
      this.$refs.applyRefundDetailsModal.title = '退款单'
      this.$refs.applyRefundDetailsModal.disableSubmit = false
    },

    handleEdit(record) {
      this.$refs.applyRefundModal.edit(record)
      this.$refs.applyRefundModal.title = '退款单'
      this.$refs.applyRefundModal.disableSubmit = false
    },

    recall(record) {
      let id = record.id
      postAction(this.url.cancel + '?id=' + id).then(res => {
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message)
          this.modalFormOk()
        } else {
          this.$message.warning(res.message)
        }
      })
    },

    auditHistory: function(record) {
      this.tableId = record.id
      this.tableName = 'mw_task'
      this.modalLsVisible = true
    },

    applytuikuan() {
      this.$refs.applyRefundModal.add()
      this.$refs.applyRefundModal.title = '退款申请单'
      this.$refs.applyRefundModal.disableSubmit = false
    },

    stuDetails(record) {
      this.$refs.stuDetailsModal.details(record)
      this.$refs.stuDetailsModal.title = '学员详情'
      this.$refs.stuDetailsModal.disableSubmit = false
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less"></style>

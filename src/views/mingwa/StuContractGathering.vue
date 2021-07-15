<template>
  <a-card title="合同收款单" style="margin-top: 30px">
    <a-button
      slot="extra"
      @click="handleAdd"
      type="primary"
      icon="plus"
      v-has="'detailsChange:change'"
      :disabled="dataStatus != 4"
    >
      新增
    </a-button>

    <!-- table区域-begin -->
    <div>
      <a-table
        class="j-table-force-nowrap"
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
          <!-- <template v-if="record.canChange == 2">
            <a-divider type="vertical" v-has="'detailsChange:change'" />
            <a @click="recall(record)" v-has="'detailsChange:change'">撤回</a>
          </template> -->
          <!--    <template v-if="record.dataStatus != 1">
            <a-divider type="vertical" />
            <a @click="auditHistory(record)">审批历史</a>
          </template>-->
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 新增编辑表单区域 -->
    <stu-contract-gathering-modal :companyId="companyId" :toChild="toChild" ref="modalForm" @ok="modalFormOk" />

    <!-- 详情表单区域 -->
    <stu-contract-gathering-details-modal ref="stuContractGatheringDetailsModal" @ok="modalFormOk" />

    <a-modal title="审批历史" v-model="modalLsVisible" :mask-closable="false" :width="'80%'" :footer="null">
      <div v-if="modalLsVisible">
        <component :is="historicDetailMw" :tableId="tableId" :tableName="tableName"></component>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixinGathering'
import { postAction } from '@/api/manage'

import StuContractGatheringModal from './modules/StuContractGatheringModal'
import StuContractGatheringDetailsModal from './modules/StuContractGatheringDetailsModal'

export default {
  name: 'StuContractGathering', //合同收款单
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { StuContractGatheringModal, StuContractGatheringDetailsModal },
  props: ['Amount', 'dataStatus'],
  data() {
    return {
      toChild: undefined,
      // 表头
      modalLsVisible: false,
      tableId: '',
      tableName: '',
      form: this.$form.createForm(this),
      columns: [
        {
          title: '收款单号',
          align: 'center',
          dataIndex: 'receiptNo'
        },
        {
          title: '合同编号',
          align: 'center',
          dataIndex: 'contractNo'
        },
        {
          title: '收款类型',
          align: 'center',
          dataIndex: 'receiptTypeName'
        },
        {
          title: '收款金额',
          align: 'center',
          dataIndex: 'receiptAmount'
        },
        {
          title: '收款开户行',
          align: 'center',
          dataIndex: 'receiptAccountBank'
        },
        {
          title: '收款开户行帐号',
          align: 'center',
          dataIndex: 'receiptAccountNo'
        },
        {
          title: '收款方式',
          align: 'center',
          dataIndex: 'receiptMethodName'
        },
        {
          title: '收款日期',
          align: 'center',
          dataIndex: 'receiptTime'
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
          width: 170
        }
      ],
      url: {
        list: '/erp/mwBillReceipt/queryReceiptListByContractNo',
        recallFlow: '/erp/mwBillReceipt/recallFlow'
      },
      companyId: undefined
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
      this.$refs.stuContractGatheringDetailsModal.edit(record)
      this.$refs.stuContractGatheringDetailsModal.title = '收款单'
      this.$refs.stuContractGatheringDetailsModal.disableSubmit = false
    },

    recall(record) {
      console.log(record.id)
      let id = record.id
      postAction(this.url.recallFlow + '?id=' + id).then(res => {
        console.log(res)
        if (res.code == 200 && !!res.message) {
          this.$message.success('撤回成功!')
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
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less"></style>

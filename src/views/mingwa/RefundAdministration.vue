<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="退款单号">
              <a-input placeholder="请输入收款单号" v-model.trim="queryParam.refundNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="操作类型" prop="taskAction">
                <a-select placeholder="请选择操作类型" v-model.trim="queryParam.taskAction">
                  <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="审核状态" prop="showStatus">
                <a-select placeholder="请选择审核状态" v-model.trim="queryParam.showStatus">
                  <a-select-option v-for="item in dataStatusTypeList.slice(1)" :key="item.itemValue">
                    {{ item.itemText }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left; overflow: hidden" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
              <a @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button type="primary" icon="download" @click="handleExportXls('退款单管理_' + time)">导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" showIcon style="margin-bottom: 16px">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600; padding: 0 4px">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </template>
      </a-alert>

      <a-table
        :scroll="{ x: 'max-content' }"
        class="j-table-force-nowrap"
        ref="table"
        size="middle"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="contractNo" slot-scope="text, record">
          <a @click="tiaozhuan(record)">{{ record.contractNo }}</a>
        </span>
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(taskActionsTypeList) }}
        </span>
        <span slot="showStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(dataStatusTypeList) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="details(record)">详情</a>
          <!--       <a-divider type="vertical" />
          <a @click="auditHistory(record)">审批历史</a>-->
          <a-divider type="vertical" />
          <a @click="stuDetails(record)">学员详情</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 退款单管理详情表单区域 -->
    <apply-refund-modal ref="applyRefundModal" @ok="modalFormOk" />

    <!-- 学员详情 -->
    <stu-details-modal ref="stuDetailsModal" @ok="modalFormOk" />

    <a-modal title="审批历史" v-model="modalLsVisible" :mask-closable="false" :width="'80%'" :footer="null">
      <div v-if="modalLsVisible">
        <component :is="historicDetailMw" :tableId="tableId" :tableName="tableName"></component>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { getAction, downFile } from '@/api/manage'
import ApplyRefundModal from './modules/ApplyRefundModal'
import StuDetailsModal from './modules/StuDetailsModal'

export default {
  name: 'RefundAdministration', //退款单管理
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { JEllipsis, ApplyRefundModal, StuDetailsModal },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      // 表头
      modalLsVisible: false,
      tableId: '',
      tableName: '',
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 60,
          align: 'center',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '退款单号',
          align: 'center',
          dataIndex: 'refundNo'
        },
        {
          title: '合同编号',
          align: 'center',
          dataIndex: 'contractNo',
          scopedSlots: { customRender: 'contractNo' }
        },
        {
          title: '客户/公司名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '申请退款金额(元)',
          align: 'center',
          dataIndex: 'refundApplyAmount'
        },
        {
          title: '客户开户行名称',
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
          width: 170,
          customRender: t => ellipsis(t)
        },
        {
          title: '创建日期',
          align: 'center',
          dataIndex: 'refundApplyTime'
        },
        {
          title: '创建人',
          align: 'center',
          dataIndex: 'createBy'
        },
        {
          title: '操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' }
        },
        {
          title: '审核状态',
          dataIndex: 'showStatus',
          scopedSlots: { customRender: 'showStatus' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 260
        }
      ],
      url: {
        list: '/erp/billRefund/getApplyRefunds',
        exportXlsUrl: '/erp/billRefund/exportXls'
      }
    }
  },
  computed: {
    historicDetailMw: function() {
      return () => import(`@/views/mingwa/historicDetailMw`)
    },
    curTaskKey({ $route }) {
      //从任务列表的Url传过来，此列表对应的是refundNo字段
      return (!!$route.query && !!$route.query.taskKey && $route.query.taskKey) || undefined
    }
  },
  watch: {
    curTaskKey: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam.refundNo = newV
        this.searchQuery()
      }
    }
  },
  methods: {
    details: function(record) {
      this.$refs.applyRefundModal.detail(record)
      this.$refs.applyRefundModal.title = '编辑'
      this.$refs.applyRefundModal.disableSubmit = false
    },

    audit: function(record) {
      this.$refs.refundAdministrationAuditModal.audit(record)
      this.$refs.refundAdministrationAuditModal.title = '退款单审核'
      this.$refs.refundAdministrationAuditModal.disableSubmit = false
    },
    auditHistory: function(record) {
      this.tableId = record.id
      this.tableName = 'mw_task'
      this.modalLsVisible = true
    },

    tiaozhuan: function(record) {
      this.$router.push({
        path:
          '/imingwa/StuContractList/details?id=' +
          record.id +
          '&contractNo=' +
          record.contractNo +
          '&companyName=' +
          record.companyName +
          '&companyId=' +
          record.companyId,
        query: {
          id: record.id,
          contractNo: record.contractNo,
          companyName: record.companyName,
          companyId: record.companyId
        }
      })
    },

    stuDetails(record) {
      this.$refs.stuDetailsModal.details(record)
      this.$refs.stuDetailsModal.title = '学员详情'
      this.$refs.stuDetailsModal.disableSubmit = false
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>

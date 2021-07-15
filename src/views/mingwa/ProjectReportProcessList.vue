<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="工种/级别">
              <a-input placeholder="请输入工种/级别进行查询" v-model.trim="queryParam.workType" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="项目经理">
                <a-input placeholder="请输入业务支持进行查询" v-model.trim="queryParam.manager" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="业务支持">
                <a-input placeholder="请输入业务支持进行查询" v-model.trim="queryParam.supporter" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="班主任">
                <a-input placeholder="请输入班主任进行查询" v-model.trim="queryParam.headmaster" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
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
      <a-button type="primary" icon="download" @click="handleExportXls('项目进度跟踪汇总表_' + time)">导出</a-button>
    </div>

    <!-- table区域-begin -->
    <div>
      <a-alert type="info" showIcon style="margin-bottom: 16px;">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600;padding: 0 4px;">{{ selectedRowKeys.length }}</a>
          <span>项</span>
          <a style="margin-left: 24px" @click="onClearSelected">清空</a>
        </template>
      </a-alert>

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
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <template slot="numAction" slot-scope="text, record">
          <a target="_blank" :href="setUrl(record)">{{ record.totalApplyNum }}</a>
        </template>
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import JDate from '@/components/jeecg/JDate'

export default {
  name: 'ProjectReportProcessList',
  mixins: [JeecgListMixin],
  components: { JEllipsis, JDate },
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '项目进度跟踪汇总表',
      // 表头
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
          title: '合同编号',
          dataIndex: 'contractNo'
        },
        {
          title: '企业名称',
          dataIndex: 'companyName',
          width: 300
        },
        {
          title: '总报名人数',
          dataIndex: 'totalApplyNum',
          scopedSlots: { customRender: 'numAction' }
        },
        {
          title: '总报名证数',
          dataIndex: 'applyCertNum'
        },
        {
          title: '总价',
          dataIndex: 'totalAmount'
        },
        {
          title: '首付日期',
          dataIndex: 'firstPayDate'
        },
        {
          title: '首付金额',
          dataIndex: 'actDuePayment'
        },
        {
          title: '应收尾款',
          dataIndex: 'dueBalance'
        },
        {
          title: '工种/等级',
          dataIndex: 'workType'
        },
        {
          title: '总学习时间',
          dataIndex: 'totalStudyTime'
        },

        {
          title: '总参加理论考试人数',
          dataIndex: 'totalTheoryNum'
        },
        {
          title: '总参加理论考试证数',
          dataIndex: 'theoryCertNum'
        },
        {
          title: '总参加实操考试人数',
          dataIndex: 'totalPracticeNum'
        },
        {
          title: '总参加实操考试证数',
          dataIndex: 'PracticeCertNum'
        },
        {
          title: '总发证证数',
          dataIndex: 'getCertNum'
        },
        {
          title: '总退费证数',
          dataIndex: 'refundCertNum'
        },
        {
          title: '尾款实际收回时间',
          dataIndex: 'balanceRecoveryActualDate'
        },
        {
          title: '项目经理',
          dataIndex: 'manager'
        },
        {
          title: '总退费人数',
          dataIndex: 'refundNum'
        },
        {
          title: '总退费金额',
          dataIndex: 'refundTotalAmount'
        },
        {
          title: '总发证人数',
          dataIndex: 'getCertPersonNum'
        }
      ],
      url: {
        list: '/erp/stuReportProcess/getProjectProcess',
        exportXlsUrl: 'erp/stuReportProcess/exportXls'
      }
    }
  },
  methods: {
    setUrl(record) {
      return '/imingwa/projectReportDetailProcess?contractNo=' + record.contractNo
    }
  }
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>

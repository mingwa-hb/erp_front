<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="身份证号">
              <a-input placeholder="请输入身份证号" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <template v-if="toggleSearchStatus">
            <a-col :md="6" :sm="8">
              <a-form-item label="公司名称">
                <a-input placeholder="请输入公司名称" v-model.trim="queryParam.companyName" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="工种/级别">
                <a-input placeholder="请输入工种/级别" v-model.trim="queryParam.workType" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="8">
              <a-form-item label="项目经理">
                <a-input placeholder="请输入业务支持" v-model.trim="queryParam.manager" />
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
      <a-button type="primary" icon="download" @click="handleExportXls('项目退款明细表_' + time)">导出</a-button>
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
      </a-table>
    </div>
    <!-- table区域-end -->
  </a-card>
</template>

<script>
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
export default {
  name: 'StuRefundDetailList',
  mixins: [JeecgListMixin],
  components: {},
  data() {
    return {
      description: '学员退款明细表',
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
          title: '姓名',
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          dataIndex: 'idCard'
        },
        {
          title: '公司名称',
          dataIndex: 'companyName',
          width: 300
        },
        {
          title: '工种/级别',
          dataIndex: 'workType'
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo'
        },
        {
          title: '项目经理',
          dataIndex: 'manager'
        },
        {
          title: '进账账户',
          dataIndex: 'receiptAccountNo'
        },
        {
          title: '进账日期',
          dataIndex: 'receiptTime'
        },
        {
          title: '实收金额(元)',
          dataIndex: 'receiptAmount'
        },
        {
          title: '退款账户',
          dataIndex: 'refundAccountNo'
        },
        {
          title: '退费日期',
          dataIndex: 'refundTime'
        },
        {
          title: '扣款金额',
          dataIndex: 'cutAmount'
        },
        {
          title: '实退金额',
          dataIndex: 'refundAmount'
        }
      ],
      url: {
        list: '/erp/billRefundStuRelReport/getRefundStuRelReport',
        exportXlsUrl: 'erp/billRefundStuRelReport/exportXls'
      }
    }
  },
  methods: {}
}
</script>
<style scoped>
@import '~@assets/less/common.less';
</style>

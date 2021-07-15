<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名进行查询" v-model.trim="queryParam.userName" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="身份证">
              <a-input placeholder="请输入身份证进行查询" v-model.trim="queryParam.idCard" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="项目经理">
              <a-input placeholder="请输入业务支持进行查询" v-model.trim="queryParam.manager" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-item label="状态">
              <a-select placeholder="请选择状态查询" v-model.trim="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="正常">正常</a-select-option>
                <a-select-option value="离职">离职</a-select-option>
                <a-select-option value="退费">退费</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="8">
            <a-form-item label="工种/级别">
              <a-input placeholder="请输入工种/级别进行查询" v-model.trim="queryParam.workType" />
            </a-form-item>
          </a-col>

          <a-col :md="4" :sm="8">
            <a-form-item label="业务支持">
              <a-input placeholder="请输入业务支持进行查询" v-model.trim="queryParam.supporter" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="班主任">
              <a-input placeholder="请输入班主任进行查询" v-model.trim="queryParam.headmaster" />
            </a-form-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-item label="证书编号">
              <a-input placeholder="请输入证书编号进行查询" v-model.trim="queryParam.certificateNo" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button
              >&nbsp;&nbsp;
              <a-button type="primary" icon="download" @click="handleExportXls('项目进度跟踪明细表_' + time)"
                >导出</a-button
              >
            </span>
          </a-col>
        </a-row>
      </a-form>
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
        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down"/></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>
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
  name: 'ProjectReportProcessDetailList',
  mixins: [JeecgListMixin],
  components: { JEllipsis, JDate },
  created() {},
  data() {
    let ellipsis = (v, l = 20) => <j-ellipsis value={v} length={l} />
    return {
      description: '项目进度跟踪汇总表',
      queryParam: { contractNo: this.$route.query.contractNo },
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
          align: 'center',
          dataIndex: 'contractNo'
        },
        {
          title: '企业名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '学员名单',
          align: 'center',
          dataIndex: 'userName'
        },
        {
          title: '身份证号',
          align: 'center',
          dataIndex: 'idCard'
        },
        {
          title: '总价',
          align: 'center',
          dataIndex: 'totalAmount'
        },
        {
          title: '首付日期',
          align: 'center',
          dataIndex: 'firstPayDate',
          width: 110
        },
        {
          title: '首付金额',
          dataIndex: 'actDuePayment',
          align: 'center',
          width: 110
        },
        {
          title: '应收尾款',
          dataIndex: 'dueBalance',
          align: 'center',
          width: 170
        },
        {
          title: '工种/等级',
          dataIndex: 'workType',
          align: 'center',
          width: 10
        },
        {
          title: '学习时长',
          dataIndex: 'totalStudyTime',
          align: 'center',
          width: 170
        },
        {
          title: '报名时间',
          dataIndex: 'applyDate',
          align: 'center',
          width: 170
        },

        {
          title: '理论考试时间',
          dataIndex: 'examDate',
          align: 'center',
          width: 170
        },
        {
          title: '理论考试分数',
          dataIndex: 'score',
          align: 'center',
          width: 170
        },
        {
          title: '实操考试时间',
          dataIndex: 'operationExamDate',
          align: 'center',
          width: 170
        },
        {
          title: '实操考试分数',
          dataIndex: 'operationScore',
          align: 'center',
          width: 170
        },
        {
          title: '出证时间',
          dataIndex: 'certificatePassDate',
          align: 'center',
          width: 170
        },
        {
          title: '尾款实际收回时间',
          dataIndex: 'balanceRecoveryActualDate',
          align: 'center',
          width: 170
        },
        {
          title: '项目经理',
          dataIndex: 'manager',
          align: 'center',
          width: 170
        },
        {
          title: '是否退费',
          dataIndex: 'status',
          align: 'center',
          width: 170
        },
        {
          title: '备注',
          dataIndex: 'remark',
          align: 'center',
          width: 170
        }
      ],
      url: {
        list: '/erp/stuReportProcessDetail/getProjectProcessDetail',
        exportXlsUrl: 'erp/stuReportProcessDetail/exportXls'
      }
    }
  },
  methods: {}
}
</script>
<style scoped>
@import '~@assets/less/common.less';
@import '~@/assets/less/TableExpand.less';
</style>

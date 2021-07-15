<template>
  <a-card class="a-card">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" class="inquire" @keyup.enter.native="searchQuery">
        <a-row :gutter="24" class="search">
          <a-col :md="6" :sm="8">
            <a-form-item label="合同编号">
              <a-input placeholder="请输入合同编号进行查询" v-model.trim="queryParam.contractNo" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="公司名称">
              <a-input placeholder="请输入公司名称进行查询" v-model.trim="queryParam.companyName" />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-item label="计划状态">
              <a-select v-model="queryParam.planStatus" placeholder="全部计划">
                <a-select-option value="未开始">未开始</a-select-option>
                <a-select-option value="进行中">进行中</a-select-option>
                <a-select-option value="已完成">已完成</a-select-option>
              </a-select>
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
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
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
      <a-button class="btn" type="primary" icon="download" @click="handleExportXls('计划管理列表_' + time)"
        >导出</a-button
      >
      <a-button class="btn" type="primary" icon="download" @click="downLoadAccessory('计划附件_' + time)"
        >导出附件</a-button
      >
      <a-button class="btn" type="primary" icon="reload" @click="autoRefreshPlanStats()">刷新计划状态</a-button>
      <a-col :md="6" :sm="8" class="searchReload" style="float: right; overflow: hidden"></a-col>
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
        :columns="columns"
        rowKey="id"
        :dataSource="dataSource"
        :pagination="ipagination"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(taskActionsTypeList) }}
        </span>
        <span slot="showStatus" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(dataStatusTypeList) }}
        </span>
        <span slot="action" slot-scope="text, record" v-has="'PlanAdministrateListEdit:edit'">
          <template v-if="record.dataStatus == 1 || record.dataStatus == 4 || record.dataStatus == 5">
            <a @click="handleEdit(record)">编辑</a>
            <!-- <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
              <a>删除</a>
            </a-popconfirm> -->
          </template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框表单区域 -->
    <PlanListEditModal ref="modalForm" @ok="modalFormOk" />
  </a-card>
</template>

<script>
import queryCodeListMixin from '@/mixins/queryCodeListMixin'
import { JeecgListMixin } from './mixins/JeecgListMixin'
import PlanListEditModal from './modules/PlanListEditModal'
import ajax from '../../api/modules/pmoPlanManage'

export default {
  name: 'PlanAdministrateList', //工作计划管理
  mixins: [queryCodeListMixin, JeecgListMixin],
  components: { PlanListEditModal },
  props: {},
  data() {
    return {
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: '',
          key: 'rowIndex',
          fixed: 'left',
          width: 60,
          customRender: function(t, r, index) {
            return parseInt(index) + 1
          }
        },
        {
          title: '计划编号',
          dataIndex: 'planNo',
          align: 'center',
          fixed: 'left'
        },
        {
          title: '合同编号',
          dataIndex: 'contractNo',
          align: 'center',
          fixed: 'left'
        },
        {
          title: '公司名称',
          align: 'center',
          dataIndex: 'companyName'
        },
        {
          title: '计划制定人',
          align: 'center',
          dataIndex: 'planCreateBy'
        },
        {
          title: '计划开始日期',
          align: 'center',
          dataIndex: 'planStartTime'
        },
        {
          title: '计划截止日期',
          align: 'center',
          dataIndex: 'planEndTime'
        },
        {
          title: '计划状态',
          align: 'center',
          dataIndex: 'planStatus'
        },
        {
          title: '项目经理',
          align: 'center',
          dataIndex: 'manager'
        },
        {
          title: '合同签订日期',
          align: 'center',
          dataIndex: 'signDate'
        },
        {
          title: '合同截止日期',
          align: 'center',
          dataIndex: 'deadLine'
        },
        {
          title: '合同状态',
          align: 'center',
          dataIndex: 'contractStatus'
        },
        {
          title: '报名负责人',
          align: 'center',
          dataIndex: 'applyAdmin'
        },
        {
          title: '报名计划开始日期',
          width: 200,
          align: 'center',
          dataIndex: 'applyPlanStartTime'
        },
        {
          title: '报名计划截止日期',
          align: 'center',
          dataIndex: 'applyPlanEndTime'
        },
        {
          title: '报名实际开始日期',
          align: 'center',
          dataIndex: 'applyRealityStartTime'
        },
        {
          title: '报名实际完成日期',
          align: 'center',
          dataIndex: 'applyRealityEndTime'
        },
        {
          title: '报名状态',
          align: 'center',
          dataIndex: 'applyStatus'
        },
        {
          title: '学习负责人',
          align: 'center',
          dataIndex: 'studyAdmin'
        },
        {
          title: '学习计划开始日期',
          align: 'center',
          dataIndex: 'studyPlanStartTime'
        },
        {
          title: '学习计划截止日期',
          align: 'center',
          dataIndex: 'studyPlanEndTime'
        },
        {
          title: '学习实际开始日期',
          align: 'center',
          dataIndex: 'studyRealityStartTime'
        },
        {
          title: '学习实际完成日期',
          align: 'center',
          dataIndex: 'studyRealityEndTime'
        },
        {
          title: '学习状态',
          align: 'center',
          dataIndex: 'studyStatus'
        },
        {
          title: '考试负责人',
          align: 'center',
          dataIndex: 'examAdmin'
        },
        {
          title: '考试计划开始日期',
          align: 'center',
          dataIndex: 'examPlanStartTime'
        },
        {
          title: '考试计划截止日期',
          align: 'center',
          dataIndex: 'examPlanEndTime'
        },
        {
          title: '考试实际开始日期',
          align: 'center',
          dataIndex: 'examRealityStartTime'
        },
        {
          title: '考试实际完成日期',
          align: 'center',
          dataIndex: 'examRealityEndTime'
        },
        {
          title: '考试状态',
          align: 'center',
          dataIndex: 'examStatus'
        },
        {
          title: '证书负责人',
          align: 'center',
          dataIndex: 'certificateAdmin'
        },
        {
          title: '发证计划开始日期',
          align: 'center',
          dataIndex: 'certificatePlanStartTime'
        },
        {
          title: '发证计划截止日期',
          align: 'center',
          dataIndex: 'certificatePlanEndTime'
        },
        {
          title: '发证实际开始日期',
          align: 'center',
          dataIndex: 'certificateRealityStartTime'
        },
        {
          title: '发证实际完成日期',
          align: 'center',
          dataIndex: 'certificateRealityEndTime'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'remark'
        },
        {
          title: '证书发放状态',
          align: 'center',
          dataIndex: 'certificateStatus'
        },
        {
          title: '操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' },
          align: 'center',
          fixed: 'right'
        },
        {
          title: '审核状态',
          dataIndex: 'showStatus',
          scopedSlots: { customRender: 'showStatus' },
          align: 'center',
          fixed: 'right'
        },
        {
          title: '操作',
          align: 'center',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 100,
          fixed: 'right'
        }
      ],
      url: {
        list: '/erp/mwPmoPlan/list',
        delete: '/erp/student/delete',
        deleteBatch: '/erp/student/deleteBatch',
        exportXlsUrl: '/erp/mwPmoPlan/exportXls',
        importExcelUrl: 'erp/student/importExcel',
        importZIPUrl: 'erp/student/uplodLoadPics',
        exportFilesUrl: '/erp/mwPmoPlan/exportAllFile'
      }
    }
  },
  computed: {
    curTaskKey({ $route }) {
      //从任务列表的Url传过来，此列表对应的是contractNo字段
      return (!!$route.query && !!$route.query.taskKey && $route.query.taskKey) || undefined
    }
  },
  watch: {
    curTaskKey: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.queryParam.contractNo = newV
        this.searchQuery()
      }
    }
  },
  methods: {
    autoRefreshPlanStats() {
      ajax.updatePlanStatusAutoJob().then(res => {
        if (res.code == 200 && !!res.message) {
          this.loadData()
          this.$message.info(res.result)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
@import '~@assets/less/common.less';
</style>

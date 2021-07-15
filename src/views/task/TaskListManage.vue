<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" ref="ruleForm" :model="queryParam" :rules="rules">
        <a-row :gutter="24">
          <a-col :md="6" :sm="8">
            <a-form-model-item label="任务名称" prop="taskName">
              <a-input placeholder="请输入任务名称，模糊搜索" v-model.trim="queryParam.taskName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="任务类型" prop="taskModule">
              <a-select placeholder="请选择任务类型" v-model.trim="queryParam.taskModule">
                <a-select-option v-for="item in taskModuleTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="操作类型" prop="taskAction">
              <a-select placeholder="请选择任务操作类型" v-model.trim="queryParam.taskAction">
                <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <a-form-model-item label="任务状态" prop="taskStatus">
              <a-select placeholder="请选择任务状态" v-model.trim="queryParam.taskStatus">
                <a-select-option v-for="item in task_status_type_list" :key="item.code">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="6" :sm="8">
            <a-form-model-item label="流程状态" prop="auditStatus">
              <a-input placeholder="请输入流程状态" v-model.trim="queryParam.auditStatus" />
            </a-form-model-item>
          </a-col>

          <a-col :md="6" :sm="8">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
              <a v-if="!!false" @click="handleToggleSearch" style="margin-left: 8px">
                {{ toggleSearchStatus ? '收起' : '展开' }}
                <a-icon :type="toggleSearchStatus ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <!-- table区域-begin -->
    <div class="table-list-wrapper">
      <a-alert type="info" showIcon style="margin-bottom: 16px;">
        <template slot="message">
          <span>已选择</span>
          <a style="font-weight: 600;padding: 0 4px;">{{ selectedRowKeys.length }}</a>
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
        :rowKey="
          (record, index) => {
            return index
          }
        "
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
        @change="handleTableChange"
      >
        <span slot="taskName" slot-scope="text, record">
          <a target="_blank" :href="detailUrl(record)">{{ record.taskName }}</a>
        </span>
        <span slot="taskModule" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(task_module) }}
          <a-button v-if="record.taskStatus == 1" type="danger" size="small" shape="circle">
            <template v-if="record.taskType == 1">审</template>
            <template v-else>消</template>
          </a-button>
        </span>
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(task_action) }}
        </span>
        <span slot="taskStatus" slot-scope="text, record">
          {{ text | getTaskTextByCode(task_status_type_list) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a target="_blank" :href="detailUrl(record)">任务预览</a>
          <template v-if="record.taskType == 1 && record.taskStatus == 1">
            <a-divider type="vertical" />
            <a @click="handleCheck(record)" v-if="record.taskModule == 9">审核</a>
            <a @click="handleAuditTask(record)" v-else> 审核</a>
          </template>
          <template v-if="record.taskType == 1">
            <a-divider type="vertical" />
            <a @click="auditHistory(record)">审批历史</a>
          </template>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框区域 -->
    <TaskAuditModal ref="taskAuditFormModal" @renovate="refreshTableList" />

    <student-check-modal ref="modalForm" @ok="modalFormOk" />

    <a-modal title="审批历史" v-model="modalLsVisible" :mask-closable="false" :width="'80%'" :footer="null">
      <div v-if="modalLsVisible">
        <component :is="historicDetailMw" :tableId="tableId" :tableName="tableName"></component>
      </div>
    </a-modal>
  </a-card>
</template>

<script>
import { getAction } from '@/api/manage'
import { taskApiList } from '@/api/api'
import mixin_task from './mixins/TaskListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import StudentCheckModal from '@/views/mingwa/modules/StudentCheckModal'
import TaskAuditModal from './modules/TaskAuditModal'

export default {
  name: 'TaskListManage', //任务管理列表
  mixins: [mixin_task, JeecgListMixin],
  components: { StudentCheckModal, TaskAuditModal },
  props: {},
  data() {
    return {
      modalLsVisible: false,
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
          title: '任务名称',
          dataIndex: 'taskName',
          scopedSlots: { customRender: 'taskName' }
        },
        {
          title: '任务描述',
          dataIndex: 'taskDesc'
        },
        {
          title: '任务类型',
          dataIndex: 'taskModule',
          scopedSlots: { customRender: 'taskModule' }
        },
        {
          title: '操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' }
        },
        {
          title: '任务状态',
          dataIndex: 'taskStatus',
          scopedSlots: { customRender: 'taskStatus' }
        },
        {
          title: '流程状态',
          dataIndex: 'auditStatus'
        },
        {
          title: '完成个数',
          dataIndex: 'finishNum'
        },
        {
          title: '总个数',
          dataIndex: 'totalNum'
        },
        {
          title: '创建人',
          dataIndex: 'createBy'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          align: 'center',
          width: 200
        }
      ],
      url: {
        list: '/erp/task/getTaskList',
        getUserInfoByApplyInfoId: '/userAudit/getUserInfoByApplyInfoId'
      },
      queryParam: {
        taskName: undefined,
        taskModule: undefined,
        taskStatus: undefined,
        taskAction: undefined
      },
      rules: {
        taskModule: [{ required: false, message: '请选择模版所属模块', trigger: 'change' }]
      }
    }
  },
  computed: {
    detailUrl({ getPreviewTaskUrl }) {
      return record => {
        return getPreviewTaskUrl(record)
      }
    },
    curTaskName({ $route }) {
      return (!!$route.query && !!$route.query.taskName && $route.query.taskName) || undefined
    },
    historicDetailMw: function() {
      return () => import(`@/views/mingwa/historicDetailMw`)
    }
  },
  created() {},
  watch: {
    curTaskName: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        //设置form中的columnField
        this.queryParam.taskName = newV
        !!newV && this.searchQuery()
      }
    }
  },
  methods: {
    getPreviewTaskUrl(record) {
      let url = 'javascript:;'
      let modulesUrlList = this.modules_url_type_list
      if (!!record.taskModule) {
        let target = _.find(modulesUrlList, ['type', Number(record.taskModule)])
        url = !!target ? target.url : 'javascript:;'
      }
      if (!!record.taskKey) {
        url = url + '?taskKey=' + record.taskKey
      }
      if (!!record.taskKey2) {
        url = url + '&taskKey2=' + record.taskKey2
      }
      return url
    },
    handleAuditTask(record) {
      this.$refs.taskAuditFormModal.edit(record)
    },
    handleCheck(record) {
      // console.log(record)
      if (!!record.busiId) {
        getAction(this.url.getUserInfoByApplyInfoId + '/' + record.busiId).then(res => {
          // console.log(res.result)
          if (res.code == 200 || (res.code == 0 && !!res.success)) {
            let resp = Object.assign({ taskId: record.id }, res.result)
            this.$refs.modalForm.edit(resp, 1)
            this.$refs.modalForm.title = '审核'
            this.$refs.modalForm.disableSubmit = false
          } else {
            this.$message.error(res.message || `获取报名ID为${record.busiId}失败！`)
          }
        })
      } else {
        this.$message.error('报名busiId缺失，请重新刷新页面！')
      }
    },
    refreshTableList() {
      this.loadData()
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
<style lang="less" scoped></style>

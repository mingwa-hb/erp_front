<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" ref="ruleForm" :model="queryParam" :rules="rules">
        <a-row :gutter="24">
          <a-col :md="5" :sm="8">
            <a-form-model-item label="模版名称" prop="settingName">
              <a-input placeholder="请输入任务模版名称，模糊搜索" v-model.trim="queryParam.settingName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-model-item label="模版所属模块" prop="taskModule">
              <a-select placeholder="请选择模版所属模块" v-model.trim="queryParam.taskModule">
                <a-select-option v-for="item in taskModuleTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-model-item label="模版操作类型" prop="taskAction">
              <a-select placeholder="请选择任务模版操作类型" v-model.trim="queryParam.taskAction">
                <a-select-option v-for="item in taskActionsTypeList.slice(1)" :key="item.itemValue">
                  {{ item.itemText }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-model-item label="模版状态" prop="settingStatus">
              <a-select placeholder="请选择任务模版状态" v-model.trim="queryParam.settingStatus">
                <a-select-option v-for="item in task_temp_status_type_list.slice(1)" :key="item.code">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleAddTemp('add')">新增任务模版</a-button>
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
        <span slot="settingName" slot-scope="text, record">
          <a @click="handlePreviewTemp(record)">{{ record.settingName }}</a>
        </span>
        <span slot="taskModule" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(task_module) }}
        </span>
        <span slot="taskAction" slot-scope="text, record">
          {{ text | getCodeItemTextByCode(task_action) }}
        </span>
        <span slot="settingStatus" slot-scope="text, record">
          {{ text | getTaskTextByCode(task_temp_status_type_list) }}
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="handleEditTemp(record)">编辑</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框区域 -->
    <TaskTemplateFormModal ref="taskTempFormModal" @renovate="refreshTableList" />
  </a-card>
</template>

<script>
import { taskApiList } from '@/api/api'
import mixin_task from './mixins/TaskListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import SelectDemo from '@/views/jeecg/SelectDemo' //测试用的  可删可不删
import TaskTemplateFormModal from './modules/TaskTemplateFormModal'

export default {
  name: 'TaskTemplateList', //任务模版列表
  mixins: [mixin_task, JeecgListMixin],
  components: { SelectDemo, TaskTemplateFormModal },
  props: {},
  data() {
    return {
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
          title: '模版名称',
          dataIndex: 'settingName',
          scopedSlots: { customRender: 'settingName' }
        },
        {
          title: '模版描述',
          dataIndex: 'settingContent',
          width: 600
        },
        {
          title: '模版所属模块',
          dataIndex: 'taskModule',
          scopedSlots: { customRender: 'taskModule' }
        },
        {
          title: '模版操作类型',
          dataIndex: 'taskAction',
          scopedSlots: { customRender: 'taskAction' }
        },
        {
          title: '模版状态',
          dataIndex: 'settingStatus',
          scopedSlots: { customRender: 'settingStatus' }
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
          width: 120
        }
      ],
      url: {
        list: '/erp/taskSettings/getTaskList'
      },
      queryParam: {
        settingName: undefined,
        taskModule: undefined,
        settingStatus: undefined,
        taskAction: undefined
      },
      rules: {
        taskModule: [{ required: false, message: '请选择模版所属模块', trigger: 'change' }]
      }
    }
  },
  computed: {},
  created() {},
  watch: {},
  methods: {
    handleShowTaskTempModal(type = 'add', record = null) {
      this.$refs.taskTempFormModal.handleAct(type, record)
    },
    handleAddTemp() {
      this.handleShowTaskTempModal('add')
    },
    handleEditTemp(record) {
      this.handleShowTaskTempModal('edit', record)
    },
    handlePreviewTemp(record) {
      this.handleShowTaskTempModal('preview', record)
    },
    refreshTableList() {
      this.loadData()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>

<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" ref="ruleForm" :model="queryParam" :rules="rules">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-model-item label="计划名称" prop="companyName">
              <a-input placeholder="请输入计划名称，模糊搜索" v-model.trim="queryParam.scheduleName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-model-item label="项目类型" prop="projectTypeId">
              <a-select placeholder="请选择项目分类" v-model.trim="queryParam.projectType">
                <a-select-option
                  v-for="item in projectTypeList.slice(1)"
                  :key="item.itemValue"
                  :disabled="item.itemValue == 3"
                >{{ item.itemText }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="3" :sm="8">
            <a-form-model-item label="计划状态" prop="workTypeId">
              <a-select placeholder="请选择计划状态" v-model.trim="queryParam.status">
                <a-select-option value="">全部</a-select-option>
                <a-select-option value="1">未考试</a-select-option>
                <a-select-option value="2">考试中</a-select-option>
                <a-select-option value="3">已结束</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="3" :sm="8">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" icon="search" @click="searchQuery">查询</a-button>
              <a-button type="primary" icon="reload" style="margin-left: 8px" @click="searchReset">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="switcher" @click="handleShowGenerateModal('manual')">创建计划</a-button>
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
          <a @click="goToTestManagePage(record)">考试管理</a>
          <a-divider type="vertical"/>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm  title="确定删除吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </span>
        <span slot="projectType" slot-scope="record">
          <span v-if="record === 1">职业技能提升</span>
          <span v-if="record === 2">创业培训</span>
          <span v-if="record === 3">新学徒</span>
        </span>
        <span slot="examType" slot-scope="record">
          <span v-if="record === 1">正式考试</span>
          <span v-if="record === 2">模拟考试</span>
          <span v-if="record === 3">单元考试</span>
        </span>
        <span slot="examMode" slot-scope="record">
          <span v-if="record === 1">线上考试</span>
          <span v-if="record === 2">线下考试</span>
        </span>
        <span slot="questionScope" slot-scope="record">
          <span v-if="record === 1">半年</span>
          <span v-if="record === 2">一年</span>
          <span v-if="record === 3">两年</span>
          <span v-if="record === 4">无</span>
        </span>
        <span slot="status" slot-scope="record">
          <span v-if="record === '1'">未考试</span>
          <span v-if="record === '2'">考试中</span>
          <span v-if="record === '3'">已结束</span>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框区域 -->
    <CreateTestPlanModal ref="generateModalForm" @ok="refreshData"/>
  </a-card>
</template>

<script>
  import _ from 'lodash'

  import { tikuApiList } from '@/api/api'

  import mixin_tiku from './mixins/TikuListMixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'

  import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
  import CreateTestPlanModal from './modules/CreateTestPlanModal'

  export default {
    name: 'TestPlanManage', //试卷管理
    mixins: [mixin_tiku, JeecgListMixin],
    components: { JSelectWorkTypeForTiku, CreateTestPlanModal },
    props: {},
    data() {
      return {
        // 表头
        columns: [
          {
            title: '序号',
            dataIndex: '',
            key: 'rowIndex',
            width: '3%',
            align: 'center',
            customRender: (t, r, index) => index + 1
          },
          {
            title: '计划名称',
            width: '10%',
            dataIndex: 'scheduleName'
          },
          {
            title: '项目类型',
            dataIndex: 'projectType',
            width: '10%',
            scopedSlots: { customRender: 'projectType' }
          },
          {
            title: '工种',
            width: '10%',
            dataIndex: 'workTypeIds'
          },
          {
            title: '考试类型',
            dataIndex: 'examType',
            width: '5%',
            scopedSlots: { customRender: 'examType' }
          },
          {
            title: '考试形式',
            dataIndex: 'examMode',
            width: '5%',
            scopedSlots: { customRender: 'examMode' }
          },
          {
            title: '考试范围',
            dataIndex: 'questionScope',
            width: '5%',
            scopedSlots: { customRender: 'questionScope' }
          },
          {
            title: '状态',
            dataIndex: 'status',
            width: '5%',
            scopedSlots: { customRender: 'status' }
          },
          {
            title: '开始时间',
            width: '10%',
            dataIndex: 'startTime'
          },
          {
            title: '结束时间',
            width: '10%',
            dataIndex: 'endTime'
          },
          {
            title: '创建人',
            width: '5%',
            dataIndex: 'createBy'
          },
          {
            title: '创建时间',
            width: '10%',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            scopedSlots: { customRender: 'action' },
            width: '10%',
          }
        ],
        url: {
          list: window._CONFIG['examServiceURL'] + '/erp/exam/schedule/list',
          delete: window._CONFIG['examServiceURL'] + '/erp/exam/schedule/delete',
          deleteBatch: '/erp/student/deleteBatch'
        },
        queryParam: {
          scheduleName: undefined,
          projectType: undefined,
          // workType: undefined,
          // workTypeId: undefined,
          status: undefined
        },
        rules: {
          projectTypeId: [{ required: false, message: '请选择项目分类', trigger: 'change' }]
        }
      }
    },
    computed: {},
    created() {},
    watch: {},
    methods: {
      refreshData(){
        // 新增/修改 成功时，重载列表
        this.loadData();
      },
      handleShowGenerateModal() {
        this.$refs.generateModalForm.add()
      },
      handleEdit(record) {
        this.$refs.generateModalForm.edit(record);
      },


      onChangeWorkType() {
        this.queryParam.workTypeId = undefined
      },
      goToTestManagePage(record){
        this.$router.push({ path: '/itiku/TestManagePage', query: { testPlanId: record.id } });
      },
      searchReset() {
        console.log('11')
        this.queryParam = {}
        this.loadData(1);
      },
    },
    mounted() {}
  }
</script>
<style lang="less" scoped></style>

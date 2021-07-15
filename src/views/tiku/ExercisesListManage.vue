<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" ref="ruleForm" :model="queryParam">
        <a-row :gutter="24">
          <a-col :md="5" :sm="8">
            <a-form-model-item label="习题名称" prop="exerciseName">
              <a-input placeholder="请输入习题名称，模糊搜索" v-model.trim="queryParam.exerciseName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-model-item label="项目分类" prop="projectType">
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
          <a-col :md="6" :sm="8">
            <a-form-model-item label="工种类型" prop="workTypeName">
              <j-select-work-type-for-tiku
                placeholder="请选择工种类型"
                :multiple="false"
                v-model.trim="queryParam.workTypeName"
                @change="onChangeWorkType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="5" :sm="8">
            <a-form-model-item label="工种等级" prop="workTypeId">
              <a-select placeholder="请选择工种等级" v-model.trim="queryParam.workTypeId">
                <a-select-option v-for="item in worktypeLevelTypeList" :key="item.id">{{
                  item.workLevel
                }}</a-select-option>
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
      <a-button type="primary" icon="plus" @click="handleShowEditExcercisesModal('add')">添加习题</a-button>
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
          <a @click="handleShowEditExcercisesModal('edit', record)">编辑</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除此习题吗?" @confirm="() => handleDelete(record.id)">
            <a>删除</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a @click="handleExport(record)">导出习题</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框区域 -->
    <ExercisesEditModal ref="editExercisesModalForm" @ok="refreshTableList" />

    <ExercisesExportModal ref="exportExercisesModal" @doExport="doExport" />
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'

import mixin_tiku from './mixins/TikuListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import ExercisesEditModal from './modules/ExercisesEditModal'
import ExercisesExportModal from './modules/ExercisesExportModal'

export default {
  name: 'ExercisesListManage', //习题管理
  mixins: [mixin_tiku, JeecgListMixin],
  components: { JSelectWorkTypeForTiku, ExercisesEditModal, ExercisesExportModal },
  props: {},
  data() {
    return {
      worktypeLevelTypeList: [], //工种等级列
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
          title: '习题名称',
          dataIndex: 'exerciseName'
        },
        {
          title: '项目分类',
          dataIndex: 'projectTypeStr'
        },
        {
          title: '工种',
          dataIndex: 'workTypeName'
        },
        {
          title: '工种等级',
          dataIndex: 'workTypeLevel'
        },
        {
          title: '试题剔除范围',
          dataIndex: 'exerciseScopeStr'
        },
        {
          title: '习题数量',
          dataIndex: 'totalNum'
        },
        {
          title: '创建人人',
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
          width: 240
        }
      ],
      url: {
        list: '/mw-exam/erp/exam/exerciseSets/list', //'/mw-exam/erp/exam/paper/list'
        delete: '/mw-exam/erp/exam/exerciseSets/delete',
        exportAnswer: '/erp/exam/paper/exportAnswer'
      },
      queryParam: {
        exerciseName: undefined,
        projectType: undefined,
        workTypeName: undefined,
        workTypeId: undefined
      }
    }
  },
  computed: {},
  created() {},
  watch: {
    'queryParam.workTypeName': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          this.getWorklevelTypeList(newV)
        }
      }
    }
  },
  methods: {
    handleShowEditExcercisesModal(type = 'add', record = null) {
      this.$refs.editExercisesModalForm.initModal(type, record)
    },
    onChangeWorkType() {
      //清空工种等级的下拉框数据
      this.queryParam.workTypeId = undefined
      this.worktypeLevelTypeList = []
    },
    handleExport(record) {
      this.$refs.exportExercisesModal.initModal(record)
    },
    doExport(data) {
      let id = data.exerciseId
      let apiUrl = data.fileType == 1 ? 'erp/exam/exerciseSets/exportDoc' : 'erp/exam/exerciseSets/exportXls' //1是word 2是excel
      if (!!id) {
        let apiUrl = `${window._CONFIG['examServiceURL']}/${apiUrl}?exerciseId=${id}`
        window.open(apiUrl, '_blank')
      } else {
        this.$message.error('习题ID没不存在，请重新刷新列表！')
      }
    },
    getWorklevelTypeList(workType) {
      let opts = {
        workType: workType
      }
      tikuApiList.getWorkLevelByWorkType(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          this.worktypeLevelTypeList = res.result
        } else {
          this.$message.error(res.message || '获取工种等级列表失败！')
        }
      })
    },
    refreshTableList() {
      this.loadData()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped></style>

<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="table-page-search-wrapper">
      <a-form-model layout="inline" @keyup.enter.native="searchQuery" ref="ruleForm" :model="queryParam" :rules="rules">
        <a-row :gutter="24">
          <a-col :md="4" :sm="8">
            <a-form-model-item label="试卷名称" prop="paperName">
              <a-input placeholder="请输入试卷名称，模糊搜索" v-model.trim="queryParam.paperName" />
            </a-form-model-item>
          </a-col>
          <a-col :md="4" :sm="8">
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
            <a-form-model-item label="工种" prop="workTypeName">
              <j-select-work-type-for-tiku
                placeholder="请选择工种"
                :multiple="false"
                v-model.trim="queryParam.workTypeName"
                @change="onChangeWorkType"
              />
            </a-form-model-item>
          </a-col>
          <a-col :md="4" :sm="8">
            <a-form-model-item label="工种等级" prop="workTypeId">
              <a-select placeholder="请选择工种等级" v-model.trim="queryParam.workTypeId">
                <a-select-option v-for="item in worktypeLevelTypeList" :key="item.id">{{
                  item.workLevel
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :md="3" :sm="8">
            <a-form-model-item label="审核状态" prop="auditStatus">
              <a-select placeholder="请选择审核状态" v-model.trim="queryParam.auditStatus">
                <a-select-option v-for="item in statusTypeList.slice(3)" :key="item.code">
                  {{ item.label }}
                </a-select-option>
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
        <span slot="paperName" slot-scope="text, record">
          <a target="_blank" :href="'/itiku/PreviewTestPaperPage?paperId=' + record.id" :title="record.paperName">{{
            record.paperName
          }}</a>
        </span>
        <span slot="action" slot-scope="text, record">
          <a target="_blank" :href="'/itiku/PreviewTestPaperPage?paperId=' + record.id">预览试卷</a>
          <a-divider type="vertical" />
          <a @click="handleAuditPass(record)">
            审核<template v-if="record.auditStatus == 4 || record.auditStatus == 5">详情</template>
          </a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!--试卷审核的弹框-->
    <PaperAuditModal ref="auditPaperFormModal" @renovate="refreshTableList" />
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'
import TYPELIST from './data/test_paper_type_list'

import mixin_tiku from './mixins/TikuListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import PaperAuditModal from './modules/PaperAuditModal'

export default {
  name: 'TestPaperAuditManage', //试卷审核管理
  mixins: [mixin_tiku, JeecgListMixin],
  components: { JSelectWorkTypeForTiku, PaperAuditModal },
  props: {},
  data() {
    return {
      statusTypeList: TYPELIST.TESTPAPER_STATUS_TYPE_LIST,
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
          title: '试卷名称',
          dataIndex: 'paperName',
          scopedSlots: { customRender: 'paperName' }
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
          title: '组卷方式',
          dataIndex: 'paperModeStr'
        },
        {
          title: '组卷人',
          dataIndex: 'createBy'
        },
        {
          title: '组卷时间',
          dataIndex: 'createTime'
        },
        {
          title: '审核状态',
          dataIndex: 'auditStatusStr'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 200
        }
      ],
      url: {
        list: '/mw-exam/erp/exam/paper/pageAuditList'
      },
      queryParam: {
        paperName: undefined,
        projectType: undefined,
        workTypeName: undefined,
        workTypeId: undefined,
        auditStatus: undefined
      },
      rules: {
        projectType: [{ required: false, message: '请选择项目分类', trigger: 'change' }]
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
    handleAuditPass(record) {
      this.$refs.auditPaperFormModal.setPaperInfo(record)
      this.$refs.auditPaperFormModal.showModal()
    },
    onChangeWorkType() {
      //清空工种等级的下拉框数据
      this.queryParam.workTypeId = undefined
    },
    getWorklevelTypeList(workType) {
      let opts = {
        workType: workType
      }
      tikuApiList.getWorkLevelByWorkType(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          // this.$message.success(res.message || '新增成功！')
          this.worktypeLevelTypeList = res.result
          // this.form.workTypeId = undefined;
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

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
            <a-form-model-item label="工种类型" prop="workTypeName">
              <j-select-work-type-for-tiku
                placeholder="请选择工种类型"
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
            <a-form-model-item label="试卷状态" prop="auditStatus">
              <a-select placeholder="请选择试卷状态" v-model.trim="queryParam.auditStatus">
                <a-select-option v-for="item in statusTypeList.slice(1)" :key="item.code">
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

    <div class="table-operator">
      <a-button type="primary" icon="switcher" @click="handleShowGenerateModal('manual')">手动组卷</a-button>
      <a-button type="primary" icon="robot" @click="handleShowGenerateModal('automatic')">智能组卷</a-button>
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
          <template v-if="record.paperVersion == 1">
            <template v-if="record.auditStatus == 1 || record.auditStatus == 2 || record.auditStatus == 5">
              <a @click="handlePublishPaper(record)"><template v-if="record.auditStatus == 5">重新</template>发布</a>
              <a-divider type="vertical" />
              <a @click="handleReGeneratePaper(record)"><template v-if="record.questionNum > 0">重新</template>生成</a>
              <a-divider type="vertical" />
              <a @click="handleEditPaper(record)">编辑试卷</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除吗?" @confirm="() => handleDeletePaper(record)">
                <a>删除</a>
              </a-popconfirm>
              <a-divider type="vertical" />
            </template>
            <template v-if="record.auditStatus == 3">
              <a @click="handleCancelPublishPaper(record)">取消发布</a>
              <a-divider type="vertical" />
            </template>
            <template
              v-if="
                record.auditStatus == 4 &&
                  record.paperVersion === '1' &&
                  record.relId === '-1' &&
                  record.childPaperNum === 0
              "
            >
              <a @click="handleCreatePaperVersionB(record)">生成B卷</a>
              <a-divider type="vertical" />
            </template>
          </template>
          <a target="_blank" :href="'/itiku/PreviewTestPaperPage?paperType=export&paperId=' + record.id">导出</a>
          <a-divider type="vertical" />
          <a @click="handleExportAnswer(record)">导出答案</a>
        </span>
      </a-table>
    </div>
    <!-- table区域-end -->

    <!-- 弹框区域 -->
    <GenerateTestPaperModal ref="generateModalForm" />
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'
import TYPELIST from './data/test_paper_type_list'

import mixin_tiku from './mixins/TikuListMixin'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import GenerateTestPaperModal from './modules/GenerateTestPaperModal'

export default {
  name: 'TestPaperPondManage', //试卷管理
  mixins: [mixin_tiku, JeecgListMixin],
  components: { JSelectWorkTypeForTiku, GenerateTestPaperModal },
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
          title: '试卷类型',
          dataIndex: 'paperTypeStr'
        },
        {
          title: '试题剔除范围',
          dataIndex: 'paperScopeStr'
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
          title: '状态',
          dataIndex: 'auditStatusStr'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 400
        }
      ],
      url: {
        list: '/mw-exam/erp/exam/paper/list', //paperVersion    试卷版号(1-A卷，2-B卷，3-C卷，4-D卷)
        exportAnswer: '/erp/exam/paper/exportAnswer'
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
    handleShowGenerateModal(type = 'automatic') {
      this.$refs.generateModalForm.add(type)
    },
    onChangeWorkType() {
      //清空工种等级的下拉框数据
      this.queryParam.workTypeId = undefined
    },
    goToTqManualSelectPage(id) {
      this.$router.push({ path: '/itiku/TestPaperManualSelect', query: { paperId: id } })
    },
    goToTqAutoSelectPage(id) {
      this.$router.push({ path: '/itiku/TestPaperAutoSelect', query: { paperId: id } })
    },
    goToEditTestPaperPage(id) {
      this.$router.push({ path: '/itiku/EidtTestPaperPage', query: { paperId: id } })
    },
    handleReGeneratePaper(record) {
      let id = record.id
      if (!!id) {
        if (record.paperMode == 1) {
          this.goToTqManualSelectPage(id)
        } else {
          this.goToTqAutoSelectPage(id)
        }
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    handlePublishPaper(record) {
      let that = this
      this.$confirm({
        title: '重要提醒！',
        content: `确定发布试卷名为【${record.paperName}】的试卷吗?`,
        onOk: () => {
          let opts = {
            paperId: record.id,
            auditStatus: 3
          }
          that.updatePaperStatus(opts)
        }
      })
    },
    handleCancelPublishPaper(record) {
      let that = this
      this.$confirm({
        title: '重要提醒！',
        content: `确定取消发布试卷名为【${record.paperName}】的试卷吗?`,
        onOk: () => {
          let opts = {
            paperId: record.id,
            auditStatus: 2
          }
          that.updatePaperStatus(opts)
        }
      })
    },
    handleEditPaper(record) {
      let id = record.id
      if (!!id) {
        this.goToEditTestPaperPage(id)
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新列表！')
      }
    },
    handleDeletePaper(record) {
      let id = record.id
      if (!!id) {
        this.deletePaper(id)
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新列表！')
      }
    },
    handleCreatePaperVersionB(record) {
      let that = this
      this.$confirm({
        title: '重要提醒！',
        content: `确定要生成试卷名为【${record.paperName}】的B卷吗?`,
        onOk: () => {
          let opts = {
            paperId: record.id
          }
          // alert('可以开始生成B卷了！')
          that.createPaperVersionB(opts)
        }
      })
    },
    handleExportAnswer(record) {
      let id = record.id
      if (!!id) {
        let apiUrl = `${window._CONFIG['examServiceURL']}/${this.url.exportAnswer}?paperId=${id}`
        window.open(apiUrl,"_blank");
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新列表！')
      }
    },
    updatePaperStatus(opts) {
      if (!!opts.paperId) {
        tikuApiList.updateTpStatus(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '更新试卷状态成功！')
            this.refreshTableList()
          } else {
            this.$message.error(res.message || '更新试卷状态失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新列表！')
      }
    },
    deletePaper(id) {
      let opts = {
        paperId: id
      }
      tikuApiList.deleteTp(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message || '删除成功！')
          this.refreshTableList()
        } else {
          this.$message.error(res.message || '删除失败！')
        }
      })
    },
    createPaperVersionB(opts) {
      if (!!opts.paperId) {
        tikuApiList.copyPaperB(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '生成B卷成功！')
            this.refreshTableList()
          } else {
            this.$message.error(res.message || '生成B卷失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新列表！')
      }
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

<template>
  <a-card class="page-container" :bordered="false">
    <div class="page-section-container">
      <div class="page-section-side">
        <div class="page-section-side-control">
          <h3>试卷基本信息</h3>
          <TestPaperBaseInfoModuleForTiku :init-data="paperBaseData" />
        </div>
        <div class="page-section-side-control">
          <h3>知识点</h3>
          <!--<KnowledgeModuleForPaper-->
          <!--v-if="!!queryParams.workTypeName"-->
          <!--:work-type="queryParams.workTypeName"-->
          <!--:work-type-id="queryParams.workTypeId"-->
          <!--@doChangeSelected="hanldleTriggerSelect"-->
          <!--/>-->
          <a-spin :spinning="false" style="height: 615px; overflow-y: auto">
            <a-tree
              checkable
              :tree-data="treeData"
              :checkedKeys="checkedKeys"
              :replaceFields="replaceFields"
              v-model="checkedKeys"
              @select="onSelect"
              @check="onCheck"
            >
              <!-- <span slot="title0010" style="color: #1890ff">sss</span> -->
            </a-tree>
          </a-spin>
        </div>
      </div>
      <div class="page-section-main">
        <div class="page-list-main">
          <div class="page-list-scroll">
            <a-form-model ref="ruleForm" :model="queryParams" :rules="rules">
              <a-form-model-item prop="knowledgeList">
                <div class="page-list-section-container">
                  <h3 class="list-section-head">
                    <span class="head-title">考核知识点</span>
                    <span class="head-action">
                      <a-button type="primary" icon="delete" @click="handleClearKownledgeList">
                        <span>清空知识点</span>
                      </a-button>
                    </span>
                  </h3>
                  <div class="kownledge-list-container">
                    <ul v-if="tempKnowledgeList.length > 0" class="kownledge-list-wrap">
                      <li v-for="(item, index) in tempKnowledgeList" :key="index">
                        <span>{{ item.content }}</span>
                        <a-icon type="close" @click="handleDeleteKnowledge(item, index)" />
                      </li>
                    </ul>
                    <a-result
                      style="padding: 0 30px;"
                      v-else
                      title="欢迎选择知识点！"
                      sub-title="欢迎选择知识点！不选，则默认为全部为知识点！"
                    >
                    </a-result>
                  </div>
                </div>
              </a-form-model-item>
              <a-form-model-item prop="paperScope">
                <div class="page-list-section-container">
                  <h3 class="list-section-head">
                    <span class="head-title">选择范围</span>
                  </h3>
                  <div class="list-section-content">
                    <span>剔除</span>
                    <a-select
                      style="width: 140px;"
                      placeholder="请选择范围"
                      v-model.trim="queryParams.paperScope"
                      disabled
                    >
                      <a-select-option v-for="item in scopeTypeList.slice(1)" :key="item.code">
                        {{ item.label }}
                      </a-select-option>
                    </a-select>
                    <span>内组卷过的试题</span>
                  </div>
                </div>
              </a-form-model-item>
              <a-form-model-item prop="questionTypeList">
                <div class="page-list-section-container">
                  <h3 class="list-section-head">
                    <span class="head-title">题型及数量</span>
                    <span class="head-action">
                      <a-button type="primary" icon="plus" @click="handleAdd">
                        <span>添加题型</span>
                      </a-button>
                    </span>
                  </h3>
                  <div class="tixing-list-wrap">
                    <a-table
                      ref="table"
                      bordered
                      size="small"
                      :loading="loading"
                      :rowKey="
                        (record, index) => {
                          return index
                        }
                      "
                      :columns="columns"
                      :data-source="tempQuestionTypeList"
                      :pagination="false"
                    >
                      <template slot="num" slot-scope="text, record, index">
                        <editable-cell :text="text" @change="onCellChange(index, 'num', $event)" />
                      </template>
                      <span slot="action" slot-scope="text, record, index">
                        <!-- <a @click="handleEdit(record)">编辑</a>
                      <a-divider type="vertical" /> -->
                        <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteQuestionType(record, index)">
                          <a>删除</a>
                        </a-popconfirm>
                      </span>
                    </a-table>
                  </div>
                </div>
              </a-form-model-item>
              <a-form-model-item :wrapper-col="{ span: 4, offset: 8 }">
                <a-button type="primary" block size="large" @click="doFormSubmit">
                  生成试卷
                </a-button>
              </a-form-model-item>
            </a-form-model>
          </div>
        </div>
      </div>
    </div>

    <!--新增|编辑试题类型弹框-->
    <AddQuestionTypeTestPaperModal
      :question-max-num="questionMaxNum"
      ref="addQtTestPaperModal"
      @ok="renovateTable"
      @getQuestionMaxNum="renovateMaxNum"
    />
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'
import TYPELIST from './data/test_paper_type_list'
import mixin_tiku from './mixins/TikuListMixin'

import TestPaperBaseInfoModuleForTiku from './modules/TestPaperBaseInfoModuleForTiku'
import KnowledgeModuleForPaper from './modules/KnowledgeModuleForPaper'
import EditableCell from './components/EditableCell'

import AddQuestionTypeTestPaperModal from './modules/AddQuestionTypeTestPaperModal'
import { getAction } from '@/api/manage'

export default {
  name: 'TestPaperAutoSelect', //组卷管理-智能组卷
  mixins: [mixin_tiku],
  components: {
    TestPaperBaseInfoModuleForTiku,
    KnowledgeModuleForPaper,
    EditableCell,
    AddQuestionTypeTestPaperModal
  },
  props: {},
  data() {
    return {
      scopeTypeList: TYPELIST.TESTPAPER_SCOPE_TYPE_LIST,
      tempKnowledgeList: [], //临时存储知识点数组
      tempQuestionTypeList: [], //临时存储题型数组
      queryParams: {
        projectType: undefined, //项目类型；1职业技能提升；2创业培训；3新学徒
        workTypeName: undefined, //工种名称
        workTypeId: undefined, //工种等级
        knowledgeList: [],
        paperScope: undefined, //剔除试题范围(1-半年,2-一年,3-两年,4-无)
        questionTypeList: []
      },
      paperBaseData: {
        knowledgeList: [],
        paperId: undefined,
        paperName: undefined,
        paperScope: undefined,
        paperScopeStr: undefined,
        projectType: undefined,
        projectTypeStr: undefined,
        questionTypeList: [],
        workLevel: undefined,
        workTypeId: undefined,
        workTypeName: undefined
      },
      loading: false,
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 100,
          customRender: (t, r, index) => index + 1
        },
        {
          title: '题型',
          dataIndex: 'questionTypeStr'
        },
        {
          title: '难易程度',
          dataIndex: 'hardLevelStr'
        },
        {
          title: '数量',
          dataIndex: 'num',
          width: '20%',
          scopedSlots: { customRender: 'num' }
        },
        {
          title: '试题最大数量',
          dataIndex: 'totalCount'
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' },
          width: 200
        }
      ],
      rules: {
        knowledgeList: [
          {
            type: 'array',
            required: false,
            message: '请选择知识点',
            trigger: 'change'
          }
        ],
        questionTypeList: [
          {
            type: 'array',
            required: true,
            message: '请选择题型',
            trigger: 'change'
          }
        ],
        paperScope: [
          {
            required: true,
            message: '请选择剔除范围',
            trigger: 'change'
          }
        ]
      },
      questionMaxNum: 0,
      getIdList: [],
      defaultSelectedKeysList: [],
      keyList: [],
      treeData: [],
      checkedKeys: [],
      replaceFields: {
        title: 'content',
        key: 'id'
      },
      url: {
        getTree: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree',
        queryKnowledge: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledge'
      }
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    },
    questionTypeNum() {
      let res =
        !!this.tempQuestionTypeList && this.tempQuestionTypeList.length > 0 ? this.tempQuestionTypeList.length : 0
      return res
    }
  },
  created() {},
  watch: {
    paperId: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.initSmartPaper()
      }
    },
    paperBaseData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          this.queryParams.projectType = newV.projectType
          this.queryParams.workTypeName = newV.workTypeName
          this.queryParams.workTypeId = newV.workTypeId
          this.queryParams.paperScope = newV.paperScope
          this.tempKnowledgeList = newV.knowledgeList.slice(0)
          this.setQueryParamsKnowledgeListVal()
          this.tempQuestionTypeList = newV.questionTypeList.slice(0)
          this.setQueryParamsQuestionTypeListVal()

          !!this.queryParams.workTypeId &&
            getAction(this.url.queryKnowledge + '/' + this.queryParams.workTypeId).then(res => {
              if (res.code == 200 && !!res.message) {
                this.treeData = res.result
              }
            })
        }
      }
    },
    queryParams: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {}
    }
  },
  methods: {
    onSelect(selectedKeys, info) {},
    onCheck(checkedKeys, info) {
      this.tempKnowledgeList = []
      for (let i = 0; i < info.checkedNodes.length; i++) {
        let target = {
          knowledgeId: info.checkedNodes[i].key,
          content: info.checkedNodes[i].componentOptions.propsData.title
        }
        this.tempKnowledgeList.push(target)
      }

      this.setQueryParamsKnowledgeListVal()
    },
    onCellChange(key, dataIndex, value) {
      const dataSource = [...this.tempQuestionTypeList]
      const target = dataSource.find((item, idx) => idx === key)
      if (!!target) {
        target[dataIndex] = value
        this.tempQuestionTypeList = dataSource
        this.setQueryParamsQuestionTypeListVal()
      }
    },
    handleDeleteKnowledge(record, index) {
      // console.log(record, index)
      const dataList = [...this.tempKnowledgeList]
      let targetIndex = dataList.findIndex((item, idx) => idx == index && item.knowledgeId == record.knowledgeId)
      if (targetIndex > -1) {
        this.tempKnowledgeList.splice(targetIndex, 1)
      }
      var targetIndex2 = this.checkedKeys.indexOf(record.knowledgeId)
      if (targetIndex2 > -1) {
        this.checkedKeys.splice(targetIndex2, 1)
      }
      this.setQueryParamsKnowledgeListVal()
    },
    handleClearKownledgeList() {
      let that = this
      this.$confirm({
        title: '重要提醒！',
        content: '确定要清空知识点吗？',
        onOk: () => {
          that.tempKnowledgeList = []
          that.setQueryParamsKnowledgeListVal()
          that.checkedKeys = []
        }
      })
    },
    setQueryParamsKnowledgeListVal() {
      this.queryParams.knowledgeList = this.tempKnowledgeList.slice(0)
    },
    hanldleTriggerSelect(data) {
      // console.log(data)
      let target = {
        knowledgeId: data.id, //知识点id，左侧知识点树的知识点的id字段
        content: data.content
      }
      const dataList = [...this.tempKnowledgeList]
      let targetIndex = dataList.findIndex(item => item.knowledgeId == target.knowledgeId)
      if (targetIndex > -1) {
        this.$message.warning('不好意思，该知识点已被选择！')
        return false
      } else {
        let newData = Object.assign({}, target)
        this.tempKnowledgeList = dataList.concat([newData])
        this.setQueryParamsKnowledgeListVal()
      }
    },
    handleAdd() {
      this.$refs.addQtTestPaperModal.add()
    },
    handleEdit(record) {
      this.$refs.addQtTestPaperModal.edit(record)
    },
    handleDeleteQuestionType(record, index) {
      // console.log(record, index)
      const dataList = [...this.tempQuestionTypeList]
      let targetIndex = dataList.findIndex(
        (item, idx) => idx == index && item.questionType == record.questionType && item.hardLevel == record.hardLevel
      )
      if (targetIndex > -1) {
        this.tempQuestionTypeList.splice(targetIndex, 1)
      }
      this.setQueryParamsQuestionTypeListVal()
    },
    setQueryParamsQuestionTypeListVal() {
      this.queryParams.questionTypeList = this.tempQuestionTypeList.slice(0)
    },
    renovateTable(data) {
      let that = this
      let target = {
        hardLevel: data.hardLevelId, //知识点id，左侧知识点树的知识点的id字段
        hardLevelStr: data.hardLevel,
        questionType: data.questionTypeId,
        questionTypeStr: data.questionType,
        num: data.num,
        totalCount: data.maxNum
      }
      const dataSource = [...this.tempQuestionTypeList]
      let targetIndex = dataSource.findIndex(
        item => item.questionType == target.questionType && item.hardLevel == target.hardLevel
      )
      if (targetIndex > -1) {
        this.$message.warning('同种试题类型、同种难易程度的试题无法重复添加，请直接编辑修改！')
        return false
      } else {
        let qTargetIndex = dataSource.findIndex(
          item => item.questionType == target.questionType && target.hardLevel == '0'
        )
        let oqTargetIndex = dataSource.findIndex(
          item => item.questionType == target.questionType && item.hardLevel == '0'
        )
        if (oqTargetIndex > -1) {
          this.$message.warning('同种试题类型，已选择难易程度为【全部】，其他难易程度无法添加！')
          return false
        } else {
          if (qTargetIndex > -1) {
            this.$confirm({
              title: '重要警告提示！',
              content: '同种试题类型，选择难易程度为【全部】后，其他难易程度将自动失效！确定要添加吗？',
              okText: '确认',
              cancelText: '取消',
              onOk() {
                let newData = Object.assign({}, target)
                dataSource.splice(qTargetIndex, 1, newData)
                that.tempQuestionTypeList = dataSource
                that.setQueryParamsQuestionTypeListVal()
                that.$refs.addQtTestPaperModal.handleCancel()
                that.questionMaxNum = 0
              }
            })
          } else {
            let newData = Object.assign({}, target)
            this.tempQuestionTypeList = dataSource.concat([newData])
            this.setQueryParamsQuestionTypeListVal()
            this.$refs.addQtTestPaperModal.handleCancel()
            that.questionMaxNum = 0
          }
        }
      }
    },
    renovateMaxNum(data) {
      let target = {
        hardLevel: data.hardLevelId, //知识点id，左侧知识点树的知识点的id字段
        hardLevelStr: data.hardLevel,
        questionType: data.questionTypeId,
        questionTypeStr: data.questionType
      }
      let opts = Object.assign({ paperId: this.paperId }, this.queryParams)
      opts.questionTypeList = [target]
      this.getQuestionTypeMaxNum(opts)
    },
    goToTqEditPaperPage(id) {
      this.$router.push({ path: '/itiku/EidtTestPaperPage', query: { paperId: id } })
    },
    goToNextPage(id) {
      if (!!id) {
        this.goToTqEditPaperPage(id)
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let opts = {
            paperId: this.paperId,
            ...this.queryParams
          }
          this.doSendFormDataSubmit(opts)
        } else {
          return false
        }
      })
    },
    doSendFormDataSubmit(opts) {
      if (!!opts.paperId) {
        tikuApiList.autoGeneratePaper(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '试卷生成成功！')
            // console.log(res.result)
            let paperId = opts.paperId
            setTimeout(() => {
              this.goToNextPage(paperId)
            }, 30)
          } else {
            this.$message.error(res.message || '试卷生成失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    getQuestionTypeMaxNum(opts) {
      if (!!opts.paperId) {
        tikuApiList.getMaxNumByQuestionType(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            // console.log(res)
            this.questionMaxNum = res.result
          } else {
            this.$message.error(res.message || '获取试题最大数量失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新页面！')
      }
    },
    initSmartPaper() {
      let opts = {
        paperId: this.paperId
      }
      if (!!opts.paperId) {
        tikuApiList.getDrafDataAutoGeneratePaper(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            // this.$message.success(res.message || '获取页面初始化数据成功！')
            let data = res.result
            Object.assign(this.paperBaseData, data)
            if (data.knowledgeList) {
              this.checkedKeys = []
              setTimeout(() => {
                for (let i = 0; i < data.knowledgeList.length; i++) {
                  this.checkedKeys.push(data.knowledgeList[i].knowledgeId)
                }
              }, 30)
            }
          } else {
            this.$message.error(res.message || '获取页面初始化数据失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    initPage() {
      this.initSmartPaper()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import './less/shijuan.less';
</style>

<template>
  <a-card class="page-container" :bordered="false">
    <!--操作-->
    <div class="page-operator">
      <a-row :gutter="[0, 16]">
        <a-col class="search-group-l" :span="12">
          <a-form-model
            ref="ruleForm"
            class="search-form"
            layout="horizontal"
            :model="queryParams"
            :rules="rules"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-row style="width: 525px">
              <a-form-model-item label="搜索" prop="keyWord">
                <a-input placeholder="模糊搜索，搜索范围包括：题目" allow-clear v-model.trim="queryParams.title" />
              </a-form-model-item>
            </a-row>
          </a-form-model>
          <span class="page-search-btns">
            <a-button class="btn-fix" type="primary" icon="search" @click="onSearch" style="margin-top: 4px">
              搜索
            </a-button>
          </span>
        </a-col>
        <a-col class="btn-group-r" :span="11" :offset="1">
          <TestBasketModuleForTestPaper :init-data="cartListData" @renovate="hanlderAfterDeleteFromCart" />
        </a-col>
      </a-row>
    </div>

    <div class="page-section-container">
      <div class="page-section-side">
        <div class="page-section-side-control">
          <h3>试卷基本信息</h3>
          <TestPaperBaseInfoModuleForTiku :init-data="paperBaseData" />
        </div>
        <div class="page-section-side-control">
          <h3>知识点</h3>
          <KnowledgeModuleForPaper
            v-if="!!queryParams.workTypeName"
            :work-type="queryParams.workTypeName"
            :work-type-id="queryParams.workTypeId"
            @doChangeSelected="hanldleTriggerSelect"
          />
        </div>
      </div>
      <div class="page-section-main">
        <!--筛选条件 start-->
        <a-row class="page-row" :gutter="[0, 16]">
          <div class="tags-label">
            <span class="tags-item-label">难易程度：</span>
          </div>
          <div class="tags-list">
            <a-button
              class="tags-item"
              type="link"
              v-for="item in difficultyTypeList"
              :key="item.id"
              :class="{ 'tags-acitve': queryParams.hardLevel == item.itemValue }"
              @click="onChangeHardLevel(item)"
            >
              {{ item.itemText }}
            </a-button>
          </div>
        </a-row>
        <a-row class="page-row" :gutter="[0, 16]">
          <div class="tags-label">
            <span class="tags-item-label">试题题型：</span>
          </div>
          <div class="tags-list">
            <a-button
              class="tags-item"
              type="link"
              v-for="item in questionTypeList"
              :key="item.id"
              :class="{ 'tags-acitve': queryParams.questionType == item.itemValue }"
              @click="onChangeQuestiontype(item)"
            >
              {{ item.itemText }}
            </a-button>
          </div>
        </a-row>
        <!--筛选条件 end-->
        <a-row class="page-row shiti-type-sort" :gutter="[0, 16]">
          <div class="btn-group">
            <a
              class="ant-btn ant-btn-link mw-btn"
              :class="{ 'mw-btn-active': sortForm.orderField == 'updateTime' }"
              @click="onChangeSort('updateTime')"
            >
              <span style="font-size: 16px">最新</span>
              <a-icon class="mw-icon" type="caret-up" :class="{ 'mw-icon-active': sortForm.sort == 'asc' }" />
              <a-icon class="mw-icon" type="caret-down" :class="{ 'mw-icon-active': sortForm.sort == 'desc' }" />
            </a>
            <a
              class="ant-btn ant-btn-link mw-btn"
              :class="{ 'mw-btn-active': sortForm.orderField == 'num' }"
              @click="onChangeSort('num')"
            >
              <span style="font-size: 16px">使用次数</span>
              <a-icon class="mw-icon" type="caret-up" :class="{ 'mw-icon-active': sortForm.sort == 'asc' }" />
              <a-icon class="mw-icon" type="caret-down" :class="{ 'mw-icon-active': sortForm.sort == 'desc' }" />
            </a>
          </div>
          <a-checkbox class="checkbox-group" :checked="isEliminate" @change="onChangeIsEliminate" disabled>
            <span>剔除</span>
            <a-select
              style="width: 140px;"
              placeholder="请选择"
              v-model.trim="queryParams.paperScope"
              :disabled="!!isEliminate"
              @change="onChangeScope"
            >
              <a-select-option v-for="item in scopeTypeList.slice(1)" :key="item.code">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <span>内组卷过的试题</span>
          </a-checkbox>

          <a-checkbox class="checkbox-group" :checked="isShowAnswerChecked" @change="onChangeIsShowAnswer">
            显示答案、知识、解析（提示：点击题目可查看答案和解析）
          </a-checkbox>
          <div class="total-group">
            <span>
              <span>共计</span>
              <a style="padding: 0 5px">{{ pagination.total }}</a>
              <span>道题</span>
            </span>
          </div>
        </a-row>
        <div class="page-list-main">
          <div class="page-list-scroll">
            <a-list
              item-layout="vertical"
              size="small"
              :loading="listLoading"
              :pagination="pagination"
              :data-source="listData"
              rowKey="id"
            >
              <a-list-item slot="renderItem" key="item.id" slot-scope="item, index">
                <TestQuestionSelectItem :init-data="item" @renovate="hanlderAfterAddCart" />
              </a-list-item>
            </a-list>
          </div>
        </div>
      </div>
    </div>
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'
import TYPELIST from './data/test_paper_type_list'
import mixin_tiku from './mixins/TikuListMixin'

import TestPaperBaseInfoModuleForTiku from './modules/TestPaperBaseInfoModuleForTiku'
import KnowledgeModuleForPaper from './modules/KnowledgeModuleForPaper'
import TestBasketModuleForTestPaper from './modules/TestBasketModuleForTestPaper'
import TestQuestionSelectItem from './components/TestQuestionSelectItem'

export default {
  name: 'TestPaperManualSelect', //组卷管理-人工组卷
  mixins: [mixin_tiku],
  components: {
    TestPaperBaseInfoModuleForTiku,
    KnowledgeModuleForPaper,
    TestBasketModuleForTestPaper,
    TestQuestionSelectItem
  },
  props: {},
  data() {
    return {
      scopeTypeList: TYPELIST.TESTPAPER_SCOPE_TYPE_LIST,
      toggleStatus: false, //展开 收起
      cartListData: [],
      pagination: {
        current: 1,
        pageSize: 5,
        pageSizeOptions: ['5', '10', '20', '30', '50', '100'],
        showQuickJumper: true,
        showSizeChanger: true,
        hideOnSinglePage: false, //只有一页时是否隐藏分页器
        total: 0,
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + total + '条'
        },
        onChange: (page, pageSize) => {
          //页码改变的回调，参数是改变后的页码及每页条数
          // console.log(page, pageSize)
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.refreshList()
        },
        onShowSizeChange: (current, size) => {
          //pageSize 变化的回调
          // console.log(current, size)
          this.pagination.current = current
          this.pagination.pageSize = size
          this.refreshList()
        }
      },
      queryParams: {
        title: undefined,
        projectType: undefined, //项目类型；1职业技能提升；2创业培训；3新学徒
        workTypeName: undefined, //工种名称
        workTypeId: undefined, //工种等级
        hardLevel: undefined, //题目难易程度;1:简单，2：中等;3:困难
        questionType: undefined, //题目类型;1:单选;2:多选;3:判断题;4:填空题;5:简答题
        paperScope: undefined //剔除试题范围(1-半年,2-一年,3-两年,4-无)
      },
      rules: {
        title: [{ required: false, message: '请输入要搜索的试题题干关键词', trigger: 'change' }]
      },
      knowledgeForm: {
        knowledgeId: undefined, //知识点id，左侧知识点树的知识点的id字段
        knowledgeLevel: undefined, //知识点级别，左侧知识点树的知识点的level字段
        workTypeId: undefined //工种等级id
      },
      sortForm: {
        orderField: 'updateTime', //排序字段
        sort: 'desc' //排序升降序
      },
      paperBaseData: {
        id: undefined,
        paperMode: undefined,
        paperName: undefined,
        paperScope: undefined,
        paperScopeStr: undefined,
        projectType: undefined,
        projectTypeStr: undefined,
        workLevel: undefined,
        workTypeId: undefined,
        workTypeName: undefined
      },
      groupBaseData: [],
      listLoading: false,
      oListData: [], //后台返回的原始数据
      listData: [],
      isShowAnswerChecked: false, //是否显示答案
      isEliminate: true //是否剔除
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    }
  },
  created() {},
  watch: {
    paperId: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.initPage()
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
        }
      }
    },
    groupBaseData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV && newV.length > 0) {
          this.cartListData = newV
        } else {
          this.cartListData = []
        }
      }
    },
    isShowAnswerChecked(newV, oldV) {
      _.forEach(this.listData, ele => {
        this.$set(ele, 'isShowAnswer', newV)
      })
    }
  },
  methods: {
    onSearch() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.initPage()
        }
      })
    },
    onChangeIsEliminate(e) {
      Object.assign(this, {
        isEliminate: e.target.checked
      })
      this.initPage()
    },
    onChangeIsShowAnswer(e) {
      Object.assign(this, {
        isShowAnswerChecked: e.target.checked
      })
    },
    onChangeHardLevel(data) {
      this.queryParams.hardLevel = data.itemValue
      this.initPage()
    },
    onChangeQuestiontype(data) {
      this.queryParams.questionType = data.itemValue
      this.initPage()
    },
    onChangeSort(sortFiled) {
      if (this.sortForm.orderField == sortFiled) {
        Object.assign(this.sortForm, {
          orderField: sortFiled,
          sort: this.sortForm.sort == 'asc' ? 'desc' : 'asc'
        })
      } else {
        Object.assign(this.sortForm, {
          orderField: sortFiled,
          sort: 'asc'
        })
      }
      this.initPage()
    },
    onChangeScope(value, option) {
      this.queryParams.paperScope = value
      this.initPage()
    },
    hanldleTriggerSelect(data) {
      // console.log(data)
      this.knowledgeForm.knowledgeId = data.id //知识点id，左侧知识点树的知识点的id字段
      this.knowledgeForm.knowledgeLevel = data.level //知识点级别，左侧知识点树的知识点的level字段
      this.initPage()
    },
    hanlderAfterDeleteFromCart(data) {
      this.refreshList()
    },
    hanlderAfterAddCart(data) {
      this.refreshList()
    },
    formatListData() {
      let res = []
      let defaultIsShowAnswerChecked = this.isShowAnswerChecked
      _.forEach(this.oListData, ele => {
        let obj = Object.assign({}, ele, {
          id: ele.question.id,
          paperQuestionId: ele.paperQuestionId,
          isShowAnswer: defaultIsShowAnswerChecked
        })
        res.push(obj)
      })
      this.listData = res
    },
    getListData() {
      let opts = {
        pageNo: this.pagination.current || 1, //页码
        pageSize: this.pagination.pageSize || 5, //每页数目
        paperId: this.paperId,
        ...this.queryParams,
        ...this.knowledgeForm,
        ...this.sortForm
      }
      if (!!opts.paperId) {
        tikuApiList.getQuestionListFilterByIds(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            let resp = res.result
            this.oListData = resp.records
            this.pagination.total = resp.total
            this.formatListData()
          } else {
            this.$message.error(res.message || '加载列表数据失败！')
          }
        })
      } else {
        this.$message.error('试卷ID不存在，请联系开发人员！')
      }
    },
    initManualPaper() {
      let opts = {
        paperId: this.paperId
      }
      if (!!opts.paperId) {
        tikuApiList.getTpDetailById(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            // this.$message.success(res.message || '获取页面初始化数据成功！')
            let data = res.result
            Object.assign(this.paperBaseData, data.paper)
            // this.groupBaseData = data.groupList.slice(0)
            this.groupBaseData = data.groupList.slice(0)
          } else {
            this.$message.error(res.message || '获取页面初始化数据失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    refreshList() {
      this.initManualPaper()
      this.getListData()
    },
    initListPage() {
      this.pagination.current = 1
      this.getListData()
    },
    initPage() {
      this.initManualPaper()
      this.initListPage()
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import './less/shijuan.less';
</style>

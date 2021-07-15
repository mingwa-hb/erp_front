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
            :model="form"
            :rules="rules"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 20 }"
          >
            <a-row style="width: 525px">
              <a-form-model-item label="搜索" prop="keyWord">
                <a-input placeholder="模糊搜索，搜索范围包括：题目、录入人" v-model.trim="form.keyWord" />
              </a-form-model-item>
            </a-row>
          </a-form-model>
          <span class="page-search-btns">
            <a-button class="btn-fix" type="primary" icon="search" @click="onSearch" style="margin-top: 4px"
              >搜索</a-button
            >
            <a-button class="btn-fix" type="primary" icon="reload" @click="onReset">重置</a-button>
          </span>
        </a-col>
        <a-col class="btn-group-r" :span="11" :offset="1">
          <a-button size="large" class="btn-fix" type="primary" icon="shop">试题篮（10）</a-button>
        </a-col>
      </a-row>
    </div>

    <!--筛选条件-->
    <div class="page-section-container page-classify">
      <a-row class="page-row" :gutter="[0, 16]">
        <div class="tags-label">
          <span class="tags-item-label">试卷名称：</span>
        </div>
        <div class="tags-list">
          <a-button class="tags-item" type="link">2020年职业技能培训考核（理论）试卷</a-button>
        </div>

        <div class="tags-label">
          <span class="tags-item-label">项目分类：</span>
        </div>
        <div class="tags-list">
          <a-button class="tags-item" type="link">职业技能提升</a-button>
        </div>

        <div class="tags-label">
          <span class="tags-item-label">工种名称：</span>
        </div>
        <div class="tags-list">
          <a-button class="tags-item" type="link">{{ queryParams.workType }}</a-button>
        </div>

        <div class="tags-label">
          <span class="tags-item-label">工种等级：</span>
        </div>
        <div class="tags-list">
          <a-button class="tags-item" type="link">一级</a-button>
        </div>
      </a-row>
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
    </div>

    <div class="page-section-container shiti-type-sort">
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
      <a-checkbox class="checkbox-group" :checked="isEliminate" @change="onChangeIsEliminate">
        剔除
        <a-select style="width: 120px;" placeholder="请选择" v-model.trim="queryParams.time">
          <a-select-option value="半年内">半年</a-select-option>
          <a-select-option value="一年">一年</a-select-option>
        </a-select>
        内组卷过的试题
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
    </div>

    <div class="page-list-wrap" v-if="!!queryParams.workType">
      <div class="page-section-container page-list-side">
        <h3>知识点</h3>
        <KnowledgeModuleForTiku :work-type="queryParams.workType" @doChangeSelected="hanldleTriggerSelect" />
      </div>

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
              <TestQuestionSelectItem :init-data="item" />
            </a-list-item>
          </a-list>
        </div>
      </div>
    </div>
    <a-result v-else title="请先选择工种名称！" sub-title="请务必先选择工种名称！"> </a-result>
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'
import mixin_tiku from './mixins/TikuListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import KnowledgeModuleForTiku from './modules/KnowledgeModuleForTiku'
import TestQuestionSelectItem from './components/TestQuestionSelectItem'

import { getAction } from '../../api/manage'

export default {
  name: 'TestQuestionSelectList', //试题管理
  mixins: [mixin_tiku],
  components: {
    JSelectWorkTypeForTiku,
    KnowledgeModuleForTiku,
    TestQuestionSelectItem
  },
  props: {},
  data() {
    return {
      toggleStatus: false, //展开 收起
      defaultWorktype: undefined, //默认的工种名称
      form: {
        keyWord: undefined //搜索内容
      },
      rules: {
        keyWord: [{ required: false, message: '请输入搜索内容', trigger: 'change' }]
      },
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
          this.onClearSelected()
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          this.refreshList()
        },
        onShowSizeChange: (current, size) => {
          //pageSize 变化的回调
          // console.log(current, size)
          this.onClearSelected()
          this.pagination.current = current
          this.pagination.pageSize = size
          this.refreshList()
        }
      },
      queryParams: {
        projectType: undefined, //项目类型；1职业技能提升；2创业培训；3新学徒
        workType: '大数据工程师', //工种名称
        hardLevel: undefined, //题目难易程度;1:简单，2：中等;3:困难
        questionType: undefined, //题目类型;1:单选;2:多选;3:判断题;4:填空题;5:简答题
        time: undefined
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
      listLoading: false,
      // listData, //列表数据
      oListData: [], //后台返回的原始数据
      listData: [],
      isShowAnswerChecked: false, //是否显示答案
      isEliminate: false, //是否剔除
      selectionRows: [] //呗选择的数据集合
    }
  },
  computed: {
    selectedRowKeys() {
      return _.map(this.selectionRows, 'id')
    },
    selectNum() {
      let res = 0
      res = this.selectionRows.length
      return res
    }
  },
  created() {},
  watch: {
    isEliminate(newV, oldV) {
      if (!newV) {
      }
    },
    isShowAnswerChecked(newV, oldV) {
      _.forEach(this.listData, ele => {
        this.$set(ele, 'isShowAnswer', newV)
      })
    },
    queryParams: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.onClearSelected()
        if (!!newV.workType) {
          this.initListPage()
        }
      }
    },
    knowledgeForm: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.initListPage()
      }
    },
    sortForm: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.initListPage()
      }
    },
    defaultWorktype(newV, oldV) {
      this.queryParams.workType = newV
    }
  },
  methods: {
    onSearch() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.getListDataBySearch()
        } else {
          this.$$message.error('验证未通过，失败了呦！')
          return false
        }
      })
    },
    onReset() {
      this.$refs.ruleForm.resetFields()
      this.initListPage()
    },
    onClearSelectedNoKonwledgeForm() {
      this.form.keyWord = undefined
      this.isEliminate = false
    },
    onClearSelected() {
      this.onClearSelectedNoKonwledgeForm()
      this.knowledgeForm.knowledgeId = undefined
      this.knowledgeForm.knowledgeLevel = undefined
      this.knowledgeForm.workTypeId = undefined
    },
    onChangeIsEliminate(e) {
      Object.assign(this, {
        isEliminate: e.target.checked
      })
    },
    onChangeIsShowAnswer(e) {
      Object.assign(this, {
        isShowAnswerChecked: e.target.checked
      })
    },
    onChangeHardLevel(data) {
      this.queryParams.hardLevel = data.itemValue
    },
    onChangeQuestiontype(data) {
      this.queryParams.questionType = data.itemValue
    },
    onChangeSort(sortFiled) {
      this.onClearSelectedNoKonwledgeForm()
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
    },
    hanldleTriggerSelect(data) {
      // console.log(data)
      this.onClearSelectedNoKonwledgeForm()
      this.knowledgeForm.knowledgeId = data.id //知识点id，左侧知识点树的知识点的id字段
      this.knowledgeForm.knowledgeLevel = data.level //知识点级别，左侧知识点树的知识点的level字段
      this.knowledgeForm.workTypeId = data.workTypeId //工种等级id
    },
    formatListData() {
      let res = []
      let defaultIsShowAnswerChecked = this.isShowAnswerChecked
      _.forEach(this.oListData, ele => {
        let obj = Object.assign({}, ele, {
          id: ele.question.id,
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
        ...this.queryParams,
        ...this.knowledgeForm,
        ...this.sortForm
      }
      if (!!opts.workType) {
        tikuApiList.getTqList(opts).then(res => {
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
        this.$message.error('workType参数不存在，请联系开发人员！')
      }
    },
    getListDataBySearch() {
      let opts = {
        page: this.pagination.current || 1, //页码
        size: this.pagination.pageSize || 5, //每页数目
        ...this.form,
        ...this.sortForm
      }
      if (!!opts.keyWord) {
        tikuApiList.searchQuestionsByKeyword(opts).then(res => {
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
        this.$message.warning('搜索内容不能为空！')
      }
    },
    refreshList() {
      if (!!this.form.keyWord) {
        this.getListDataBySearch()
      } else {
        this.getListData()
      }
    },
    initListPage() {
      this.pagination.current = 1
      if (!!this.form.keyWord) {
        !!this.form.keyWord && this.getListDataBySearch()
      } else {
        !!this.queryParams.workType && this.getListData()
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import './less/tiku.less';
</style>

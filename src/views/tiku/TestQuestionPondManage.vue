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
          <a-button class="btn-fix" type="primary" icon="plus" @click="handleAdd">新增试题</a-button>
          <a-button class="btn-fix" type="primary" icon="import" @click="handleImport">导入试题</a-button>
          <a-button class="btn-fix" type="primary" icon="export" @click="handleExport">导出试题</a-button>
        </a-col>
      </a-row>
    </div>

    <!--筛选条件-->
    <div class="page-section-container page-classify">
      <a-row class="page-row" :gutter="[0, 16]">
        <div class="tags-label">
          <span class="tags-item-label">项目分类：</span>
        </div>
        <div class="tags-list">
          <a-button
            class="tags-item"
            type="link"
            v-for="item in projectTypeList"
            :key="item.id"
            :class="{ 'tags-acitve': queryParams.projectType == item.itemValue }"
            :disabled="item.itemValue == 3"
            @click="onChangeProject(item)"
          >
            {{ item.itemText }}
          </a-button>
        </div>
      </a-row>
      <a-row class="page-row" :gutter="[0, 16]">
        <div class="tags-label">
          <span class="tags-item-label">工种名称：</span>
        </div>
        <div class="work-type-list">
          <j-select-work-type-for-tiku
            placeholder="请选择工种类型"
            :multiple="false"
            v-model.trim="queryParams.workType"
          />
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
      <a-checkbox class="checkbox-group" :checked="isShowAnswerChecked" @change="onChangeIsShowAnswer">
        显示答案、知识、解析（提示：点击题目可查看答案和解析）
      </a-checkbox>
      <a-checkbox
        class="checkbox-group"
        :indeterminate="indeterminate"
        :checked="isAllChecked"
        @change="onAllCheckedChange"
      >
        全选
      </a-checkbox>
      <span style="font-weight: 600; padding: 0 5px; font-size: 16px">
        <span>已选择</span>
        <a style="padding: 0 5px">{{ selectNum }}</a>
        <span>项</span>
      </span>
      <a style="margin-left: 20px; font-size: 16px" @click="onClearSelected">清空</a>
      <div class="total-group">
        <span>
          <span>已筛选出</span>
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
              <TestQuestionListItem
                :init-data="item"
                @doEdit="handleEdit"
                @doDelete="handleDelete"
                @doCheckedChange="onCheckedChange"
              />
            </a-list-item>
          </a-list>
        </div>
      </div>
    </div>
    <a-result v-else title="请先选择工种名称！" sub-title="请务必先选择工种名称！"> </a-result>

    <!--新增|编辑试题弹框-->
    <TestQuestionEditModal ref="TqEditModal" :workTypeId="queryParams.workTypeId" @saveAfter="initListPage" />

    <!--导入试题弹框-->
    <TestQuestionImportModal ref="TqImportModal" @doEdit="handleEdit" />

    <!--导出试题弹框-->
    <TestQuestionExportModal ref="TqExportModal" @doExport="doExport" />
  </a-card>
</template>

<script>
import _ from 'lodash'

import { tikuApiList } from '@/api/api'
import mixin_tiku from './mixins/TikuListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import KnowledgeModuleForTiku from './modules/KnowledgeModuleForTiku'
import TestQuestionListItem from './components/TestQuestionListItem'
import TestQuestionEditModal from './modules/TestQuestionEditModal'
import TestQuestionImportModal from './modules/TestQuestionImportModal'
import TestQuestionExportModal from './modules/TestQuestionExportModal'
import { getAction } from '../../api/manage'

export default {
  name: 'TestQuestionPondManage', //试题管理
  mixins: [mixin_tiku],
  components: {
    JSelectWorkTypeForTiku,
    KnowledgeModuleForTiku,
    TestQuestionListItem,
    TestQuestionEditModal,
    TestQuestionImportModal,
    TestQuestionExportModal
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
      url: {
        exportDocUrl: window._CONFIG['examServiceURL'] + '/erp/exam/mwExamQuestion/exportDoc',
        exportXlsUrl: window._CONFIG['examServiceURL'] + '/erp/exam/mwExamQuestion/exportXls'
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
          //this.onClearSelected()
          this.pagination.current = page
          this.pagination.pageSize = pageSize
          if (!!this.form.keyWord) {
            this.getListDataBySearch()
          } else {
            this.refreshList()
          }
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
        workType: undefined, //工种名称
        hardLevel: undefined, //题目难易程度;1:简单，2：中等;3:困难
        questionType: undefined //题目类型;1:单选;2:多选;3:判断题;4:填空题;5:简答题
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
      indeterminate: false,
      isAllChecked: false, //是否全选
      selectionRows: [] //呗选择的数据集合
    }
  },
  computed: {
    selectedRowKeys() {
      return _.map(this.selectionRows, 'id')
    },
    spreadWorkTypeList() {
      let res = []
      res = this.toggleStatus ? this.workTypeList : this.workTypeList.slice(0, 10)
      return res
    },
    selectNum() {
      let res = 0
      res = this.selectionRows.length
      return res
    }
  },
  created() {
    //获取工种名称的第1个工种
    this.getFirstWorkTypeName()
  },
  watch: {
    isAllChecked(newV, oldV) {
      if (!newV) {
        this.selectionRows = []
      }
      _.forEach(this.listData, ele => {
        this.$set(ele, 'checked', newV)
      })
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
        if (!!newV.workType && newV.projectType != oldV.projectType) {
          this.onClearSelected()
        }
        if (!!newV.workType && newV.workType != oldV.workType) {
          this.onClearSelected()
        }
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
    onAllCheckedChange(e) {
      Object.assign(this, {
        selectionRows: e.target.checked ? this.listData.slice() : [],
        indeterminate: false,
        isAllChecked: e.target.checked
      })
    },
    onClearSelectedNoKonwledgeForm() {
      this.form.keyWord = undefined
      this.selectionRows = []
      this.isAllChecked = false
      this.indeterminate = false
    },
    onClearSelectedHasKnowledgeForm() {
      this.selectionRows = []
      this.isAllChecked = false
      this.indeterminate = false
    },
    onClearSelected() {
      this.onClearSelectedNoKonwledgeForm()
      this.knowledgeForm.knowledgeId = undefined
      this.knowledgeForm.knowledgeLevel = undefined
      this.knowledgeForm.workTypeId = undefined
    },
    onCheckedChange(e, data) {
      let _idx = _.findIndex(this.selectionRows, ['id', data.id])
      if (_idx > -1) {
        e.target.checked ? this.selectionRows.push(data) : this.selectionRows.splice(_idx, 1)
      } else {
        this.selectionRows.push(data)
      }
      this.indeterminate = !!this.selectionRows.length && this.selectionRows.length < this.listData.length

      //更新选中状态
      _.forEach(this.listData, ele => {
        if (ele.id == data.id) {
          ele = Object.assign({}, ele, { checked: e.target.checked, id: data.id })
        }
      })
    },
    onChangeIsShowAnswer(e) {
      // console.log(e)
      // this.isShowAnswerChecked = e.target.checked
      Object.assign(this, {
        indeterminate: false,
        isShowAnswerChecked: e.target.checked
      })
    },
    onChangeProject(data) {
      this.queryParams.projectType = data.itemValue
    },
    onChangeWorktype(data) {
      this.queryParams.workType = data.value
    },
    onChangeHardLevel(data) {
      this.queryParams.hardLevel = data.itemValue
    },
    onChangeQuestiontype(data) {
      this.queryParams.questionType = data.itemValue
    },
    onChangeSort(sortFiled) {
      this.onClearSelectedHasKnowledgeForm()
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
    handleToggleStatus() {
      this.toggleStatus = !this.toggleStatus
    },
    handleImport() {
      this.$refs.TqImportModal.handleImport()
    },
    handleExport() {
      this.$refs.TqExportModal.handleExport()
    },
    handleAdd() {
      this.$refs.TqEditModal.title = '新增试题'
      this.$refs.TqEditModal.add()
    },
    handleEdit(record) {
      this.isAccessEditById(record, () => {
        this.$refs.TqEditModal.title = '编辑试题'
        this.$refs.TqEditModal.edit(record)
      })
    },
    handleDelete(record) {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '试题删除后，试题不可恢复，但已引用的试卷/考试仍保留原信息。确认删除？',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          // alert('确认删除')
          that.deleteListItemData(record)
        }
      })
    },
    doExport(params) {
      let opts = {
        ...this.queryParams,
        ...this.knowledgeForm,
        ...this.sortForm
      }
      if (this.selectedRowKeys.length > 0) {
        opts.ids = this.selectedRowKeys.join(',')
      }
      let paramsStr = this.getQueryField(opts)
      let url
      if (params.fileType == 1) {
        //doc导出
        url = this.url.exportDocUrl
      } else {
        //excel导出
        url = this.url.exportXlsUrl
      }
      url += '?' + paramsStr
      // console.log(url)
      // debugger
      window.location.href = url
      // let link = document.createElement('a')
      // link.style.display = 'none'
      // link.href = url
      // link.setAttribute('download', "试题下载")
      // document.body.appendChild(link)
      // link.click()
      // document.body.removeChild(link) //下载完成移除元素
      // window.URL.revokeObjectURL(url) //释放掉blob对象
    },
    formatListData() {
      let res = []
      let defaultIsShowAnswerChecked = this.isShowAnswerChecked
      let defaultIsAllChecked = this.isAllChecked
      _.forEach(this.oListData, ele => {
        let obj = Object.assign({}, ele, {
          checked: defaultIsAllChecked,
          id: ele.question.id,
          isShowAnswer: defaultIsShowAnswerChecked
        })
        res.push(obj)
      })
      this.listData = res
    },
    deleteListItemData(record) {
      let opts = {
        id: record.id
      }
      if (!!opts.id) {
        tikuApiList.deleteTqById(opts.id).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '删除成功！')
            setTimeout(() => {
              this.refreshList()
            }, 100)
          } else {
            this.$message.error(res.message || '删除失败！')
          }
        })
      } else {
        this.$message.error('试题id参数不存在，请联系开发人员！')
      }
    },
    getFirstWorkTypeName() {
      tikuApiList.getFirstWorkTypeName().then(res => {
        if (res.code == 0 || (res.code == 200 && !!res.success)) {
          let resp = res.result
          this.defaultWorktype = res.result
        } else {
          this.$message.error(res.message || '获取工种名称的第1个工种失败！')
        }
      })
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
  mounted() {
    // window.addEventListener('beforeunload', () => {
    //   return '确定要关闭吗?'
    // })
  }
}
</script>
<style lang="less" scoped>
@import './less/tiku.less';
</style>

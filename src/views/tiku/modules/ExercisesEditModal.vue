<template>
  <a-modal
    :title="title"
    width="50%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    @ok="handleOk"
    class="modal-container"
  >
    <div class="modal-section">
      <h3 class="modal-section-head">
        <span class="head-title">基本信息配置</span>
      </h3>
      <a-form-model
        ref="ruleForm"
        class="form-container"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="项目分类" prop="projectType">
              <a-select placeholder="请选择项目分类" v-model="form.projectType">
                <a-select-option
                  v-for="item in projectTypeList.slice(1)"
                  :key="item.itemValue"
                  :disabled="item.itemValue == 3"
                  >{{ item.itemText }}</a-select-option
                >
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="工种类型" prop="workName">
              <j-select-work-type-for-tiku
                placeholder="请选择工种类型"
                :multiple="false"
                v-model.trim="form.workName"
                @change="onChangeWorkType"
              />
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="工种等级" prop="workTypeId">
              <a-select placeholder="请选择工种等级" v-model="form.workTypeId">
                <a-select-option v-for="item in worktypeLevelTypeList" :key="item.id">{{
                  item.workLevel
                }}</a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="习题剔除范围" prop="exerciseScope">
              <a-select placeholder="请选择习题剔除范围" v-model="form.exerciseScope">
                <a-select-option v-for="item in scopeTypeList.slice(1)" :key="item.code">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="12">
            <a-form-model-item label="习题名称" prop="exerciseName">
              <a-input placeholder="请输入习题名称" v-model.trim="form.exerciseName" />
            </a-form-model-item>
          </a-col>
          <a-col :span="12">
            <a-form-model-item label="习题数量" prop="totalNum">
              <a-input placeholder="请输入习题数量" v-model="form.totalNum" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </div>

    <div class="modal-section">
      <h3 class="modal-section-head">
        <span class="head-title">题型及数量配置</span>
        <span class="head-action">
          <a-button type="primary" icon="plus" @click.native.stop.prevent="handleQuestionTypeAdd">
            <span>添加题型</span>
          </a-button>
        </span>
      </h3>
      <!--使用visible来重新渲染table，是为了解决切换不同弹框出现样式错乱的问题-->
      <div class="tixing-list-wrap" v-if="!!visible">
        <a-table
          bordered
          size="small"
          :loading="tableLoading"
          :rowKey="
            (record, index) => {
              return index
            }
          "
          :columns="columns"
          :data-source="tempQuestionTypeList"
          :pagination="false"
          @expand="handleExpand"
        >
          <template slot="num" slot-scope="text, record, index">
            <editable-cell :text="text" @change="onCellChange(index, 'num', $event)" />
          </template>
          <span slot="action" slot-scope="text, record, index">
            <!-- <a>编辑</a>
            <a-divider type="vertical" /> -->
            <a @click="handleAddLinkPaper(record)">添加关联试卷</a>
            <a-divider type="vertical" />
            <a-popconfirm title="确定删除吗?" @confirm="() => handleDeleteQuestionType(record, index)">
              <a>删除</a>
            </a-popconfirm>
          </span>

          <a-table
            slot="expandedRowRender"
            slot-scope="record"
            size="small"
            :rowKey="
              (record, index) => {
                return index
              }
            "
            :columns="innerColumns"
            :data-source="record.relPaperList"
            :pagination="false"
          >
            <template slot="num" slot-scope="innerText, innerRecord, innerIndex">
              <editable-cell
                :text="innerText"
                @change="onCellChangePaper(innerIndex, 'num', $event, innerRecord, record)"
              />
            </template>
            <span slot="operation" slot-scope="innerText, innerRecord, innerIndex">
              <a>删除</a>
            </span>
          </a-table>
        </a-table>
      </div>
    </div>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click.stop.prevent="handleOk" :disabled="submitDisabled">确定</a-button>
    </template>

    <!--新增|编辑试题类型弹框-->
    <ExercisesAddQuestionTypeModal
      :question-max-num="questionMaxNum"
      ref="addQtExercisesModal"
      @ok="renovateTable"
      @getQuestionMaxNum="renovateMaxNum"
    />

    <!--关联试卷弹框-->
    <ExercisesLinkPaperModal :params="form" ref="exercisesLinkPaperListModal" @ok="renovateRelPaperList" />
  </a-modal>
</template>

<script>
import _ from 'lodash'
import { tikuApiList } from '@/api/api'
import TYPELIST from '../data/test_paper_type_list'
import mixin_tiku from '../mixins/TikuListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import EditableCell from '../components/EditableCell'
import ExercisesAddQuestionTypeModal from '../modules/ExercisesAddQuestionTypeModal'
import ExercisesLinkPaperModal from '../modules/ExercisesLinkPaperModal'

export default {
  name: 'ExercisesEditModal', //练习题弹框-添加练习题|编辑练习题
  mixins: [mixin_tiku],
  components: { JSelectWorkTypeForTiku, EditableCell, ExercisesAddQuestionTypeModal, ExercisesLinkPaperModal },
  data() {
    let that = this
    return {
      scopeTypeList: TYPELIST.TESTPAPER_SCOPE_TYPE_LIST,
      pageModalType: 'add',
      visible: false,
      confirmLoading: false,
      submitDisabled: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      },
      worktypeLevelTypeList: [], //工种等级列
      form: {
        exerciseId: undefined,
        projectType: undefined, //项目类型
        workName: undefined, //工种类型
        workTypeId: undefined, //工种等级
        exerciseName: undefined, //试卷名称
        exerciseScope: undefined, //试题剔除选择范围
        totalNum: undefined //习题数量
      },
      queryParams: {
        questionTypeList: []
      },
      tempQuestionTypeList: [],
      questionMaxNum: 0,
      tableLoading: false,
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 70,
          align: 'center',
          customRender: (t, r, index) => index + 1
        },
        {
          title: '题型',
          dataIndex: 'questionTypeStr',
          width: 240
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
          align: 'center',
          width: 160
        }
      ],
      innerColumns: [
        {
          title: '序号',
          dataIndex: '',
          key: 'rowIndex',
          width: 70,
          align: 'center',
          customRender: (t, r, index) => index + 1
        },
        { title: '试卷名称', dataIndex: 'paperName', width: 240 },
        { title: '难易程度', dataIndex: 'hardLevelStr' },
        { title: '数量', dataIndex: 'num', width: '20%', scopedSlots: { customRender: 'num' } },
        { title: '试题最大数量', dataIndex: 'maxNum' },
        {
          title: '操作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' },
          align: 'center',
          width: 150
        }
      ],
      rules: {
        projectType: [{ required: true, message: '试题项目类型不能为空', trigger: 'change' }],
        workName: [{ required: true, message: '工种类型不能为空', trigger: 'change' }],
        workTypeId: [{ required: true, message: '工种等级不能为空', trigger: 'change' }],
        exerciseName: [
          { required: true, message: '试卷名称不能为空', trigger: 'blur' },
          { min: 1, max: 30, message: '试卷名称至少1个字，不超过30个字', trigger: 'blur' }
        ],
        exerciseScope: [{ required: true, message: '试题剔除范围不能为空', trigger: 'change' }],
        totalNum: [{ required: true, message: '习题数量不能为空', trigger: 'change' }]
      }
    }
  },
  created() {},
  computed: {
    title({ pageModalType }) {
      let res = undefined
      switch (pageModalType) {
        case 'add':
          res = '添加习题'
          break
        case 'edit':
          res = '编辑习题'
          break
        default:
          res = '未知操作'
          break
      }
      return res
    }
  },
  watch: {
    'form.workName': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          this.getWorklevelTypeList(newV)
        }
      }
    },
    'queryParams.questionTypeList': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.tempQuestionTypeList = newV
      }
    }
  },
  methods: {
    closeModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    setPageModalType(type) {
      this.pageModalType = type || 'add'
    },
    handleCancel() {
      this.closeModal()
    },
    handleOk() {
      this.doFormSubmit()
    },
    doResetForm() {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
        this.$forceUpdate()
      })
    },
    add() {
      this.form.exerciseId = undefined
      this.form.projectType = undefined
      this.form.workName = undefined
      this.form.workTypeId = undefined
      this.form.exerciseName = undefined
      this.form.exerciseScope = undefined
      this.form.totalNum = undefined
      this.tempQuestionTypeList = []
      this.queryParams.questionTypeList = []
    },
    edit(record) {
      if (!!record && !!record.exerciseId) {
        this.form.exerciseId = record.exerciseId
        this.form.projectType = record.projectType
        this.form.workName = record.workTypeName
        this.form.workTypeId = record.workTypeId
        this.form.exerciseName = record.exerciseName
        this.form.exerciseScope = record.exerciseScope
        this.form.totalNum = record.totalNum
        this.tempQuestionTypeList = []
        this.queryParams.questionTypeList = record.questionTypeList
      } else {
        this.$message.warning('习题ID缺失，数据回显失败！')
      }
    },
    initForm(record) {
      // this.pageModalType == 'edit' && !!record && !!record.id ? this.edit(record) : this.add()
      if (this.pageModalType == 'edit' && !!record && !!record.id) {
        this.getExerciseDetailById(record.id, res => {
          this.edit(res)
          this.showModal()
        })
      } else {
        this.add()
        this.showModal()
      }
    },
    handleAddLinkPaper(record) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs.exercisesLinkPaperListModal.initModal(record)
        }
      })
    },
    handleQuestionTypeAdd() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$refs.addQtExercisesModal.add()
        }
      })
    },
    handleExpand(expanded, record) {
      // console.log(expanded, record)
      let oldRelPaperList = !!record.relPaperList ? record.relPaperList : []
      let oldTotalNum = oldRelPaperList.reduce((total, currentValue) => {
        return total + currentValue.num * 1
      }, 0)
      let otherNum = record.num * 1 > oldTotalNum ? record.num * 1 - oldTotalNum : 0
      if (!!expanded) {
        let arr = []
        let other = {
          paperId: undefined,
          paperName: `其他`,
          hardLevelStr: '全部',
          num: otherNum,
          maxNum: record.totalCount
        }
        let targetIndex = oldRelPaperList.findIndex(
          (item, idx) => item.paperName == '其他' && item.hardLevelStr == '全部'
        )
        let res = oldRelPaperList
        if (targetIndex == -1) {
          arr.push(other)
          res = oldRelPaperList.concat(arr)
        }
        // res.forEach((ele, idx) => {
        //   ele.key = `${idx}`
        // })
        record.relPaperList = res
      }
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
    validateFormNum(opts) {
      let that = this
      let isOk = true
      let _totalNum = Number(opts.totalNum) || 0
      let _questionTypeList = !!opts.questionTypeList ? opts.questionTypeList : []
      let countTotalNum = _questionTypeList.reduce((total, currentValue) => {
        return total + currentValue.num * 1
      }, 0)
      if (countTotalNum <= _totalNum) {
        isOk = true
      } else {
        this.$message.error('全部题型的数量之和不能大于习题数量！')
        isOk = false
      }
      _.each(_questionTypeList, ele => {
        let innertotalNum = Number(ele.num) || 0
        let _relPaperList = !!ele.relPaperList ? ele.relPaperList : []
        let innerCountTotalNum = _relPaperList.reduce((total, currentValue) => {
          return total + currentValue.num * 1
        }, 0)
        //console.log(innerCountTotalNum , innertotalNum)
        if (innerCountTotalNum <= innertotalNum) {
          isOk = true
        } else {
          this.$message.error(`题型为${ele.questionTypeStr}的数量不能大于所关联试卷的题型数量之和！`)
          isOk = false
        }
      })
      return isOk
    },
    doFormSubmit() {
      // this.doSendFormDataSubmit(
      let that = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let opts = {
            ...this.form,
            ...this.queryParams
          }
          let isOk = that.validateFormNum(opts)
          if (isOk) {
            this.doSendFormDataSubmit(opts)
          }
        }
      })
    },
    doSendFormDataSubmit(opts) {
      // console.log(opts)
      this.submitDisabled = true
      let mess = this.pageModalType == 'eidt' ? '编辑习题' : '新增习题'
      tikuApiList.addAndEditExercises(opts).then(res => {
        this.submitDisabled = false
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message || `${mess}成功！`)
          setTimeout(() => {
            this.handleCancel()
            this.$emit('ok')
          }, 30)
        } else {
          this.$message.error(res.message || `${mess}失败！`)
        }
      })
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
    renovateTable(data) {
      let target = {
        key: undefined,
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
        target.key = dataSource.length + 1
        let newData = Object.assign({}, target)
        this.tempQuestionTypeList = dataSource.concat([newData])
        this.setQueryParamsQuestionTypeListVal()
        this.$refs.addQtExercisesModal.handleCancel()
        this.questionMaxNum = 0
      }
    },
    renovateMaxNum(data) {
      let target = {
        hardLevel: data.hardLevelId, //知识点id，左侧知识点树的知识点的id字段
        hardLevelStr: data.hardLevel,
        questionType: data.questionTypeId,
        questionTypeStr: data.questionType
      }
      let opts = Object.assign({}, this.form)
      opts.questionTypeList = [target]
      this.getQuestionTypeMaxNum(opts)
    },
    renovateRelPaperList(data, record) {
      const dataSource = [...this.tempQuestionTypeList]
      let targetIndex = dataSource.findIndex(item => item.questionType == record.questionType)
      if (targetIndex > -1) {
        //设置record的relPaperList  这块有问题 没有过滤
        record.relPaperList = [...data]
        this.handleExpand(true, record)
      } else {
        this.$message.error('添加关联试卷失败，请重新再试！')
      }
    },
    getQuestionTypeMaxNum(opts) {
      // this.questionMaxNum = 1
      tikuApiList.getExerciseMaxNumByQt(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          // console.log(res)
          this.questionMaxNum = res.result
        } else {
          this.$message.error(res.message || '获取试题最大数量失败！')
        }
      })
    },
    getExerciseDetailById(id, cbFn) {
      // this.questionMaxNum = 1
      if (!!id) {
        let opts = {
          exerciseId: id
        }
        tikuApiList.getExerciseSetById(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            // console.log(res)
            let resp = res.result
            // console.log(res)
            cbFn && cbFn(resp)
          } else {
            this.$message.error(res.message || '获取习题详情失败！')
          }
        })
      } else {
        this.$message.warning('习题ID缺失，请重新刷新列表！')
      }
    },
    onChangeWorkType() {
      this.form.workTypeId = undefined
      this.worktypeLevelTypeList = []
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
    onCellChangePaper(key, dataIndex, value, record, params) {
      // console.log(key, dataIndex, value, record, params)
      record[dataIndex] = value
      let _totalNum = Number(params.num)
      let _RelPaperList = !!params.relPaperList ? params.relPaperList : []
      let countTotalNum = _RelPaperList.reduce((total, currentValue) => {
        return total + currentValue.num * 1
      }, 0)
      if (_totalNum < countTotalNum) {
        this.$message.warning(`题型为【${params.questionTypeStr}】的试题总数不正确，请修改！`)
      }
    },
    initModal(type, record) {
      this.setPageModalType(type)
      this.initForm(record)
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.modal-container {
  .modal-section {
    position: relative;
    padding-bottom: 20px;

    .form-container {
      .ant-form-item {
        margin-bottom: 10px;
      }
    }

    .modal-section-head {
      margin-left: 5px;

      > span.head-title {
        font-size: 16px;
      }

      .head-action {
        position: absolute;
        top: 5px;
        right: 15px;
      }
    }

    .tixing-list-wrap {
      margin-top: 20px;
    }
  }
}
</style>

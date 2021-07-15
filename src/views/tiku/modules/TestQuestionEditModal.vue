<template>
  <a-modal
    :title="title"
    width="70%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
    class="edit"
  >
    <template slot="footer">
      <a-button type="primary" v-if="pageModalType == 'add'" @click="handleSaveNext">保存并新增下一题</a-button>
      <a-button type="primary" @click="handleSave">保存</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>

    <a-result
      v-if="form.pageModalType == 'edit' && !form.questionTypeId"
      status="warning"
      title="编辑状态下，题目类型不能为空！"
      sub-title="试题的数据有错误：题目类型为空或者不存在此种类型的题目！"
    >
    </a-result>
    <!-- 试题信息 -->
    <a-form-model
      ref="ruleForm"
      class="plan"
      :model="form"
      :rules="rules"
      layout="horizontal"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 19 }"
      v-else
    >
      <a-row :gutter="24">
        <a-col :span="14">
          <a-form-model-item label="试题类型" prop="questionTypeId" v-if="!form.id">
            <a-select placeholder="请选择试题类型" v-model="form.questionTypeId">
              <a-select-option v-for="item in questionTypeList.slice(1)" :key="item.itemValue">
                {{ item.itemText }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="试题类型" prop="questionTypeId" v-if="form.id">
            <a-select placeholder="请选择试题类型" v-model="form.questionTypeId" disabled>
              <a-select-option v-for="item in questionTypeList.slice(1)" :key="item.itemValue">
                {{ item.itemText }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="题干录入" prop="title">
            <tiku-editor :value.sync="form.title"></tiku-editor>
            <!-- <span class="tishi" v-if="form.questionTypeId == 4">
              注意：填空题中的下划线 “_____” 请换成“（.）”输入。小提示：可以复制本处“（.）”
            </span> -->
          </a-form-model-item>

          <template v-if="form.questionTypeId == 1 || form.questionTypeId == 2">
            <a-form-model-item label="选项个数" prop="optionsNum">
              <a-select placeholder="请选择选项个数" v-model="form.optionsNum" @change="onChangeOptsNum">
                <a-select-option v-for="item in 10" v-if="item > 2" :key="item"> {{ item }}</a-select-option>
              </a-select>
            </a-form-model-item>

            <a-form-model-item label="选项内容" prop="questionOpt">
              <a-radio-group v-model="curQuestionOpt">
                <a-radio v-for="item in questionOptions" :value="item.sort" :key="item.id">
                  {{ item.sort | getCharsByNum }}
                </a-radio>
              </a-radio-group>
              <template v-if="questionOptions.length > 0">
                <tiku-editor
                  v-for="item in questionOptions"
                  :key="item.id"
                  :value.sync="item['optionContent']"
                  v-show="curQuestionOpt == item.id"
                  triggerChange
                ></tiku-editor>
              </template>
            </a-form-model-item>
          </template>

          <a-form-model-item label="正确答案" prop="answer" v-if="form.questionTypeId == 1">
            <a-radio-group v-model="form.answer">
              <a-radio v-for="item in form.optionsNum" :value="item" :key="item">{{ item | getCharsByNum }}</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="正确答案" prop="answer" v-else-if="form.questionTypeId == 2">
            <a-checkbox-group v-model="answerCheckboxVal" @change="onChangeCheckBox">
              <a-checkbox v-for="item in form.optionsNum" :value="item" :key="item">
                {{ item | getCharsByNum }}
              </a-checkbox>
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item label="正确答案" prop="answer" v-else-if="form.questionTypeId == 3">
            <a-radio-group v-model="form.answer">
              <a-radio value="1">正确</a-radio>
              <a-radio value="2">错误</a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item
            :label="
              form.questionTypeId == 5 || form.questionTypeId == 7 || form.questionTypeId == 8 ? '参考答案' : '正确答案'
            "
            prop="answer"
            v-else-if="
              form.questionTypeId == 4 ||
                form.questionTypeId == 5 ||
                form.questionTypeId == 6 ||
                form.questionTypeId == 7 ||
                form.questionTypeId == 8
            "
          >
            <tiku-editor :value.sync="form.answer" triggerChange></tiku-editor>
            <span class="tishi" v-if="form.questionTypeId == 4 || form.questionTypeId == 6">
              注意：多个答案请用三个竖线隔开。例如：答案A|||答案B|||答案C。
            </span>
          </a-form-model-item>
          <a-form-model-item label="参考答案" prop="answer" v-else>
            <span>特别提醒：请选择正确的题型！</span>
          </a-form-model-item>

          <a-form-model-item label="答案解析" prop="analysis">
            <tiku-editor :value.sync="form.analysis" triggerChange></tiku-editor>
          </a-form-model-item>
        </a-col>

        <a-col :span="9" :offset="1">
          <a-form-model-item label="项目分类" prop="projectTypeId">
            <a-select placeholder="请选择项目分类" v-model="form.projectTypeId">
              <a-select-option
                v-for="item in projectTypeList.slice(1)"
                :key="item.itemValue"
                :disabled="item.itemValue == 3"
                >{{ item.itemText }}</a-select-option
              >
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="工种类型" prop="workType">
            <j-select-work-type-for-tiku
              placeholder="请选择工种类型"
              :multiple="false"
              v-model.trim="form.workType"
              @change="onChangeWorkType"
            />
          </a-form-model-item>

          <a-form-model-item label="工种等级" prop="workTypeId">
            <a-select placeholder="请选择工种等级" v-model="form.workTypeId" @change="onChangeWorkTypeId">
              <a-select-option v-for="item in worktypeLevelTypeList" :key="item.id">{{
                item.workLevel
              }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="难易程度" prop="hardLevelId">
            <a-select placeholder="请选择难易程度" v-model="form.hardLevelId">
              <a-select-option v-for="item in difficultyTypeList.slice(1)" :key="item.itemValue">{{
                item.itemText
              }}</a-select-option>
            </a-select>
          </a-form-model-item>

          <a-form-model-item label="知识点" prop="knowledgeList">
            <!-- <j-select-knowledge
              placeholder="请选择知识点"
              :multiple="true"
              v-model.trim="form.knowledgeIds"
              :workTypeId="form.workTypeId"
              :disabled="false"
            /> -->
            <KnowledgeIndex :workTypeId="form.workTypeId" :list="knowledgeList" @ok="getKownledgeVal" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import { tikuApiList } from '@/api/api'
import mixin_tiku from '../mixins/TikuListMixin'

import JSelectWorkTypeForTiku from '@/components/jeecgbiz/JSelectWorkTypeForTiku'
import JSelectKnowledge from '../components/JSelectKnowledge'
import TikuEditor from './../components/TikuEditor'
import KnowledgeIndex from '../components/KnowledgeIndex'

export default {
  name: 'TestQuestionEditModal', //试题新增、编辑弹框
  mixins: [mixin_tiku],
  components: { JSelectWorkTypeForTiku, JSelectKnowledge, TikuEditor, KnowledgeIndex },
  data() {
    let that = this
    let validatorAnswer = (rule, value, callback) => {
      // 如果为空值，就抛出错误
      if (!value) {
        callback(new Error('正确答案不能为空!'))
      } else {
        if (this.form.questionTypeId == 2) {
          if (this.answerCheckboxVal.length == 0) {
            callback(new Error('多选题正确答案不能为空!'))
          } else if (this.answerCheckboxVal.length == 1) {
            callback(new Error('多选题正确答案至少2个!'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
    }
    let validatorKnowledge = (rule, value, callback) => {
      // 如果为空值，就抛出错误
      if (this.knowledgeList.length > 0) {
        callback()
      } else {
        callback(new Error('知识点不能为空!'))
      }
    }
    return {
      title: '新增试题',
      pageModalType: 'add',
      saveActType: 'add',
      visible: false,
      confirmLoading: false,
      readOnly: true, //只读
      disableSubmit: false, //禁止提交
      worktypeLevelTypeList: [], //工种等级列
      defaultOptsFirstVal: 3,
      form: {
        id: undefined,
        questionTypeId: undefined, //题型
        title: undefined, //试题题干
        optionsNum: 4, //选项个数,默认4个
        answer: undefined, //试题答案 单选题是'1',多选题是[1,2,3]
        analysis: undefined, //试题答案解析
        hardLevelId: undefined, //难度等级
        projectTypeId: undefined, //项目类型
        workType: undefined, //工种类型
        workTypeId: undefined //工种等级
      },
      oldQuestionOptions: [],
      questionOptions: [],
      curQuestionOpt: 1, //当前选中的试题选项
      answerCheckboxVal: [],
      knowledgeList: [], //知识点
      rules: {
        questionTypeId: [{ required: true, message: '题型不能为空', trigger: 'change' }],
        title: [{ required: true, message: '试题题干不能为空', trigger: 'change' }],
        projectTypeId: [{ required: true, message: '试题项目类型不能为空', trigger: 'change' }],
        hardLevelId: [{ required: true, message: '试题难度等级不能为空', trigger: 'change' }],
        workType: [{ required: true, message: '工种类型不能为空', trigger: 'change' }],
        workTypeId: [{ required: true, message: '工种等级不能为空', trigger: 'change' }],
        knowledgeList: [{ required: true, validator: validatorKnowledge, trigger: 'change' }],
        answer: [{ required: true, validator: validatorAnswer, trigger: 'change' }]
      }
    }
  },
  created() {
    // console.log(this.workTypeId)
  },
  computed: {},
  watch: {
    'form.optionsNum': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.onChangeOptsNum(newV)
      }
    },
    'form.workType': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (!!newV) {
          this.getWorklevelTypeList(newV)
        }
      }
    },
    'form.questionTypeId': {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        if (newV == 1 || newV == 2) {
          this.onChangeOptsNum(this.form.optionsNum)
        }
      }
    }
  },
  methods: {
    getKownledgeVal(val) {
      // console.log(val)
      this.knowledgeList = val
    },

    change: function() {
      this.$refs.modalForm.add()
      this.$refs.modalForm.disableSubmit = false
    },

    closeModal() {
      this.visible = false
    },
    showModal() {
      this.visible = true
    },
    handleCancel() {
      !!this.form.id && this.pageModalType == 'edit' && this.dismissEditById(this.form.id)
      this.closeModal()
      this.doResetForm()
      if (!!this.form.id) {
        //关闭弹框的时候解除试题编辑状态
        let id = this.form.id
        this.dismissEditById(id)
      }
    },
    onChangeCheckBox(checkedValue) {
      if (!checkedValue || checkedValue.length == 0) {
        this.form.answer = undefined
      } else {
        this.answerCheckboxVal = _.sortBy(checkedValue)
        this.form.answer = this.form.questionTypeId == 2 ? this.answerCheckboxVal.join(',') : undefined
      }
    },
    onChangeOptsNum(value, option) {
      // console.log(value, option)
      let that = this
      let questionOpts = []
      for (let i = 0; i < value; i++) {
        questionOpts.push({
          id: i + 1,
          optionContent: undefined,
          sort: i + 1
        })
      }
      this.questionOptions.length = value
      this.questionOptions = questionOpts
      this.curQuestionOpt = 1 //改变选项个数的时候，设置当前的选中项为第1项
      this.setAnswerOptsContent()
    },
    setAnswerOptsContent() {
      for (let i = 0; i < this.questionOptions.length; i++) {
        for (let j = 0; j < this.oldQuestionOptions.length; j++) {
          if (i == j) {
            this.questionOptions[i]['optionContent'] = this.oldQuestionOptions[i]['optionContent']
          }
        }
      }
    },
    add() {
      this.pageModalType = 'add'
      this.saveActType = this.pageModalType
      this.showModal()
      this.doResetForm()
    },
    edit(record) {
      this.pageModalType = 'edit'
      this.saveActType = this.pageModalType
      this.showModal()
      this.doResetForm()
      this.$nextTick(() => {
        this.initFormVal(record)
      })
    },
    doResetForm() {
      this.$nextTick(() => {
        this.oldQuestionOptions = []
        this.questionOptions = []
        this.curQuestionOpt = 1 //当前选中的试题选项
        this.answerCheckboxVal = []
        this.knowledgeList = [] //知识点

        this.$refs.ruleForm.resetFields()
        this.form.id = undefined
        this.form.questionTypeId = '1' //默认为单选题
        this.form.title = undefined
        this.form.answer = undefined
        this.form.analysis = undefined
        this.form.optionsNum = this.pageModalType == 'edit' ? 1 : 4
        this.onChangeOptsNum(this.form.optionsNum)
        this.$forceUpdate()
      })
    },
    clearFormLeftData() {
      this.oldQuestionOptions = []
      this.questionOptions = []
      this.curQuestionOpt = 1 //当前选中的试题选项
      this.answerCheckboxVal = []

      this.form.id = undefined
      this.form.questionTypeId = undefined
      this.form.title = undefined
      this.form.optionsNum = 4
      this.form.answer = undefined
      this.form.analysis = undefined
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.form.questionTypeId == 1 || this.form.questionTypeId == 2) {
            for (let j = 0; j < this.questionOptions.length; j++) {
              if (
                this.questionOptions[j]['optionContent'] == undefined ||
                this.questionOptions[j]['optionContent'] == ''
              ) {
                //存在选项内容为空，拒绝保存
                this.$message.warning('操作失败，任何一个选项内容均不能为空！')
                return false
              }
            }
          }
          this.doSendFormDataSubmit()
        } else {
          //this.$message.warning('验证没通过！')
          return false
        }
      })
    },
    handleSaveNext() {
      this.saveActType = 'addNext'
      this.doFormSubmit()
    },
    handleSave() {
      this.doFormSubmit()
    },
    doSendFormDataSubmit() {
      if (this.pageModalType == 'add') {
        this.addTestQuestionData()
      } else {
        this.editTestQuestionData()
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
    addTestQuestionData() {
      let opts = {
        knowledgeList: this.knowledgeList,
        options: this.questionOptions,
        question: this.form
      }
      tikuApiList.addTq(opts).then(res => {
        if (res.code == 200 && !!res.success) {
          this.$message.success(res.message || '新增成功！')
          if (this.saveActType == 'addNext') {
            setTimeout(() => {
              this.clearFormLeftData()
            }, 0)
          } else {
            setTimeout(() => {
              this.handleCancel()
              this.$emit('saveAfter')
            }, 0)
          }
        } else {
          this.$message.error(res.message || '新增失败！')
        }
      })
    },
    editTestQuestionData() {
      let opts = {
        knowledgeList: this.knowledgeList,
        options: this.questionOptions,
        question: this.form
      }
      if (!!this.form.id) {
        tikuApiList.editTq(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '修改成功！')
            setTimeout(() => {
              this.handleCancel()
              this.$emit('saveAfter')
            }, 0)
          } else {
            this.$message.error(res.message || '修改失败！')
          }
        })
      } else {
        this.$message.error('试题id不存在，请联系技术人员！')
      }
    },
    initFormVal(record) {
      // console.log(record)
      if (!!record && !!record.id) {
        // console.log(record)
        // this.form = Object.assign({}, this.form, record.question)
        this.form.id = record.question.id
        this.form.questionTypeId = record.question.questionTypeId
        this.form.title = record.question.title
        this.form.optionsNum = !!record.options && record.options.length > 0 ? record.options.length : 3

        //处理题型答案
        if (this.form.questionTypeId == 1) {
          this.form.answer = record.question.answer * 1
        } else if (this.form.questionTypeId == 2) {
          this.form.answer = record.question.answer
          this.answerCheckboxVal = this.form.answer.split(',')
          this.answerCheckboxVal = _.map(this.answerCheckboxVal, ele => {
            return ele * 1
          })
        } else {
          this.form.answer = record.question.answer
        }

        this.form.analysis = record.question.analysis
        this.form.hardLevelId = record.question.hardLevelId
        this.form.projectTypeId = record.question.projectTypeId
        this.form.workType = record.question.workType //工作类型
        this.form.workTypeId = record.question.workTypeId //工作等级

        this.oldQuestionOptions = record.options || []
        // this.questionOptions = this.oldQuestionOptions
        this.knowledgeList = record.knowledgeList //知识点
      } else {
        this.$message.error('试题初始化数据不存在，请重新再试！')
      }
    },

    onChangeWorkType() {
      this.form.workTypeId = undefined
      this.knowledgeList = []
    },

    onChangeWorkTypeId() {
      this.knowledgeList = []
      this.$forceUpdate()
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped></style>

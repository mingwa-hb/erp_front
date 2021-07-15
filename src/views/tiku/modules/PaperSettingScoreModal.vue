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
    <div class="form-container">
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        layout="horizontal"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <div class="group-control-container">
          <a-row :gutter="[0, 16]" class="form-row-control">
            <a-col :span="9">
              <a-form-model-item label="试卷总分" prop="totalScore">
                <a-input addon-after="分" v-model="form.totalScore" :min="1" :max="1000" />
              </a-form-model-item>
            </a-col>
            <a-col :span="9">
              <a-form-model-item label="合格分数" prop="passScore">
                <a-input addon-after="分" v-model="form.passScore" :min="1" :max="1000" />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
        <div class="group-control-container" v-for="item in groupListFormData" :key="item.sort">
          <a-row :gutter="[0, 16]">
            <a-col :span="8">
              <h2>
                <span>{{ item.sort | getCapitalizeByNum }}、</span>
                <span>{{ item.questionTypeStr }}</span>
              </h2>
            </a-col>
            <a-col :span="8">
              <a-form-model-item label="总分">
                <a-input
                  addon-after="分"
                  v-model="item.score"
                  :min="1"
                  :max="1000"
                  @change="e => onChangeGroupScore(e, item)"
                />
              </a-form-model-item>
            </a-col>
            <a-col :span="8">
              <a-button type="primary" size="small" @click="e => hanledEqualDivision(e, item)">平均分配</a-button>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 16]" class="form-row-control">
            <a-col :span="4" v-for="ele in item.questionList" :key="ele.sort">
              <a-form-model-item :label="ele.sort">
                <a-input
                  addon-after="分"
                  v-model="ele.score"
                  :min="1"
                  :max="1000"
                  @change="e => onChangeQuestionScore(e, ele, item)"
                />
              </a-form-model-item>
            </a-col>
          </a-row>
        </div>
      </a-form-model>
    </div>

    <template slot="footer">
      <a-button @click="handleCancel">取消</a-button>
      <a-button type="primary" @click="handleReset">清空</a-button>
      <a-button type="primary" @click="handleOk">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
import _ from 'lodash'
import { tikuApiList } from '@/api/api'
export default {
  name: 'PaperSettingScoreModal', //试卷设置分数弹框
  mixins: [],
  components: {},
  props: {
    paperBaseData: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    },
    groupBaseData: {
      type: Array,
      default: () => {
        return []
      },
      required: false
    }
  },
  data() {
    let that = this
    return {
      title: '设置试卷分数',
      visible: false,
      confirmLoading: false,
      form: {
        totalScore: 0,
        passScore: 0
      },
      paperScoreListForm: [],
      rules: {
        totalScore: [
          {
            required: true,
            message: '请输入正确的试卷分数',
            trigger: 'change'
          }
        ],
        passScore: [
          {
            required: true,
            message: '试卷合格分数不能为空',
            trigger: 'change'
          },
          {
            type: 'number',
            validator: (rule, value, callback) => {
              // 如果为空值，就抛出错误
              if (/^\d+(\.\d+)?$/.test(value)) {
                if (Number(value) > Number(that.form.totalScore)) {
                  callback(new Error('合格分数不能大于总分数!'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('试卷分数只能为数字!'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  created() {},
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    },
    groupListFormData() {
      let res = []
      let len = this.groupBaseData.length
      if (len > 0) {
        for (let i = 0; i < len; i++) {
          let target = this.groupBaseData[i]
          let temp = {
            id: i,
            sort: target.sortKey,
            groupId: target.id,
            questionType: target.questionType,
            questionTypeStr: target.questionTypeStr,
            score: target.score,
            questionList: []
          }
          if (!!target.questionList && target.questionList.length > 0) {
            let qLen = target.questionList.length
            for (let j = 0; j < qLen; j++) {
              let qTarget = target.questionList[j]
              let qTemp = {
                id: j,
                sort: qTarget.sortKey,
                paperQuestionId: qTarget.id,
                questionType: qTarget.questionType,
                questionTypeStr: qTarget.questionTypeStr,
                score: qTarget.score
              }
              temp.questionList.push(qTemp)
            }
          }
          res.push(temp)
        }
      }
      return res
    }
  },
  filters: {
    getCapitalizeByNum(num) {
      let res = undefined
      let chineseArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      res = chineseArr[num * 1]
      return res
    }
  },
  watch: {
    paperBaseData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.form.totalScore = newV.totalScore
        this.form.passScore = newV.passScore
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
    handleCancel() {
      this.closeModal()
    },
    handleReset() {
      let list = this.groupListFormData
      const setScore = (arr, score) => {
        _.forEach(arr, ele => {
          ele.score = 0
          if (!!ele.questionList && ele.questionList.length > 0) {
            setScore(ele.questionList, score)
          }
        })
      }
      this.form.passScore = 0
      setScore(list, 0)
      this.onChangePaperTotalScore()
      this.$forceUpdate()
    },
    handleOk() {
      this.doFormSubmit()
    },
    hanledEqualDivision(e, record) {
      // console.log(e, record)
      let questionList = record.questionList
      let totalScore = Number(record.score)
      let num = questionList.length
      let equalScore = Math.floor(totalScore / num) //取商的整数
      let remindScore = totalScore % num //取余数
      _.forEach(questionList, (ele, idx) => {
        if (remindScore > 0 && idx == num - 1) {
          ele.score = equalScore + remindScore
        } else {
          ele.score = equalScore
        }
      })
      this.$forceUpdate()
    },
    onChangeGroupScore(e, record) {
      // console.log(e.target.value, record)
      this.onChangePaperTotalScore()
      this.$forceUpdate()
    },
    onChangeQuestionScore(e, record, precord) {
      this.onChangeGroupTotalScore(precord)
      this.$forceUpdate()
    },
    onChangePaperTotalScore() {
      let scoreArr = _.map(this.groupListFormData, 'score')
      let totalScore = scoreArr.reduce((prev, curr, idx, arr) => {
        return Number(prev) + Number(curr)
      })
      this.form.totalScore = totalScore
    },
    onChangeGroupTotalScore(record) {
      let arr = record.questionList || []
      let scoreArr = _.map(arr, 'score') || []
      let totalScore = scoreArr.reduce((prev, curr, idx, arr) => {
        return Number(prev) + Number(curr)
      })
      record.score = totalScore
      this.onChangePaperTotalScore()
      this.$forceUpdate()
    },
    setPaperScoreListForm() {
      let res = []
      let list = this.groupListFormData
      _.forEach(list, ele => {
        let obj = {
          id: ele.id,
          sort: ele.sort,
          groupId: ele.groupId,
          questionType: ele.questionType,
          questionTypeStr: ele.questionTypeStr,
          score: ele.score,
          paperScoreQuestionVOList: ele.questionList
        }
        console.log(ele.score)
        res.push(obj)
      })

      this.paperScoreListForm = res
    },
    validFormOpts() {
      let isOk = false
      let list = this.groupListFormData
      let paperTotalScore = Number(this.form.totalScore)
      let groupScoreArr = _.map(this.groupListFormData, 'score')
      let gCountTotalScore = groupScoreArr.reduce((prev, curr, idx, arr) => {
        return Number(prev) + Number(curr)
      })
      if (gCountTotalScore == paperTotalScore) {
        isOk = true
      } else {
        this.$message.warning('分数设置不正确：试卷总分数不等于每个大题设置的总分数！')
        isOk = false
        return false
      }
      _.forEach(list, ele => {
        let groupTotalScore = Number(ele.score)
        let questionScoreArr = _.map(ele.questionList, 'score')
        let qCountTotalScore = questionScoreArr.reduce((prev, curr, idx, arr) => {
          return Number(prev) + Number(curr)
        })
        if (qCountTotalScore == groupTotalScore) {
          isOk = true
        } else {
          this.$message.warning(`分数设置不正确：${ele.questionTypeStr}总分数不等于每个小题设置的总分数！`)
          isOk = false
          return false
        }
      })
      return isOk
    },
    doFormSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.doSendFormDataSubmit()
        } else {
          return false
        }
      })
    },
    doSendFormDataSubmit() {
      //设置提交后端的分数列表数据
      this.setPaperScoreListForm()

      let opts = {
        paperId: this.paperId,
        ...this.form,
        paperScoreGroupVOList: this.paperScoreListForm
      }
      let isOk = this.validFormOpts()
      if (isOk) {
        this.updatePaperScore(opts)
      }
    },
    updatePaperScore(opts) {
      if (!!opts.paperId) {
        tikuApiList.setTpScore(opts).then(res => {
          if (res.code == 200 && !!res.success) {
            this.$message.success(res.message || '设置分数成功！')
            setTimeout(() => {
              this.handleCancel()
              this.$emit('afterSetScore')
            }, 0)
          } else {
            this.$message.error(res.message || '设置分数失败！')
          }
        })
      } else {
        this.$message.error('试卷ID没不存在，请重新刷新页面！')
      }
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.modal-container {
  .form-container {
    .group-control-container {
      margin-bottom: 20px;
      .ant-form-item {
        margin-bottom: 4px;
      }
      .form-row-control {
        background-color: #ffffff;
        box-shadow: 0px 0px 10px rgba(102, 102, 102, 0.15);
        opacity: 1;
        border-radius: 10px;

        .ant-form-item {
          margin-bottom: 4px;
        }
      }

      .ant-btn {
        margin: 8px 0;
        box-sizing: content-box;
      }
    }
  }
}
</style>

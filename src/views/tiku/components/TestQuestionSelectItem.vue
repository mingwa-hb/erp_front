<template>
  <div class="list-item-group">
    <div class="list-item-header">
      <div class="item-head-l" @click="toggleShowAnwser">
        <span class="type-item">
          <span class="label">项目分类：</span>
          <span>{{ itemData.question.projectType }}</span>
        </span>
        <span class="type-item">
          <span class="label">工种：</span>
          <span>{{ itemData.question.workType }}</span>
        </span>
        <span class="type-item">
          <span class="label">等级：</span>
          <span>{{ itemData.question.workTypeLevel }}</span>
        </span>
        <span class="type-item">
          <span class="label">难易：</span>
          <span>{{ itemData.question.hardLevel }}</span>
        </span>
        <span class="type-item">
          <span class="label">题型：</span>
          <span>{{ itemData.question.questionType }}</span>
        </span>
        <span class="type-item">
          <span class="label">来源：</span>
          <span>{{ itemData.question.source }}</span>
        </span>
        <span class="type-item">
          <span class="label">更新人：</span>
          <span>{{ itemData.question.updateBy }}</span>
        </span>
      </div>
      <!--<div class="item-head-r"></div>-->
    </div>
    <a-divider dashed />
    <div class="list-item-content">
      <div class="item-trunk-box" v-html="itemData.question.title" @click="toggleShowAnwser"></div>
      <div
        class="item-option-list"
        v-if="itemData.question.questionTypeId == 1 || itemData.question.questionTypeId == 2"
      >
        <div class="item-option-box" v-for="(item, index) in itemData.options" :key="index">
          <span class="item-option-bs" style="font-size: 20px">{{ item.sort | getCharsByNum }}.</span>
          <div class="item-option-item" v-html="item.optionContent"></div>
        </div>
      </div>
      <div class="item-option-list" v-if="itemData.question.questionTypeId == 3">
        <div class="item-option-box">
          <span class="item-option-bs" style="font-size: 20px;">T:</span>
          <div class="item-option-item" style="font-size: 20px;"><p>正确</p></div>
        </div>
        <div class="item-option-box">
          <span class="item-option-bs" style="font-size: 20px;">F:</span>
          <div class="item-option-item" style="font-size: 20px;"><p>错误</p></div>
        </div>
      </div>
      <div class="item-answer-box" v-if="itemData.isShowAnswer">
        <div class="item-answer-section">
          <span class="type-label">【答案】</span>
          <div
            class="answer-content"
            v-if="itemData.question.questionTypeId == 1 || itemData.question.questionTypeId == 2"
          >
            <span v-for="(item, index) in answerOpts" :key="index">{{ item | getCharsByNum }}</span>
          </div>
          <div class="answer-content" v-else-if="itemData.question.questionTypeId == 3">
            <span v-if="itemData.question.answer == 1">正确</span>
            <span v-else-if="itemData.question.answer == 2">错误</span>
            <span v-else>未知</span>
          </div>
          <div class="answer-content" v-else v-html="itemData.question.answer"></div>
        </div>
        <div class="item-answer-section">
          <span class="type-label">【解析】</span>
          <div class="answer-analysis" v-html="itemData.question.analysis"></div>
        </div>
        <div class="item-answer-section">
          <span class="type-label">【知识点】</span>
          <div class="item-kownledge-list">
            <div class="item-kownledge-item-container" v-for="(item, index) in itemData.knowledgeList" :key="index">
              <span class="item-kownledge-item" v-html="item.content"></span>
              <span class="divide-v-line" v-if="index < itemData.knowledgeList.length - 1">|</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-item-footer">
      <div class="item-head-l">
        <span class="type-item update-time">
          <span class="label">更新时间：</span>
          <span style="font-size: 14px">{{ itemData.question.updateTime }}</span>
        </span>
      </div>
      <div class="item-head-r" v-if="listItemType == 'add'">
        <a-button v-if="itemData.isChoose == 1" type="primary" icon="minus" ghost @click="handleMoveOutQuestion">
          移出试题篮
        </a-button>
        <a-button v-else-if="itemData.isChoose == 2" type="primary" icon="plus" @click="handleAddToPaper">
          加入试题篮
        </a-button>
        <a-button v-else type="primary" icon="exclamation" disabled="true">
          不清楚
        </a-button>
      </div>
      <div class="item-head-r" v-if="listItemType == 'replace'">
        <a-button
          v-if="itemData.isChoose == 1"
          type="primary"
          icon="exclamation-circle"
          :disabled="itemData.isChoose == 1"
        >
          已被使用
        </a-button>
        <a-button
          v-else-if="itemData.isChoose == 2"
          type="primary"
          :ghost="!!isChecked ? false : true"
          :icon="!!isChecked ? 'check-circle' : 'plus-circle'"
          @click="handleReplace"
        >
          <template v-if="!!isChecked">此题替换</template>
          <template v-else>可以替换</template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import TYPELIST from './../data/test_data'
import { tikuApiList } from '@/api/api'
export default {
  name: 'TestQuestionSelectItem', //试题列表item
  mixins: [],
  components: {},
  props: {
    listItemType: {
      type: String,
      default: () => {
        return 'add'
      },
      required: false
    },
    selectedRow: {
      type: Object,
      default: () => {
        return null
      },
      required: false
    },
    initData: {
      type: Object,
      default: () => {
        return null
      },
      required: true
    }
  },
  data() {
    return {
      checked: false,
      showAnswerContent: false,
      itemData: Object.assign({}, this.initData)
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    },
    answerOpts() {
      let arr = []
      if (this.itemData.question.questionTypeId == 1 || this.itemData.question.questionTypeId == 2) {
        arr = this.itemData.question.answer.split(',')
      }
      return arr
    },
    isChecked() {
      let res = !!this.selectedRow && this.itemData.id == this.selectedRow.id ? true : false
      return res
    }
  },
  created() {},
  filters: {
    getCharsByNum(val) {
      let charsArr = TYPELIST.CHARS_TYPE_LIST
      let res = charsArr[val - 1]
      if (res == undefined) {
        return
      }
      return res.label
    }
  },
  watch: {
    initData: {
      deep: true,
      immediate: true,
      handler(newV, oldV) {
        this.itemData = Object.assign({}, newV)
      }
    }
  },
  methods: {
    toggleShowAnwser(e) {
      // console.log(e)
      if (e.target.nodeName != 'INPUT') {
        this.$set(this.itemData, 'isShowAnswer', !this.itemData.isShowAnswer)
      }
    },
    handleAddToPaper() {
      this.addQuestionToCart()
    },
    handleDelete() {
      this.$emit('doDelete', this.itemData)
    },
    handleReplace() {
      this.$emit('doReplace', this.itemData)
    },
    handleMoveOutQuestion() {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '确认从试题篮中移除此小题吗?',
        onOk: () => {
          let opts = {
            paperId: this.paperId,
            paperQuestionId: this.itemData.paperQuestionId
          }
          that.outQuestionFromCart(opts)
        }
      })
    },
    outQuestionFromCart(opts) {
      if (!!opts.paperQuestionId) {
        tikuApiList.deleteTpQuestionById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '从试题篮中移除成功！')
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '从试题篮中移除失败！')
          }
        })
      } else {
        this.$message.error('paperQuestionId不存在，请重新刷新页面！')
      }
    },
    addQuestionToCart() {
      let opts = {
        paperId: this.paperId,
        questionId: this.itemData.id
      }
      if (!!opts.paperId && !!opts.questionId) {
        tikuApiList.addQuestionToCart(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '加入试题篮成功！')
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '加入试题篮失败！')
          }
        })
      } else {
        this.$message.error('questionId或者paperId不存在，请重新刷新页面！')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import '../less/item.less';
</style>

<template>
  <div class="list-item-group">
    <div class="list-item-header">
      <div class="item-head-l" @click="toggleShowAnwser">
        <span class="type-item">
          <a-checkbox v-model="itemData.checked" @change="onCheckedChange"></a-checkbox>
        </span>
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
      <div class="item-head-r">
        <a-button type="primary" icon="edit" @click="handleEdit">编辑</a-button>
        <a-button type="primary" icon="delete" style="margin-left: 20px" @click="handleDelete">删除</a-button>
      </div>
    </div>
  </div>
</template>

<script>
import TYPELIST from './../data/test_data'
export default {
  name: 'TestQuestionListItem', //试题列表item
  mixins: [],
  components: {},
  props: {
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
      showAnswerContent: false,
      itemData: Object.assign({}, this.initData)
    }
  },
  computed: {
    answerOpts() {
      let arr = []
      if (this.itemData.question.questionTypeId == 1 || this.itemData.question.questionTypeId == 2) {
        arr = this.itemData.question.answer.split(',')
      }
      return arr
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
    handleEdit() {
      this.$emit('doEdit', this.itemData)
    },
    handleDelete() {
      this.$emit('doDelete', this.itemData)
    },
    onCheckedChange(e) {
      this.$emit('doCheckedChange', e, this.itemData)
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import '../less/item.less';
</style>

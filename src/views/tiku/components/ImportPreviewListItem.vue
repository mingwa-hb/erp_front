<template>
  <div class="list-item-group">
    <div class="list-item-content">
      <div class="item-trunk-box" v-html="itemData.question.title"></div>
      <div class="item-option-list">
        <div class="item-option-box" v-for="(item, index) in itemData.options" :key="index">
          <span class="item-option-bs">{{ item.sort | getCharsByNum }}</span>
          <div class="item-option-item" v-html="item.optionContent"></div>
        </div>
      </div>
      <div class="item-answer-box">
        <div class="item-answer-section">
          <span class="type-label">【答案】</span>
          <div class="answer-content" v-html="itemData.question.answer"></div>
        </div>
        <div class="item-answer-section">
          <span class="type-label">【解析】</span>
          <div class="answer-analysis" v-html="itemData.question.analysis"></div>
        </div>
        <div class="item-answer-section">
          <span class="type-label">【知识点】</span>
          <div class="item-option-list">
            <div v-for="(item, index) in itemData.knowledgeList" :key="index">
              <div class="item-option-item" v-html="item.content"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-item-footer">
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
  name: 'ImportPreviewListItem', //导入试题预览列表item
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
      showAnswerCont: false,
      itemData: this.initData
    }
  },
  computed: {},
  created() {},
  filters: {
    getCharsByNum(val) {
      let charsArr = TYPELIST.CHARS_TYPE_LIST
      let res = charsArr[val - 1]
      return res.label
    }
  },
  methods: {
    handleEdit() {
      this.$emit('doEdit', this.itemData)
    },
    handleDelete() {
      this.$emit('doDelete', this.itemData)
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
@import '../less/item.less';
</style>

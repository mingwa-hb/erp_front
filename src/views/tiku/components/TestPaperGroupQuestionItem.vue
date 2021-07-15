<template>
  <div
    :ref="'shitiDom' + itemData.sortKey"
    class="shiti-item-control"
    :class="{ 'shiti-border': !!showItemActions }"
    @mouseover.stop.prevent="handleQuestionActions"
    @mouseout.stop.prevent="handleQuestionActions"
  >
    <div class="shiti-item-content">
      <table class="shiti-title-table" style="border-collapse: collapse;border: none;">
        <tr class="shiti-title-row">
          <td class="shiti-title-col" style="border: none;vertical-align: text-top; ">
            <span class="shiti-sort">{{ itemData.sortKey }}、</span>
          </td>
          <!-- <td  class="shiti-title-col" style="width: 20px; border: none;">
            <span class="shiti-score">（{{ itemData.score }}分）</span>
          </td> -->
          <td class="shiti-title-col" style="border: none;vertical-align: text-top; ">
            <div class="shiti-title-content" style="font-size: 14px;" v-html="itemData.title"></div>
          </td>
        </tr>
      </table>

      <table
        class="shiti-opts-list"
        v-if="itemData.questionType == 1 || itemData.questionType == 2"
        style="border-collapse: collapse;border: none;"
      >
        <tr class="shiti-opts-row" v-for="(item, index) in optionsListData" :key="index">
          <td class="shiti-opts-col" style="border: none;vertical-align: text-top;text-align: left; ">
            <span class="shiti-opts-bs" style="font-size: 16px;">{{ item.sort | getCharsByNum }}.</span>
          </td>
          <td class="shiti-opts-col" style="border: none;vertical-align: text-top;text-align: left; ">
            <div class="shiti-opts-item" style="font-size: 16px;" v-html="item.optionContent"></div>
          </td>
        </tr>
      </table>

      <!-- <table class="shiti-opts-list" v-if="itemData.questionType == 3">
        <tr class="shiti-opts-row">
          <td class="shiti-opts-col" style="width:120px; border: none;">
            <span class="shiti-opts-bs" style="font-size: 14px;">T:</span>
            <span class="shiti-opts-bs" style="font-size: 14px;">正确</span>
          </td>
          <td class="shiti-opts-col" style="width:120px; border: none;">
            <span class="shiti-opts-bs" style="font-size: 14px;">F:</span>
            <span class="shiti-opts-bs" style="font-size: 14px;">错误</span>
          </td>
        </tr>
      </table> -->

      <template v-if="itemData.questionType == 5 || itemData.questionType == 7 || itemData.questionType == 8">
        <p v-for="k in 10" :key="k">
          <br />
        </p>
      </template>
    </div>
    <div class="shiti-acitons" v-show="!!showItemActions">
      <a-button size="small" type="link" @click="handleShowDetail">详情</a-button>
      <a-button size="small" type="link" @click="handleShowReplaceModal">换题</a-button>
      <a-button size="small" type="link" @click="handleMoveUp">上移</a-button>
      <a-button size="small" type="link" @click="handleMoveDwon">下移</a-button>
      <a-button size="small" type="link" @click="handleDeleteTestItem">删除</a-button>
    </div>

    <!--试题详情的弹框-->
    <a-modal
      title="题目详细"
      :visible="visible"
      :confirm-loading="confirmLoading"
      :getContainer="() => $refs['shitiDom' + itemData.sortKey]"
      @ok="handleOk"
      @cancel="handleCancel"
      class="shiti-detail-container"
    >
      <div class="shiti-answer-box">
        <div class="shiti-answer-section">
          <span class="type-label">【答案】</span>
          <div class="answer-content" v-if="itemData.questionType == 1 || itemData.questionType == 2">
            <span v-for="(item, index) in answerOpts" :key="index">{{ item | getCharsByNum }}</span>
          </div>
          <div class="answer-content" v-else-if="itemData.questionType == 3">
            <span v-if="itemData.answer == 1">正确</span>
            <span v-else-if="itemData.answer == 2">错误</span>
            <span v-else>未知</span>
          </div>
          <div class="answer-content" v-else v-html="itemData.answer"></div>
        </div>
        <div class="shiti-answer-section">
          <span class="type-label">【解析】</span>
          <div class="answer-analysis" v-html="itemData.analysis"></div>
        </div>
        <div class="shiti-answer-section">
          <span class="type-label">【知识点】</span>
          <div class="shiti-kownledge-list">
            <div class="shiti-kownledge-item-container" v-for="(k, idx) in itemData.knowledgeList" :key="idx">
              <span class="shiti-kownledge-item" v-html="k.content"></span>
              <span class="divide-v-line" v-if="idx < itemData.knowledgeList.length - 1">|</span>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import TYPELIST from './../data/test_data'
import { tikuApiList } from '@/api/api'
export default {
  name: 'TestPaperGroupQuestionItem', //试卷的大题里的小题子项组件
  mixins: [],
  components: {},
  props: {
    initData: {
      type: Object,
      default: () => {
        return {}
      },
      required: false
    }
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      showItemActions: false,
      itemData: Object.assign({}, this.initData)
    }
  },
  computed: {
    optionsListData() {
      let res = []
      res =
        !!this.itemData && !!this.itemData.optionList && this.itemData.optionList.length > 0
          ? this.itemData.optionList
          : []
      return res
    },
    answerOpts() {
      let arr = []
      if (this.itemData.questionType == 1 || this.itemData.questionType == 2) {
        arr = this.itemData.answer.split(',')
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
    handleQuestionActions() {
      this.showItemActions = !this.showItemActions
    },
    closeModal() {
      this.visible = false
    },
    handleOk(e) {
      this.closeModal()
    },
    handleCancel(e) {
      this.closeModal()
    },
    handleShowDetail() {
      this.visible = true
    },
    handleShowReplaceModal() {
      this.$emit('doReplace', this.itemData)
    },
    handleMoveUp() {
      let opts = {
        paperId: this.paperId,
        paperQuestionId: this.itemData.id,
        moveType: 1
      }
      this.moveTpQuestionById(opts)
    },
    handleMoveDwon() {
      let opts = {
        paperId: this.paperId,
        paperQuestionId: this.itemData.id,
        moveType: 2
      }
      this.moveTpQuestionById(opts)
    },
    handleDeleteTestItem() {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '确认从试卷中删除此小题吗?',
        onOk: () => {
          that.deleteTpQuestionById()
        }
      })
    },
    moveTpQuestionById(opts) {
      if (!!opts.paperQuestionId) {
        let moveText = opts.moveType == 1 ? '上移' : '下移'
        tikuApiList.moveTpQuestionById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || `小题${moveText}成功！`)
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || `小题${moveText}失败！`)
          }
        })
      } else {
        this.$message.error('paperQuestionId不存在，请联系开发人员！')
      }
    },
    deleteTpQuestionById() {
      let opts = {
        paperId: this.paperId,
        paperQuestionId: this.itemData.id
      }
      if (!!opts.paperQuestionId) {
        tikuApiList.deleteTpQuestionById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '从试卷中删除成功！')
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '从试卷中删除失败！')
          }
        })
      } else {
        this.$message.error('paperQuestionId不存在，请联系开发人员！')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.shiti-item-control {
  margin: 5px 0;
  padding-bottom: 5px;

  .shiti-item-content {
    table.shiti-title-table {
      padding-bottom: 5px;
      .shiti-title-row {
        .shiti-title-col {
          .shiti-score {
            font-size: 16px;
          }

          .shiti-title-content {
            font-size: 16px;

            /deep/p {
              margin: 0;
              padding: 0;
              font-size: 16px;
              font-weight: 400;
            }

            /deep/span {
              font-size: 16px;
              font-weight: 400;
            }
          }
        }
      }
    }

    table.shiti-opts-list {
      overflow: hidden;

      tr.shiti-opts-row {
        margin-right: 20px;

        td.shiti-opts-col {
          .shiti-opts-bs {
            font-size: 16px;
          }

          .shiti-opts-item {
            margin-left: 0;

            /deep/p {
              margin: 0;
              padding: 0;
              font-size: 16px;
              font-weight: 400;
            }

            /deep/span {
              font-size: 16px;
              font-weight: 400;
            }
          }
        }
      }
    }

    p,
    span {
      font-size: 16px;
      font-weight: 400;
    }

    p {
      margin: 0;
      padding: 0;
    }
  }

  .shiti-acitons {
    padding: 5px 0;
    text-align: right;
    background-color: #e8e8e8;
  }

  .shiti-detail-container {
    .shiti-answer-box {
      .shiti-answer-section {
        padding: 5px 0;
        font-size: 16px;
        font-weight: 400;

        .type-label {
          display: inline-block;
          font-weight: bold;
          color: #409eff;
          vertical-align: top;
        }

        div.answer-content,
        div.answer-analysis {
          display: inline-block;
          font-size: 16px;
          font-weight: 400;
          vertical-align: top;

          p,
          span {
            font-size: 16px;
            font-weight: 400;
          }

          /deep/p {
            margin: 0;
            padding: 0;
          }
        }

        .shiti-kownledge-list {
          display: inline-block;

          .shiti-kownledge-item-container {
            display: inline-block;

            .shiti-kownledge-item {
              padding: 0 2px;
            }

            .divide-v-line {
              padding: 0 5px;
            }
          }
        }
      }
    }
  }
}

.shiti-border {
  border: 1px solid #409eff;
}
</style>

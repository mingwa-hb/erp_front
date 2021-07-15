<template>
  <div class="shiti-item-control">
    <p
      v-if="itemData.sortKey > 1"
      class="group-section-nowrap"
      style="width: 100%;height: 0.25em; margin: 0;padding:0;"
    >
      <br />
    </p>
    <p v-else class="group-section-nowrap" style="width: 100%;height: 0.05em; margin: 0;padding:0;"><br /></p>
    <div class="shiti-item-content">
      <table class="shiti-title-table" style="border-collapse: collapse;border: none;">
        <tr class="shiti-title-row">
          <td class="shiti-title-col" style="border: none;vertical-align: text-top; ">
            <span class="shiti-sort">{{ itemData.sortKey }}、</span>
          </td>
          <td class="shiti-title-col" style="border: none;vertical-align: text-top; ">
            <div class="shiti-title-content" v-html="itemData.title"></div>
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
            <span class="shiti-opts-bs" style="font-size: 14px;">{{ item.sort | getCharsByNum }}.</span>
          </td>
          <td class="shiti-opts-col" style="border: none;vertical-align: text-top; text-align: left;">
            <div class="shiti-opts-item" style="font-size: 14px;" v-html="item.optionContent"></div>
          </td>
        </tr>
      </table>

      <template v-if="itemData.questionType == 5 || itemData.questionType == 7 || itemData.questionType == 8">
        <p v-for="k in 10" :key="k">
          <br />
        </p>
      </template>
    </div>
  </div>
</template>

<script>
import TYPELIST from './../data/test_data'
import { tikuApiList } from '@/api/api'
export default {
  name: 'PreviewTestPaperGroupQuestionItem', //预览试卷的大题里的小题子项组件
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
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.shiti-item-control {
  margin: 0;
  padding-bottom: 0;

  p.group-section-nowrap {
    width: 100%;
    height: 0.25em;
    margin: 5px 0 !important;
    padding: 0;
    font-size: 20px;
  }

  .shiti-item-content {
    table.shiti-title-table {
      padding-bottom: 5px;
      .shiti-title-row {
        .shiti-title-col {
          .shiti-score {
            font-size: 14px;
          }

          .shiti-title-content {
            font-size: 14px;

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
        td.shiti-opts-col {
          .shiti-opts-bs {
            font-size: 14px;
          }

          .shiti-opts-item {
            margin-left: 0;

            /deep/p {
              margin: 0;
              padding: 0;
              font-size: 14px;
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
      font-size: 14px;
      font-weight: 400;
    }

    p {
      margin: 0;
      padding: 0;
    }
  }
}
</style>

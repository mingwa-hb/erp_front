<template>
  <div class="group-section-box">
    <p class="group-section-nowrap" style="width: 100%;height: 3em;"><br /></p>
    <div v-if="groupScoreArea" class="group-pingfen-container">
      <table class="group-pingfen-table" style="border-collapse: collapse;border: 2px solid #333333;">
        <tr class="pingfen-row-tr">
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;text-align: center;">得分</td>
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;"></td>
        </tr>
        <tr class="pingfen-row-tr">
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;text-align: center;">评分人</td>
          <td class="pingfen-row-td" style="width: 100px; border: 1px solid #333333;"></td>
        </tr>
      </table>
    </div>
    <div class="group-shiti-container">
      <div class="group-shiti-head">
        <h3 class="group-shiti-title">
          <span>{{ itemData.sortKey | getCapitalizeByNum }}、</span>
          <span>{{ itemData.title }}</span>
          <!-- <span>（共{{ itemData.score }}分）</span> -->
        </h3>
      </div>
      <div class="group-shiti-list">
        <div class="group-shiti-wrap">
          <PreviewTestPaperGroupQuestionItem v-for="k in itemData.questionList" :key="k.sortKey" :init-data="k" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tikuApiList } from '@/api/api'
import PreviewTestPaperGroupQuestionItem from './PreviewTestPaperGroupQuestionItem'
export default {
  name: 'PreviewTestPaperGroupItem', //预览试卷的大题子项组件
  mixins: [],
  components: { PreviewTestPaperGroupQuestionItem },
  props: {
    initData: {
      type: Object,
      default: () => {
        return null
      },
      required: false
    },
    groupScoreArea: {
      type: Boolean,
      default: () => {
        return false
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
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    }
  },
  created() {},
  filters: {
    getCapitalizeByNum(num) {
      let res = undefined
      let chineseArr = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      res = chineseArr[num * 1]
      return res
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
    handleGroupActions() {
      this.showGroupActions = !this.showGroupActions
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.group-section-box {
  padding: 0 10px;
  background-color: #ffffff;

  p.group-section-nowrap {
    width: 100%;
    height: 3em;
    margin: 0;
    padding: 0;
    font-size: 20px;
  }

  .group-pingfen-container {
    border-radius: 2px;

    .group-pingfen-table {
      border: 1px solid #e8e8e8;
      border-collapse: collapse;

      .pingfen-row-tr {
        .pingfen-row-td {
          width: 100px;
          padding: 5px;
          border: 1px solid #e8e8e8;
        }
      }
    }
  }

  .group-shiti-container {
    margin-top: 10px;
    padding-top: 5px;
    border: 1px solid transparent;

    .group-shiti-head {
      .group-shiti-title {
        font-size: 14px;
        font-weight: 600;
      }
    }

    .group-shiti-list {
      .group-shiti-wrap {
        font-size: 14px;
      }
    }
  }
}
</style>

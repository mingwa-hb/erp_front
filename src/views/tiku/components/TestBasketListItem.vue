<template>
  <div class="basket-list-group-item">
    <div class="basket-list-group-item-control">
      <p class="info-group">
        <span class="question-type">{{ itemData.questionTypeStr }}</span>
        <span class="question-num">({{ groupQuestionNum }})</span>
      </p>
      <p class="icon-group">
        <a-icon :type="!!showTestList ? 'caret-down' : 'caret-up'" @click.stop.prevent="handleShowTestList" />
        <a-icon type="close" @click="handleDeleteGroupItem" />
      </p>
    </div>
    <div class="basket-list-test-wrap" v-show="!!showTestList">
      <div class="basket-list-test-wrap_view">
        <TestBasketQuestionItem
          v-for="(item, index) in questionListData"
          :key="index"
          :init-data="item"
          :question-type="itemData.questionType"
          @renovate="hanldeAfterDelete"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { tikuApiList } from '@/api/api'
import TestBasketQuestionItem from './TestBasketQuestionItem'
export default {
  name: 'TestBasketListItem', //试题篮的子项组件
  mixins: [],
  components: { TestBasketQuestionItem },
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
      showTestList: false,
      itemData: Object.assign({}, this.initData)
    }
  },
  computed: {
    groupQuestionNum() {
      let res = 0
      res =
        !!this.itemData && !!this.itemData.questionList && this.itemData.questionList.length > 0
          ? this.itemData.questionList.length
          : 0
      return res
    },
    questionListData() {
      let res = []
      res =
        !!this.itemData && !!this.itemData.questionList && this.itemData.questionList.length > 0
          ? this.itemData.questionList
          : []
      return res
    }
  },
  created() {},
  filters: {},
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
    handleShowTestList() {
      this.showTestList = !this.showTestList
    },
    hanldeAfterDelete(data) {
      this.$emit('renovate', data)
    },
    handleDeleteGroupItem() {
      let that = this
      this.$confirm({
        title: '重要警告！',
        content: '确认从试题篮中删除此大题吗?',
        onOk: () => {
          that.deleteTpGroupById()
        }
      })
    },
    deleteTpGroupById() {
      let opts = {
        paperId: this.paperId,
        groupId: this.itemData.id
      }
      if (!!opts.groupId) {
        tikuApiList.deleteTpGroupById(opts).then(res => {
          if (res.code == 0 || (res.code == 200 && !!res.success)) {
            this.$message.success(res.message || '从试题篮中删除成功！')
            setTimeout(() => {
              this.$emit('renovate', this.itemData)
            })
          } else {
            this.$message.error(res.message || '从试题篮中删除失败！')
          }
        })
      } else {
        this.$message.error('groupId不存在，请联系开发人员！')
      }
    }
  },
  mounted() {}
}
</script>
<style lang="less" scoped>
.basket-list-group-item {
  .basket-list-group-item-control {
    display: flex;
    .info-group,
    .icon-group {
      padding-top: 10px;
      margin-bottom: 10px;
      font-size: 14px;
    }

    .info-group {
      flex: 1;
      padding-left: 5px;
      text-align: left;
      font-weight: bold;
    }

    .icon-group {
      width: 60px;
      .anticon {
        width: 30px;
        color: #409eff;
      }
    }
  }

  .basket-list-test-wrap {
    padding-left: 13px;
    background-color: #eeeeee;

    .basket-list-test-wrap_view {
      background-color: #eeeeee;
    }
  }
}
</style>

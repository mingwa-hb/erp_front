<template>
  <div class="test-basket-container">
    <a-button
      size="large"
      class="btn-fix"
      type="primary"
      icon="shop"
      @click="handleShowBasketList"
      :disabled="initData.length == 0"
    >
      试题篮（{{ questionTotalNum }}）
    </a-button>
    <div class="basket-list-wrap" v-show="showBasketContainer">
      <TestBasketListItem
        v-for="(item, index) in initData"
        :key="index"
        :init-data="item"
        @renovate="hanlderAfterDelete"
      />

      <div class="basket-action">
        <a-button type="primary" @click="doFormSubmit">
          生成试卷
        </a-button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TestBasketListItem from '../components/TestBasketListItem'
export default {
  name: 'TestBasketModuleForTestPaper', //试题篮
  components: { TestBasketListItem },
  props: {
    initData: {
      type: Array,
      default: () => {
        return []
      },
      required: false
    }
  },
  data() {
    return {
      showBasketContainer: false
    }
  },
  computed: {
    paperId() {
      let res = (!!this.$route.query && this.$route.query.paperId) || undefined
      return res
    },
    questionTotalNum() {
      let arr = this.initData || []
      let res = _.map(arr, 'questionList') || []
      let r = _.flattenDeep(res) || []
      return !!r && r.length > 0 ? r.length : 0
    }
  },
  created() {},
  watch: {},
  methods: {
    handleShowBasketList() {
      this.showBasketContainer = !this.showBasketContainer
    },
    hanlderAfterDelete(data) {
      this.$emit('renovate', data)
    },
    goToTqEditPaperPage(id) {
      this.$router.push({ path: '/itiku/EidtTestPaperPage', query: { paperId: id } })
    },
    goToNextPage(id) {
      if (!!id) {
        this.goToTqEditPaperPage(id)
      } else {
        this.$message.error('试卷ID没不存在，请返回列表页！')
      }
    },
    doFormSubmit() {
      this.doSendFormDataSubmit()
    },
    doSendFormDataSubmit() {
      let paperId = this.paperId
      this.goToNextPage(paperId)
    }
  }
}
</script>
<style lang="less" scoped>
.test-basket-container {
  position: relative;
  width: 100%;

  .btn-fix,
  .basket-list-wrap {
    width: 250px;
  }

  .basket-list-wrap {
    position: absolute;
    top: 40px;
    right: 0;
    padding-bottom: 10px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px #cccccc;
    opacity: 1;
    z-index: 9;

    .basket-action {
      width: 100%;
      text-align: center;
    }
  }
}
</style>

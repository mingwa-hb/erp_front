<template>
  <a-card class="list-card-container" :loading="loading" :bordered="true">
    <div class="list-card-header" slot="title">
      <slot name="header">
        <h3>
          {{ title }}
        </h3>
        <slot name="action">
          <div class="more" @click="goToMorePage">
            <span>{{ moreText }}</span>
            <a-badge v-if="totalNum > 5" :count="totalNum"> </a-badge>
            <a-icon type="double-right" style="font-size: 12px; color: #055df1" />
          </div>
        </slot>
      </slot>
    </div>
    <div class="list-card-wrap">
      <slot name="list"> </slot>
    </div>
    <div class="list-card-footer">
      <slot name="footer"></slot>
    </div>
  </a-card>
</template>

<script>
export default {
  name: 'ArticleListCard', //文章类列表组件
  mixins: [],
  components: {},
  props: {
    title: {
      type: String,
      default: '列表标题'
    },
    moreText: {
      type: String,
      default: '全部'
    },
    loading: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Array,
      default: () => {
        return []
      }
    },
    totalNum: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {},
  methods: {
    goToMorePage() {
      this.$emit('goToMorePage')
    }
  },
  mounted() {}
}
</script>

<style lang="less" scoped>
.list-card-container {
  padding: 0;

  /deep/.ant-card-head {
    padding: 0;
    border-bottom: transparent;

    .ant-card-head-title {
      padding: 0;
    }
  }
  /deep/.ant-card-body {
    padding: 0;
    .list-card-wrap {
      font-size: 14px;
    }
  }

  .list-card-header {
    position: relative;
    padding: 10px 15px 10px 20px;
    background-color: #f2f2f2;
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: bolder;
    }
    .more {
      position: absolute;
      top: 0;
      right: 0;
      margin-right: 15px;
      transform: translate(0, 50%);
      cursor: pointer;

      > span {
        color: #055df1;
        padding-right: 8px;
      }
    }
  }
}
</style>

<template>
  <div class="binding-line-wrap">
    <img src="https://mingwaerpbucket.oss-cn-beijing.aliyuncs.com/upload/777777_1619661140248.jpg" alt="装订线" />
  </div>
</template>

<script>
export default {
  name: 'BindLineImageForPreviewPaper', //装订线-试卷
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
    return {}
  },
  created() {},
  watch: {},
  methods: {}
}
</script>
<style lang="less" scoped>
.binding-line-wrap {
  width: 100%;

  img {
    width: 120px;
    height: 100%;
  }
}
</style>

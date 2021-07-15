<template>
  <div class="testpaper-base-info-wrap">
    <div class="info-item">
      <span class="info-item-label">项目分类：</span>
      <span class="info-item-content">{{ initData.projectTypeStr }}</span>
    </div>
    <div class="info-item">
      <span class="info-item-label">工种名称：</span>
      <span class="info-item-content">{{ initData.workTypeName }}</span>
    </div>
    <div class="info-item">
      <span class="info-item-label">工种等级：</span>
      <span class="info-item-content">{{ initData.workLevel }}</span>
    </div>
    <div class="info-item">
      <span class="info-item-label">试卷名称：</span>
      <span class="info-item-content">{{ initData.paperName }}</span>
    </div>
    <div class="info-item">
      <span class="info-item-label">组卷方式：</span>
      <span class="info-item-content">{{ initData.paperModeStr }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TestPaperBaseInfoModuleForTiku',
  props: {
    initData: {
      type: Object,
      default: () => {
        return null
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
.testpaper-base-info-wrap {
  .info-item {
    display: flex;
    padding: 5px 0;
    justify-content: center;
    align-items: flex-start;

    .info-item-label {
      width: 80px;
      margin-right: 10px;
      font-size: 14px;
      font-weight: bold;
      text-align: right;
    }
    .info-item-content {
      flex: 1;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      background-color: #ffffff;
    }
  }
}
</style>

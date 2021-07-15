<template>
  <div class="binding-line-wrap">
    <div class="group-table-box area-table-box">
      <span class="table-item-label">地区</span>
      <span class="table-item-content"></span>
    </div>
    <div class="group-table-box idcard-table-box">
      <span class="table-item-label">准考证号</span>
      <span class="table-item-content">
        <span v-for="k in 18" :key="k"></span>
      </span>
    </div>
    <div class="group-table-box name-table-box">
      <span class="table-item-label">姓名</span>
      <span class="table-item-content"></span>
    </div>
    <div class="group-table-box company-table-box">
      <span class="table-item-label">单位名称</span>
      <span class="table-item-content"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BindingLineModuleForTestPaper', //装订线-试卷
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
  display: flex;
  width: 100%;
  padding: 0 20px;
  justify-content: space-around;
  overflow: hidden;

  .group-table-box {
    padding-right: 10px;
    .table-item-label,
    .table-item-content {
      display: block;
      border: 1px solid #000000;
      text-align: center;
    }
    .table-item-label {
      letter-spacing: 10px;
      border-bottom: none;
    }

    .table-item-content {
      height: 20px;
      > span {
        display: table-cell;
        width: 20px;
        height: 20px;
        font-size: 20px;
        border-right: 1px solid #000000;
      }
      > span:last-of-type {
        border-right: none;
      }
    }
  }

  .area-table-box {
    width: 100px;
  }

  .idcard-table-box {
    width: 360px;
  }

  .name-table-box,
  .company-table-box {
    width: 200px;
  }
}
</style>

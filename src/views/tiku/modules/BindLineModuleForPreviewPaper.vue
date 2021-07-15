<template>
  <div class="binding-line-wrap">
    <div class="group-table-box company-table-box">
      <table class="group-item-table" style="border-collapse: collapse;border: 1px solid #333333;">
        <tr class="item-row-tr">
          <td class="item-row-td" style="width: 20px;height:200px; border: 1px solid #333333;">
            <span style="display:table-cell;">称</span>
            <span style="display:table-cell;">名</span>
            <span style="display:table-cell;">位</span>
            <span style="display:table-cell;">单</span>
          </td>
          <td class="item-row-td" style="width: 20px;height:200px; border: 1px solid #333333;"></td>
        </tr>
      </table>
    </div>
    <div class="group-table-box name-table-box">
      <table class="group-item-table" style="border-collapse: collapse;border: 1px solid #333333;">
        <tr class="item-row-tr">
          <td class="item-row-td" style="width: 20px;height:100px; border: 1px solid #333333;">
            <span style="display:table-cell;">名</span>
            <span style="display:table-cell;">姓</span>
          </td>
          <td class="item-row-td" style="width: 20px;height:100px; border: 1px solid #333333;"></td>
        </tr>
      </table>
    </div>
    <div class="group-table-box idcard-table-box">
      <table class="group-item-table" style="border-collapse: collapse;border: 1px solid #333333;">
        <tr class="item-row-tr" v-for="k in 18" :key="k">
          <td v-if="k == 1" rowspan="18" class="item-row-td" style="width: 20px;border: 1px solid #333333;">
            <span style="display:table-cell;">号</span>
            <span style="display:table-cell;">证</span>
            <span style="display:table-cell;">考</span>
            <span style="display:table-cell;">准</span>
          </td>
          <td class="item-row-td" style="width: 20px;height:20px; border: 1px solid #333333;"></td>
        </tr>
      </table>
    </div>
    <div class="group-table-box area-table-box">
      <table class="group-item-table" style="border-collapse: collapse;border: 1px solid #333333;">
        <tr class="item-row-tr">
          <td class="item-row-td" style="width: 20px;height:100px; border: 1px solid #333333;">
            <span style="display:table-cell;">区</span>
            <span style="display:table-cell;">地</span>
          </td>
          <td class="item-row-td" style="width: 20px;height:100px; border: 1px solid #333333;"></td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BindLineModuleForPreviewPaper', //装订线-试卷
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

  .group-table-box {
    width: 100%;
    margin: 20px 0;

    .group-item-table {
      .item-row-tr {
        .item-row-td {
          > span {
            float: left;
            width: 20px;
            transform: rotate(-90deg);
            transform-origin: center center;
          }
        }
      }
    }
  }
}
</style>

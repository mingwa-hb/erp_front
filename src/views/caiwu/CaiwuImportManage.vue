<template>
  <a-card class="page-container" :bordered="false">
    <a-row>
      <a-col :span="12">
        <ImportForReceiptModule />
      </a-col>
      <a-col :span="12">
        <ImportForRefundModule />
      </a-col>
    </a-row>
  </a-card>
</template>

<script>
import ImportForReceiptModule from './modules/ImportForReceiptModule'
import ImportForRefundModule from './modules/ImportForRefundModule'
export default {
  name: 'CaiwuImportManage', //草财务退款收款导入
  mixins: [],
  components: { ImportForReceiptModule, ImportForRefundModule },
  props: {},
  data() {
    return {}
  },
  computed: {},
  created() {},
  watch: {},
  methods: {},
  mounted() {}
}
</script>
<style lang="less" scoped></style>

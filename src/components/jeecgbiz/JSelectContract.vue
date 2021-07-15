<template>
  <j-select-biz-component :width="1600" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectContract',
  components: { JSelectBizComponent },
  props: ['value'],
  data() {
    return {
      settings: {
        name: '合同',
        displayKey: 'contractNo',
        returnKeys: ['contractNo', 'contractNo'],
        listUrl: '/erp/stuContract/getContracts?dataStatus=4',
        queryParamCode: 'contractNo',
        queryParamText: '合同编号',
        columns: [
          { title: '合同编号', dataIndex: 'contractNo', align: 'center', width: '30%', widthRight: '70%' },
          { title: '应付合同金额(元)', dataIndex: 'totalAmount', align: 'center', width: '30%', widthRight: '70%' },
          { title: '应付首付款(元)', dataIndex: 'duePayment', align: 'center', width: '30%', widthRight: '70%' },
          { title: '实付首付款(元)', dataIndex: 'actDuePayment', align: 'center', width: '30%', widthRight: '70%' },
          { title: '首付日期', dataIndex: 'firstPayDate', align: 'center', width: '30%', widthRight: '70%' },
          { title: '应付尾款(元)', dataIndex: 'dueBalance', align: 'center', width: '30%', widthRight: '70%' },
          { title: '实付尾款(元)', dataIndex: 'actBalance', align: 'center', width: '30%', widthRight: '70%' },
          { title: '尾款支付日期', dataIndex: 'balancePaymentDate', align: 'center', width: '30%', widthRight: '70%' },
          { title: '签订日期', dataIndex: 'signDate', align: 'center', width: '30%', widthRight: '70%' },
          { title: '合同截止日期', dataIndex: 'deadLine', align: 'center', width: '30%', widthRight: '70%' }
        ]
      }
    }
  },
  computed: {
    configs() {
      return Object.assign({ value: this.value }, this.settings, this.$attrs)
    }
  }
}
</script>

<style lang="less" scoped></style>

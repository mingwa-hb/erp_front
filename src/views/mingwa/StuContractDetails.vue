<template>
  <a-card>
    <stu-contract-base-information @fromBaseChild="getBaseChild" :data-status="dataStatus" />
    <stu-contract-gathering :Amount="Amount" :data-status="dataStatus" />
    <stu-contract-refund :Amount="Amount" :data-status="dataStatus" />
    <stu-contract-exam-information />
  </a-card>
</template>

<script>
import StuContractBaseInformation from './StuContractBaseInformation'
import StuContractGathering from './StuContractGathering'
import StuContractRefund from './StuContractRefund'
import StuContractExamInformation from './StuContractExamInformation'
export default {
  name: 'StuContractDetails', //合同详情
  components: { StuContractBaseInformation, StuContractGathering, StuContractRefund, StuContractExamInformation },
  props: {},
  data() {
    return {
      Amount: undefined
    }
  },
  computed: {
    dataStatus() {
      let res = (!!this.$route.query && !!this.$route.query.dataStatus && this.$route.query.dataStatus) || 0
      return res
    }
  },
  created() {},
  methods: {
    getBaseChild(v) {
      this.Amount = v
    }
  },
  mounted() {}
}
</script>

<style scoped lang="less"></style>

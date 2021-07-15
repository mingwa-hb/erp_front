<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectCompanyForWorksheet',
  components: { JSelectBizComponent },
  props: ['value'],
  data() {
    return {
      settings: {
        name: '公司名称',
        displayKey: 'companyName',
        returnId: false,
        returnKeys: ['companyName', 'companyId'],
        listUrl: '/erp/stuReportProcess/getProjectProcess',
        queryParamCode: 'companyName',
        queryParamText: '公司名称',
        columns: [
          { title: '公司名称', dataIndex: 'companyName', align: 'center', widthRight: '100' },
          {
            title: '合同编号',
            dataIndex: 'contractNo',
            align: 'center'
          },
          {
            title: '总报名人数',
            dataIndex: 'totalApplyNum',
            align: 'center'
          },
          {
            title: '总报名证数',
            dataIndex: 'applyCertNum',
            align: 'center'
          },
          {
            title: '总价',
            dataIndex: 'totalAmount',
            align: 'center'
          },
          {
            title: '项目经理',
            dataIndex: 'manager',
            align: 'center'
          }
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

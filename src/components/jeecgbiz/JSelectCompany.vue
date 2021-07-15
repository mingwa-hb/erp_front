<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectCompany',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '公司',
          displayKey: 'name',
          returnKeys: ['name', 'id'],
          listUrl: '/erp/stuCompany/getCompanies',
          queryParamCode: 'companyName',
          queryParamText: '公司',
          columns: [
            { title: '公司', dataIndex: 'name', align: 'center', width: '30%', widthRight: '70%' }
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
<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectSymbol',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '股票名称',
          displayKey: 'name',
          returnKeys: ['name', 'symbol'],
          listUrl: '/erp/oriStock/list',
          queryParamCode: 'name',
          queryParamText: '股票名称',
          columns: [
            { title: '股票名称', dataIndex: 'name', align: 'center', width: '30%', widthRight: '70%' }
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
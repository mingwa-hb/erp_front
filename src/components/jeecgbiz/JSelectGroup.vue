<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners"/>
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectGroup',
    components: { JSelectBizComponent },
    props: ['value'],
    data() {
      return {
        settings: {
          name: '分组',
          displayKey: 'name',
          returnKeys: ['name', 'id'],
          listUrl: '/erp/stockGroup/list',
          queryParamCode: 'name',
          queryParamText: '分组名称',
          columns: [
            { title: '分组名称', dataIndex: 'name', align: 'center', width: '30%', widthRight: '70%' }
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
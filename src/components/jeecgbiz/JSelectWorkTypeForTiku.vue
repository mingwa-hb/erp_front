<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectWorkTypeForTiku',
  components: { JSelectBizComponent },
  props: ['value'],
  data() {
    return {
      settings: {
        name: '工种类型',
        displayKey: 'workTypeName',
        returnId: true,
        returnKeys: ['workTypeName', 'id'],
        listUrl: '/erp/stuWorkType/getSelectedWorkType',
        queryParamCode: 'workTypeName',
        queryParamText: '工种名称',
        columns: [{ title: '工种名称', dataIndex: 'workTypeName', align: 'left', widthRight: '200' }]
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

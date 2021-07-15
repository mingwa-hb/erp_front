<template>
  <j-select-get-work-type :value="value" :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectGetWorkType from './JSelectGetWorkType'

export default {
  name: 'JSelectWorkType',
  components: { JSelectGetWorkType },
  props: ['value'],
  data() {
    return {
      settings: {
        name: '工种',
        displayKey: 'workTypeName',
        returnId: true,
        returnKeys: ['workTypeName', 'id'],
        listUrl: '/erp/stuWorkType/getSelectedWorkType',
        queryParamCode: 'workTypeName',
        queryParamText: '工种',
        columns: [{ title: '工种', dataIndex: 'workTypeName', align: 'center', widthRight: '200' }]
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

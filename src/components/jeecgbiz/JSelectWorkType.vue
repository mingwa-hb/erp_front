<template>
  <j-select-biz-component :value="value" :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectWorkType',
  components: { JSelectBizComponent },
  props: ['value'],
  data() {
    return {
      settings: {
        name: '工种',
        displayKey: 'workType',
        returnId: false,
        returnKeys: ['workType', 'id'],
        listUrl: '/erp/stuWorkType/getWorkTypes',
        queryParamCode: 'workType',
        queryParamText: '工种',
        columns: [{ title: '工种/等级', dataIndex: 'workType', align: 'center', width: '30%', widthRight: '70%' }]
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

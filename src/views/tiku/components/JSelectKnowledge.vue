<template>
  <j-select-biz-component :value="value" :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectKnowledge',
  components: { JSelectBizComponent },
  props: ['value'],
  data() {
    return {
      settings: {
        name: '知识点',
        displayKey: 'content',
        returnId: true,
        returnKeys: ['content', 'id'],
        listUrl: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree',
        queryParamCode: 'content',
        queryParamText: '知识点',
        columns: [{ title: '知识点', dataIndex: 'content', align: 'left', width: '30%', widthRight: '70%' }]
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

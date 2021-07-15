<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectApplyInfo',
  components: { JSelectBizComponent },
  // props: ['value'],
  props: {
    value: null, // any type
    queryConfig: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      settings: {
        name: '报名编号',
        displayKey: 'id',
        returnKeys: ['id', 'id'],
        listUrl: '/erp/stuApplyInfo/getApplyInfos?dataStatus=4&canUse=canExam&status='+encodeURI('正常'),
        queryParamCode: 'userName',
        queryParamText: '学员姓名',
        columns: [
          { title: '报名编号', dataIndex: 'id', align: 'center', width: '30%', widthRight: '70%' },
          { title: '合同编号', dataIndex: 'contractNo', align: 'center', width: '30%', widthRight: '70%' },
          { title: '姓名', dataIndex: 'userName', align: 'center', width: '30%', widthRight: '70%' },
          { title: '身份证号码', dataIndex: 'idCard', align: 'center', width: '30%', widthRight: '70%' },
          { title: '工种/等级', dataIndex: 'workType', align: 'center', width: '30%', widthRight: '70%' },
          { title: '手机号码', dataIndex: 'mobile', align: 'center', width: '30%', widthRight: '70%' },
          { title: '性别', dataIndex: 'sexShow', align: 'center', width: '30%', widthRight: '70%' }
        ]
      },
      // 多条件查询配置
      queryConfigDefault: [
        {
          key: 'id',
          label: '报名编号'
        },
        {
          key: 'contractNo',
          label: '合同编号'
        }
      ]
    }
  },
  computed: {
    configs() {
      return Object.assign(
        { value: this.value, queryConfig: this.queryConfigDefault.concat(this.queryConfig) },
        this.settings,
        this.$attrs
      )
    }
  }
}
</script>

<style lang="less" scoped></style>

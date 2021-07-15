<template>
  <j-select-biz-component :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectPaper',
  components: { JSelectBizComponent },
  props: ['value','projectType','paperType','paperMode','paperScope','workTypeId'],
  data() {
    // let listUrl =  '/mw-exam/erp/exam/paper/queryPageByUrlParam?projectType='+this.projectType+'&paperType='+this.paperType+'&paperMode='+this.paperMode+'&paperScope='+this.paperScope+'&workTypeId='+this.workTypeId
    // console.log(listUrl)
    return {
      settings: {
        name: '试卷',
        displayKey: 'paperName',
        // returnId: true,
        returnKeys: ['paperName', 'id'],
        listUrl: undefined,
        queryParamCode: 'paperName',
        queryParamText: '试卷名称',
        columns: [
          { title: '试卷名称', dataIndex: 'paperName', align: 'left', width: '30%', widthRight: '70%' },
          { title: '工种名称', dataIndex: 'workTypeName', align: 'left', width: '20%', widthRight: '70%' },
          { title: '工种等级', dataIndex: 'workTypeLevel', align: 'left', width: '20%', widthRight: '70%' },
          { title: '试题范围', dataIndex: 'paperScopeStr', align: 'left', width: '30%', widthRight: '70%' },
        ]
      }
    }
  },
  computed: {
    configs() {
      return Object.assign({ value: this.value }, this.settings, this.$attrs)
    }
  },
  watch: {
    workTypeId: {
      deep: true,
      immediate: true,
      handler: function(newV,oldV){
        if(!!newV){
          let that = this;
          let opts = {
            projectType: that.projectType,
            paperType: that.paperType,
            paperMode: that.paperMode,
            paperScope: that.paperScope,
            workTypeId: newV
          }
          this.setListUrl(opts)
        }
      }
    }
  },
  methods:{
    setListUrl(prams){
      let res = "/mw-exam/erp/exam/paper/queryPageByUrlParam";
      let str = ''
      for(let key in prams){
        str += `${key}=${prams[key]}&`
      }
      str = str.substring(0, str.length - 1)
      this.settings.listUrl = `${res}?${str}`
    }
  }
}
</script>

<style lang="less" scoped></style>

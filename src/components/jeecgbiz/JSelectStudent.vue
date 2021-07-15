<template>
  <j-select-biz-component
    :value="value"
    :ellipsisLength="25"
    :listUrl="url.list"
    :columns="columns"
    v-on="$listeners"
    v-bind="attrs"
  />
</template>

<script>
  import JSelectBizComponent from './JSelectBizComponent'

  export default {
    name: 'JSelectStudent',
    components: { JSelectBizComponent },
    props: {
      value: null, // any type
      queryConfig: {
        type: Array,
        default: () => []
      },
    },
    // props: ['value'],
    data() {
      return {
        url: { list: '/erp/student/getStudents' },
        columns: [
          { title: '姓名', dataIndex: 'userName', align: 'center', width: '30%', widthRight: '70%' },
          { title: '手机号码', dataIndex: 'mobile', align: 'center', width: '30%', widthRight: '70%' },
          { title: '学习账号', dataIndex: 'account', align: 'center', width: '30%', widthRight: '70%' },
          { title: '身份证号码', dataIndex: 'idCard', align: 'center', width: '30%', widthRight: '70%' },
          { title: '性别', dataIndex: 'showSex', align: 'center', width: '30%', widthRight: '70%' },
          { title: '公司名称', dataIndex: 'companyName', align: 'center', width: '30%', widthRight: '70%' }
        ],
        // 定义在这里的参数都是可以在外部传递覆盖的，可以更灵活的定制化使用的组件
        default: {
          name: '学员',
          width: 1500,
          displayKey: 'userName',
          returnKeys: ['userName', 'id'],
          queryParamText: '学员姓名',
          queryParamCode: 'userName',
        },
        // 多条件查询配置
        queryConfigDefault: [
          {
            key:'mobile',
            label:'电话号码'
          },
          {
            key:'account',
            label:'学习账号',
          },
        ],
      }
    },
    computed: {
      attrs() {
        return Object.assign(this.default, this.$attrs, {
          queryConfig: this.queryConfigDefault.concat(this.queryConfig)
        })
      }
    }
  }
</script>

<style lang="less" scoped></style>
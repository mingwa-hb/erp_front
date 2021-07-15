<template>
  <j-select-biz-component :value="value" :width="1000" v-bind="configs" v-on="$listeners" />
</template>

<script>
import JSelectBizComponent from './JSelectBizComponent'

export default {
  name: 'JSelectUserByRole',
  components: { JSelectBizComponent },
  props: ['value', 'roleCode'],
  data() {
    return {
      settings: {
        name: '用户帐号',
        displayKey: 'realname',
        rowKey: 'username',
        returnId: true,
        returnKeys: ['username', 'id'],
        listUrl: undefined,
        queryParamCode: 'username',
        queryParamText: '用户帐号',
        columns: [
          {
            title: '用户姓名',
            dataIndex: 'realname'
          },
          {
            title: '用户账号',
            dataIndex: 'username'
          },
          {
            title: '性别',
            dataIndex: 'sex_dictText'
          },
          {
            title: '手机',
            dataIndex: 'phone'
          },
          {
            title: '部门',
            dataIndex: 'orgCodeTxt'
          }
        ]
      }
    }
  },
  computed: {
    listUrl({ roleCode }) {
      //   let res = `/sys/user/list?roleCodeList=${roleCode}`
      let res = `/sys/user/listByRoleCodeList?roleCodeList=${roleCode}`
      return res
    },
    configs({ settings, listUrl }) {
      let set = Object.assign({}, this.settings, { listUrl: listUrl })
      return Object.assign({ value: this.value }, set, this.$attrs)
    }
  }
}
</script>

<style lang="less" scoped></style>

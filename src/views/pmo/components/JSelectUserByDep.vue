<template>
  <div>
    <a-input-search v-model="userNames" placeholder="请选择用户" readOnly unselectable="on" @search="onSearchDepUser">
      <a-button slot="enterButton" :disabled="disabled"
        >选择用户
        <i>
          <img src="../../../assets/jia.png" alt="" width="26px" />
        </i>
      </a-button>
    </a-input-search>
    <j-select-user-by-dep-modal
      ref="selectModal"
      v-if="modalVisible"
      :modal-width="modalWidth"
      :visible.sync="modalVisible"
      :multi="multi"
      @ok="selectOK"
      :user-ids="value"
      @initComp="initComp"
      :roleCode="roleCode"
    />
  </div>
</template>

<script>
import { getUserList } from '@/api/api'
import JSelectUserByDepModal from './modal/JSelectUserByDepModal'

export default {
  name: 'JSelectUserByDep',
  components: { JSelectUserByDepModal },
  props: {
    modalWidth: {
      type: Number,
      default: 1250,
      required: false
    },
    value: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },
    multi: {
      type: Boolean,
      default: true,
      required: false
    },
    account: {
      type: String
      // required: false
    },
    roleCode: {
      type: String,
      default: undefined
    }
  },
  data() {
    return {
      modalVisible: false,
      userIds: this.value,
      userNames: undefined
    }
  },
  watch: {
    value(val) {
      this.userIds = val
      this.initUserNames()
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  methods: {
    initComp(userNames) {
      this.userNames = userNames || undefined
    },
    onSearchDepUser() {
      // console.log(this.roleCode)
      // this.$refs.selectModal.showModal()
      this.modalVisible = true
    },
    selectOK(rows, idstr) {
      // console.log('当前选中用户', rows)
      // console.log('当前选中用户ID', idstr)
      if (!rows) {
        this.userNames = undefined
        this.userIds = undefined
      } else {
        let temp = ''
        for (let item of rows) {
          temp += ',' + item.realname
        }
        this.userNames = temp.substring(1)
        this.userIds = idstr
      }
      this.$emit('change', this.userIds, this.userNames)
    },
    initUserNames() {
      if (this.userIds) {
        // 这里最后加一个 , 的原因是因为无论如何都要使用 in 查询，防止后台进行了模糊匹配，导致查询结果不准确
        let values = this.userIds.split(',') + ','
        getUserList({
          username: values,
          pageNo: 1,
          pageSize: values.length
        }).then(res => {
          let realNames = []
          if (res.code == 200 || (res.code == 0 && !!res.success)) {
            let resp = res.result.records
            resp.forEach(user => {
              realNames.push(user['realname'])
            })
          }
          this.initComp(realNames.join(','))
        })
      } else {
        this.initComp(undefined)
      }
    }
  },
  mounted() {}
}
</script>

<style scoped></style>

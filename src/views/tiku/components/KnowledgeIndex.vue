<template>
  <a-row :bordered="false">
    <a-col>
      <a-input type="textarea" style="width: 75%;height:75px" placeholder="请选择关联知识点" v-model="content" />
      <a-button style="margin-left: 10px" type="primary" icon="search" @click="onclick">选择</a-button>
    </a-col>

    <!-- 一个测试 -->
    <Knowledge ref="modalForm222" :workTypeId="workTypeId" @getList="getList" />
  </a-row>
</template>

<script>
import Knowledge from './Knowledge'

export default {
  name: '',
  mixins: [],
  components: { Knowledge },
  props: {
    list: {
      type: Array,
      required: false,
      default: () => [],
    },
    workTypeId: {
      type: String,
      required: false,
      default: undefined,
    },
  },
  data() {
    return {
      value: undefined,
      titleList: [],
      content: undefined,
      content2: undefined,
      getIdList: [],
    }
  },
  watch: {
    list: {
      deep: true,
      immediate: true,
      handler(newVul, oldVul) {
        this.list = newVul
        if (newVul.length > 0) {
          this.getContent()
        } else {
          this.content = undefined
          this.getIdList = []
        }
      },
    },
  },
  computed: {},
  created() {},
  methods: {
    getContent() {
      let getContentList = []
      this.getIdList = []
      for (let i = 0; i < this.list.length; i++) {
        getContentList.push(this.list[i].content)
        this.getIdList.push(this.list[i].id)
      }
      if (this.content == this.content2) {
        this.content = getContentList.toString()
      } else {
        this.content = this.content2
      }
    },

    getList(val) {
      this.titleList = []
      for (let i = 0; i < val.length; i++) {
        this.titleList.push(val[i].title)
      }
      this.$forceUpdate()
      this.content2 = this.titleList.toString()
      this.$emit('ok', val)
    },

    onclick() {
      if (this.getIdList.length > 0) {
        this.$refs.modalForm222.add(this.getIdList)
      } else {
        this.$refs.modalForm222.add()
      }
      this.$refs.modalForm222.disableSubmit = false
    },
  },
  mounted() {},
}
</script>

<style scoped lang="less"></style>

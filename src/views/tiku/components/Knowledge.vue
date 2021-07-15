<template>
  <a-modal
    :title="title"
    width="40%"
    class="modal"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
    cancelText="关闭"
  >
    <a-spin :spinning="confirmLoading" style="height: 615px; overflow-y: auto">
      <a-tree
        checkable
        :tree-data="treeData"
        :checkedKeys="checkedKeys"
        :replaceFields="replaceFields"
        v-model="checkedKeys"
        @select="onSelect"
        @check="onCheck"
      >
        <!-- <span slot="title0010" style="color: #1890ff">sss</span> -->
      </a-tree>
    </a-spin>
  </a-modal>
</template>

<script>
import { getAction } from '@/api/manage'
import JDate from '@/components/jeecg/JDate'
import JEditor from '@/components/jeecg/JEditor'
import JFileUpload from '@/components/jeecg/JFileUpload'
import ACol from 'ant-design-vue/es/grid/Col'
import JSelectCompany from '@/components/jeecgbiz/JSelectCompany'
import JSelectUserByDep from '../../pmo/components/JSelectUserByDep'
import JUpload from '@/components/jeecg/JUpload'

export default {
  components: { ACol, JEditor, JDate, JSelectCompany, JFileUpload, JSelectUserByDep, JUpload },
  name: 'StuContractModal',
  props: ['workTypeId'],
  data() {
    return {
      name: 'Knowledge', //知识点新增编辑弹框
      treeData: [],
      workTypeList: [],
      workTypeListTwo: [],
      workTypeListThree: [],
      keyList: [],
      title: '选择知识点',
      visible: false,
      content: undefined,
      contentList: [],
      defaultSelectedKeysList: [],
      checkedKeys: [],
      model: {},
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      confirmLoading: false,
      form: this.$form.createForm(this),
      replaceFields: {
        title: 'content',
        key: 'id',
      },
      url: {
        getTree: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledgeTree',
        queryKnowledge: '/mw-exam/erp/exam/mwExamKnowledge/queryKnowledge',
      },
    }
  },
  created() {},
  methods: {
    onSelect(selectedKeys, info) {
    },

    onCheck(checkedKeys, info) {
      this.contentList = []
      for (let i = 0; i < info.checkedNodesPositions.length; i++) {
        let obj = {
          title: info.checkedNodesPositions[i].node.data.props.dataRef.content,
          level: info.checkedNodesPositions[i].node.data.props.dataRef.level,
          id: info.checkedNodesPositions[i].node.data.props.dataRef.id,
        }
        this.contentList.push(obj)
      }
    },

    reSetFormVal() {
      this.$nextTick(() => {
        this.form.resetFields()
      })
    },

    add(val) {
      this.checkedKeys = []
      if (!!val) {
        this.checkedKeys = val
      } else {
        this.contentList=[]
        this.checkedKeys=[]
      }
      this.treeData = []
      this.visible = true
      let workTypeId=this.workTypeId
      getAction(this.url.queryKnowledge+'/'+workTypeId).then((res) => {
        if (res.code == 200 && !!res.message) {
          this.treeData = res.result
        }
      })
    },

    edit(record) {
      this.visible = true
      //   this.model = Object.assign({}, record)
    },

    close() {
      this.$emit('close')
      this.visible = false
    },

    handleOk() {
      this.visible = false
      this.$emit('getList', this.contentList)
    },
    handleCancel() {
      this.visible = false
      this.$emit('close')
    },
  },
}
</script>

<style scoped>
</style>
